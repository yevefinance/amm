import type { Address } from "@coral-xyz/anchor";
import {
	AddressUtil,
	type Instruction,
	TokenUtil,
	TransactionBuilder,
	ZERO,
	resolveOrCreateATAs,
} from "@orca-so/common-sdk";
import { NATIVE_MINT, getAssociatedTokenAddressSync } from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";
import invariant from "tiny-invariant";
import type { YevefiContext } from "../context";
import {
	type DecreaseLiquidityInput,
	type IncreaseLiquidityInput,
	collectFeesIx,
	collectRewardIx,
	decreaseLiquidityIx,
	increaseLiquidityIx,
	updateFeesAndRewardsIx,
} from "../instructions";
import {
	IGNORE_CACHE,
	PREFER_CACHE,
	type YevefiAccountFetchOptions,
} from "../network/public/fetcher";
import type {
	PositionData,
	TickArrayData,
	TickData,
	YevefiData,
} from "../types/public";
import { getTickArrayDataForPosition } from "../utils/builder/position-builder-util";
import { PDAUtil, PoolUtil, TickArrayUtil, TickUtil } from "../utils/public";
import {
	TokenMintTypes,
	getTokenMintsFromYevefis,
	resolveAtaForMints,
} from "../utils/yevefi-ata-utils";
import type { Position } from "../yevefi-client";

export class PositionImpl implements Position {
	private data: PositionData;
	private yevefiData: YevefiData;
	private lowerTickArrayData: TickArrayData;
	private upperTickArrayData: TickArrayData;
	constructor(
		readonly ctx: YevefiContext,
		readonly address: PublicKey,
		data: PositionData,
		yevefiData: YevefiData,
		lowerTickArrayData: TickArrayData,
		upperTickArrayData: TickArrayData,
	) {
		this.data = data;
		this.yevefiData = yevefiData;
		this.lowerTickArrayData = lowerTickArrayData;
		this.upperTickArrayData = upperTickArrayData;
	}

	getAddress(): PublicKey {
		return this.address;
	}

	getData(): PositionData {
		return this.data;
	}

	getYevefiData(): YevefiData {
		return this.yevefiData;
	}

	getLowerTickData(): TickData {
		return TickArrayUtil.getTickFromArray(
			this.lowerTickArrayData,
			this.data.tickLowerIndex,
			this.yevefiData.tickSpacing,
		);
	}

	getUpperTickData(): TickData {
		return TickArrayUtil.getTickFromArray(
			this.upperTickArrayData,
			this.data.tickUpperIndex,
			this.yevefiData.tickSpacing,
		);
	}

	async refreshData() {
		await this.refresh();
		return this.data;
	}

	async increaseLiquidity(
		liquidityInput: IncreaseLiquidityInput,
		resolveATA = true,
		sourceWallet?: Address,
		positionWallet?: Address,
		ataPayer?: Address,
	) {
		const sourceWalletKey = sourceWallet
			? AddressUtil.toPubKey(sourceWallet)
			: this.ctx.wallet.publicKey;
		const positionWalletKey = positionWallet
			? AddressUtil.toPubKey(positionWallet)
			: this.ctx.wallet.publicKey;
		const ataPayerKey = ataPayer
			? AddressUtil.toPubKey(ataPayer)
			: this.ctx.wallet.publicKey;

		const yevefi = await this.ctx.fetcher.getPool(
			this.data.yevefi,
			IGNORE_CACHE,
		);
		if (!yevefi) {
			throw new Error("Unable to fetch yevefi for this position.");
		}

		const txBuilder = new TransactionBuilder(
			this.ctx.provider.connection,
			this.ctx.provider.wallet,
			this.ctx.txBuilderOpts,
		);

		let tokenOwnerAccountA: PublicKey;
		let tokenOwnerAccountB: PublicKey;

		if (resolveATA) {
			const [ataA, ataB] = await resolveOrCreateATAs(
				this.ctx.connection,
				sourceWalletKey,
				[
					{
						tokenMint: yevefi.tokenMintA,
						wrappedSolAmountIn: liquidityInput.tokenMaxA,
					},
					{
						tokenMint: yevefi.tokenMintB,
						wrappedSolAmountIn: liquidityInput.tokenMaxB,
					},
				],
				() => this.ctx.fetcher.getAccountRentExempt(),
				ataPayerKey,
				undefined, // use default
				this.ctx.accountResolverOpts.allowPDAOwnerAddress,
				this.ctx.accountResolverOpts.createWrappedSolAccountMethod,
			);
			const { address: ataAddrA, ...tokenOwnerAccountAIx } = ataA!;
			const { address: ataAddrB, ...tokenOwnerAccountBIx } = ataB!;
			tokenOwnerAccountA = ataAddrA;
			tokenOwnerAccountB = ataAddrB;
			txBuilder.addInstruction(tokenOwnerAccountAIx);
			txBuilder.addInstruction(tokenOwnerAccountBIx);
		} else {
			tokenOwnerAccountA = getAssociatedTokenAddressSync(
				yevefi.tokenMintA,
				sourceWalletKey,
				this.ctx.accountResolverOpts.allowPDAOwnerAddress,
			);
			tokenOwnerAccountB = getAssociatedTokenAddressSync(
				yevefi.tokenMintB,
				sourceWalletKey,
				this.ctx.accountResolverOpts.allowPDAOwnerAddress,
			);
		}
		const positionTokenAccount = getAssociatedTokenAddressSync(
			this.data.positionMint,
			positionWalletKey,
			this.ctx.accountResolverOpts.allowPDAOwnerAddress,
		);

		const increaseIx = increaseLiquidityIx(this.ctx.program, {
			...liquidityInput,
			yevefi: this.data.yevefi,
			position: this.address,
			positionTokenAccount,
			tokenOwnerAccountA,
			tokenOwnerAccountB,
			tokenVaultA: yevefi.tokenVaultA,
			tokenVaultB: yevefi.tokenVaultB,
			tickArrayLower: PDAUtil.getTickArray(
				this.ctx.program.programId,
				this.data.yevefi,
				TickUtil.getStartTickIndex(
					this.data.tickLowerIndex,
					yevefi.tickSpacing,
				),
			).publicKey,
			tickArrayUpper: PDAUtil.getTickArray(
				this.ctx.program.programId,
				this.data.yevefi,
				TickUtil.getStartTickIndex(
					this.data.tickUpperIndex,
					yevefi.tickSpacing,
				),
			).publicKey,
			positionAuthority: positionWalletKey,
		});
		txBuilder.addInstruction(increaseIx);
		return txBuilder;
	}

	async decreaseLiquidity(
		liquidityInput: DecreaseLiquidityInput,
		resolveATA = true,
		sourceWallet?: Address,
		positionWallet?: Address,
		ataPayer?: Address,
	) {
		const sourceWalletKey = sourceWallet
			? AddressUtil.toPubKey(sourceWallet)
			: this.ctx.wallet.publicKey;
		const positionWalletKey = positionWallet
			? AddressUtil.toPubKey(positionWallet)
			: this.ctx.wallet.publicKey;
		const ataPayerKey = ataPayer
			? AddressUtil.toPubKey(ataPayer)
			: this.ctx.wallet.publicKey;
		const yevefi = await this.ctx.fetcher.getPool(
			this.data.yevefi,
			IGNORE_CACHE,
		);

		if (!yevefi) {
			throw new Error("Unable to fetch yevefi for this position.");
		}

		const txBuilder = new TransactionBuilder(
			this.ctx.provider.connection,
			this.ctx.provider.wallet,
			this.ctx.txBuilderOpts,
		);
		let tokenOwnerAccountA: PublicKey;
		let tokenOwnerAccountB: PublicKey;

		if (resolveATA) {
			const [ataA, ataB] = await resolveOrCreateATAs(
				this.ctx.connection,
				sourceWalletKey,
				[{ tokenMint: yevefi.tokenMintA }, { tokenMint: yevefi.tokenMintB }],
				() => this.ctx.fetcher.getAccountRentExempt(),
				ataPayerKey,
				undefined, // use default
				this.ctx.accountResolverOpts.allowPDAOwnerAddress,
				this.ctx.accountResolverOpts.createWrappedSolAccountMethod,
			);
			const { address: ataAddrA, ...tokenOwnerAccountAIx } = ataA!;
			const { address: ataAddrB, ...tokenOwnerAccountBIx } = ataB!;
			tokenOwnerAccountA = ataAddrA;
			tokenOwnerAccountB = ataAddrB;
			txBuilder.addInstruction(tokenOwnerAccountAIx);
			txBuilder.addInstruction(tokenOwnerAccountBIx);
		} else {
			tokenOwnerAccountA = getAssociatedTokenAddressSync(
				yevefi.tokenMintA,
				sourceWalletKey,
				this.ctx.accountResolverOpts.allowPDAOwnerAddress,
			);
			tokenOwnerAccountB = getAssociatedTokenAddressSync(
				yevefi.tokenMintB,
				sourceWalletKey,
				this.ctx.accountResolverOpts.allowPDAOwnerAddress,
			);
		}

		const decreaseIx = decreaseLiquidityIx(this.ctx.program, {
			...liquidityInput,
			yevefi: this.data.yevefi,
			position: this.address,
			positionTokenAccount: getAssociatedTokenAddressSync(
				this.data.positionMint,
				positionWalletKey,
				this.ctx.accountResolverOpts.allowPDAOwnerAddress,
			),
			tokenOwnerAccountA,
			tokenOwnerAccountB,
			tokenVaultA: yevefi.tokenVaultA,
			tokenVaultB: yevefi.tokenVaultB,
			tickArrayLower: PDAUtil.getTickArray(
				this.ctx.program.programId,
				this.data.yevefi,
				TickUtil.getStartTickIndex(
					this.data.tickLowerIndex,
					yevefi.tickSpacing,
				),
			).publicKey,
			tickArrayUpper: PDAUtil.getTickArray(
				this.ctx.program.programId,
				this.data.yevefi,
				TickUtil.getStartTickIndex(
					this.data.tickUpperIndex,
					yevefi.tickSpacing,
				),
			).publicKey,
			positionAuthority: positionWalletKey,
		});
		txBuilder.addInstruction(decreaseIx);
		return txBuilder;
	}

	async collectFees(
		updateFeesAndRewards = true,
		ownerTokenAccountMap?: Partial<Record<string, Address>>,
		destinationWallet?: Address,
		positionWallet?: Address,
		ataPayer?: Address,
		opts: YevefiAccountFetchOptions = PREFER_CACHE,
	): Promise<TransactionBuilder> {
		const [destinationWalletKey, positionWalletKey, ataPayerKey] =
			AddressUtil.toPubKeys([
				destinationWallet ?? this.ctx.wallet.publicKey,
				positionWallet ?? this.ctx.wallet.publicKey,
				ataPayer ?? this.ctx.wallet.publicKey,
			]);

		const yevefi = await this.ctx.fetcher.getPool(this.data.yevefi, opts);
		if (!yevefi) {
			throw new Error(
				`Unable to fetch yevefi (${this.data.yevefi}) for this position (${this.address}).`,
			);
		}

		const txBuilder = new TransactionBuilder(
			this.ctx.provider.connection,
			this.ctx.provider.wallet,
			this.ctx.txBuilderOpts,
		);

		const accountExemption = await this.ctx.fetcher.getAccountRentExempt();

		let ataMap = { ...ownerTokenAccountMap };

		if (!ownerTokenAccountMap) {
			const affliatedMints = getTokenMintsFromYevefis(
				[yevefi],
				TokenMintTypes.POOL_ONLY,
			);
			const { ataTokenAddresses: affliatedTokenAtaMap, resolveAtaIxs } =
				await resolveAtaForMints(this.ctx, {
					mints: affliatedMints.mintMap,
					accountExemption,
					receiver: destinationWalletKey,
					payer: ataPayerKey,
				});

			txBuilder.addInstructions(resolveAtaIxs);

			if (affliatedMints.hasNativeMint) {
				const { address: wSOLAta, ...resolveWSolIx } =
					TokenUtil.createWrappedNativeAccountInstruction(
						destinationWalletKey,
						ZERO,
						accountExemption,
						ataPayerKey,
						destinationWalletKey,
						this.ctx.accountResolverOpts.createWrappedSolAccountMethod,
					);
				affliatedTokenAtaMap[NATIVE_MINT.toBase58()] = wSOLAta;
				txBuilder.addInstruction(resolveWSolIx);
			}

			ataMap = { ...affliatedTokenAtaMap };
		}

		const tokenOwnerAccountA = ataMap[yevefi.tokenMintA.toBase58()];
		invariant(
			!!tokenOwnerAccountA,
			`No owner token account provided for wallet ${destinationWalletKey.toBase58()} for token A ${yevefi.tokenMintA.toBase58()} `,
		);
		const tokenOwnerAccountB = ataMap[yevefi.tokenMintB.toBase58()];
		invariant(
			!!tokenOwnerAccountB,
			`No owner token account provided for wallet ${destinationWalletKey.toBase58()} for token B ${yevefi.tokenMintB.toBase58()} `,
		);

		const positionTokenAccount = getAssociatedTokenAddressSync(
			this.data.positionMint,
			positionWalletKey,
			this.ctx.accountResolverOpts.allowPDAOwnerAddress,
		);

		if (updateFeesAndRewards && !this.data.liquidity.isZero()) {
			const updateIx = await this.updateFeesAndRewards();
			txBuilder.addInstruction(updateIx);
		}

		const ix = collectFeesIx(this.ctx.program, {
			yevefi: this.data.yevefi,
			position: this.address,
			positionTokenAccount,
			tokenOwnerAccountA: AddressUtil.toPubKey(tokenOwnerAccountA),
			tokenOwnerAccountB: AddressUtil.toPubKey(tokenOwnerAccountB),
			tokenVaultA: yevefi.tokenVaultA,
			tokenVaultB: yevefi.tokenVaultB,
			positionAuthority: positionWalletKey,
		});

		txBuilder.addInstruction(ix);

		return txBuilder;
	}

	async collectRewards(
		rewardsToCollect?: Address[],
		updateFeesAndRewards = true,
		ownerTokenAccountMap?: Partial<Record<string, Address>>,
		destinationWallet?: Address,
		positionWallet?: Address,
		ataPayer?: Address,
		opts: YevefiAccountFetchOptions = IGNORE_CACHE,
	): Promise<TransactionBuilder> {
		const [destinationWalletKey, positionWalletKey, ataPayerKey] =
			AddressUtil.toPubKeys([
				destinationWallet ?? this.ctx.wallet.publicKey,
				positionWallet ?? this.ctx.wallet.publicKey,
				ataPayer ?? this.ctx.wallet.publicKey,
			]);

		const yevefi = await this.ctx.fetcher.getPool(this.data.yevefi, opts);
		if (!yevefi) {
			throw new Error(
				`Unable to fetch yevefi(${this.data.yevefi}) for this position(${this.address}).`,
			);
		}

		const initializedRewards = yevefi.rewardInfos.filter((info) =>
			PoolUtil.isRewardInitialized(info),
		);

		const txBuilder = new TransactionBuilder(
			this.ctx.provider.connection,
			this.ctx.provider.wallet,
			this.ctx.txBuilderOpts,
		);

		const accountExemption = await this.ctx.fetcher.getAccountRentExempt();

		let ataMap = { ...ownerTokenAccountMap };
		if (!ownerTokenAccountMap) {
			const rewardMints = getTokenMintsFromYevefis(
				[yevefi],
				TokenMintTypes.REWARD_ONLY,
			);
			const { ataTokenAddresses: affliatedTokenAtaMap, resolveAtaIxs } =
				await resolveAtaForMints(this.ctx, {
					mints: rewardMints.mintMap,
					accountExemption,
					receiver: destinationWalletKey,
					payer: ataPayerKey,
				});

			if (rewardMints.hasNativeMint) {
				const { address: wSOLAta, ...resolveWSolIx } =
					TokenUtil.createWrappedNativeAccountInstruction(
						destinationWalletKey,
						ZERO,
						accountExemption,
						ataPayerKey,
						destinationWalletKey,
						this.ctx.accountResolverOpts.createWrappedSolAccountMethod,
					);
				affliatedTokenAtaMap[NATIVE_MINT.toBase58()] = wSOLAta;
				txBuilder.addInstruction(resolveWSolIx);
			}

			txBuilder.addInstructions(resolveAtaIxs);

			ataMap = { ...affliatedTokenAtaMap };
		}

		const positionTokenAccount = getAssociatedTokenAddressSync(
			this.data.positionMint,
			positionWalletKey,
			this.ctx.accountResolverOpts.allowPDAOwnerAddress,
		);
		if (updateFeesAndRewards && !this.data.liquidity.isZero()) {
			const updateIx = await this.updateFeesAndRewards();
			txBuilder.addInstruction(updateIx);
		}

		initializedRewards.forEach((info, index) => {
			if (
				rewardsToCollect &&
				!rewardsToCollect.some((r) => r.toString() === info.mint.toBase58())
			) {
				// If rewardsToCollect is specified and this reward is not in it,
				// don't include collectIX for that in TX
				return;
			}

			const rewardOwnerAccount = ataMap[info.mint.toBase58()];
			invariant(
				!!rewardOwnerAccount,
				`No owner token account provided for wallet ${destinationWalletKey.toBase58()} for reward ${index} token ${info.mint.toBase58()} `,
			);

			const ix = collectRewardIx(this.ctx.program, {
				yevefi: this.data.yevefi,
				position: this.address,
				positionTokenAccount,
				rewardIndex: index,
				rewardOwnerAccount: AddressUtil.toPubKey(rewardOwnerAccount),
				rewardVault: info.vault,
				positionAuthority: positionWalletKey,
			});

			txBuilder.addInstruction(ix);
		});

		return txBuilder;
	}

	private async refresh() {
		const positionAccount = await this.ctx.fetcher.getPosition(
			this.address,
			IGNORE_CACHE,
		);
		if (positionAccount) {
			this.data = positionAccount;
		}
		const yevefiAccount = await this.ctx.fetcher.getPool(
			this.data.yevefi,
			IGNORE_CACHE,
		);
		if (yevefiAccount) {
			this.yevefiData = yevefiAccount;
		}

		const [lowerTickArray, upperTickArray] = await getTickArrayDataForPosition(
			this.ctx,
			this.data,
			this.yevefiData,
			IGNORE_CACHE,
		);
		if (lowerTickArray) {
			this.lowerTickArrayData = lowerTickArray;
		}
		if (upperTickArray) {
			this.upperTickArrayData = upperTickArray;
		}
	}

	private async updateFeesAndRewards(): Promise<Instruction> {
		const yevefi = await this.ctx.fetcher.getPool(this.data.yevefi);
		if (!yevefi) {
			throw new Error(
				`Unable to fetch yevefi(${this.data.yevefi}) for this position(${this.address}).`,
			);
		}

		const [tickArrayLowerPda, tickArrayUpperPda] = [
			this.data.tickLowerIndex,
			this.data.tickUpperIndex,
		].map((tickIndex) =>
			PDAUtil.getTickArrayFromTickIndex(
				tickIndex,
				yevefi.tickSpacing,
				this.data.yevefi,
				this.ctx.program.programId,
			),
		);

		const updateIx = updateFeesAndRewardsIx(this.ctx.program, {
			yevefi: this.data.yevefi,
			position: this.address,
			tickArrayLower: tickArrayLowerPda.publicKey,
			tickArrayUpper: tickArrayUpperPda.publicKey,
		});

		return updateIx;
	}
}
