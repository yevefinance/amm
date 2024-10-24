import type { Address } from "@coral-xyz/anchor";
import {
	type Instruction,
	type ResolvedTokenAddressInstruction,
	TokenUtil,
	TransactionBuilder,
	ZERO,
	resolveOrCreateATAs,
} from "@orca-so/common-sdk";
import { NATIVE_MINT, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import type { PositionData, YevefiContext } from "../..";
import { YevefiIx } from "../../ix";
import {
	PREFER_CACHE,
	type YevefiAccountFetchOptions,
} from "../../network/public/fetcher";
import type { YevefiData } from "../../types/public";
import { PDAUtil, PoolUtil, TickUtil } from "../../utils/public";
import {
	checkMergedTransactionSizeIsValid,
	convertListToMap,
} from "../../utils/txn-utils";
import { getTokenMintsFromYevefis } from "../../utils/yevefi-ata-utils";
import { updateFeesAndRewardsIx } from "../update-fees-and-rewards-ix";

/**
 * Parameters to collect all fees and rewards from a list of positions.
 *
 * @category Instruction Types
 * @param positionAddrs - An array of Yevefi position addresses.
 * @param receiver - The destination wallet that collected fees & reward will be sent to. Defaults to ctx.wallet key.
 * @param positionOwner - The wallet key that contains the position token. Defaults to ctx.wallet key.
 * @param positionAuthority - The authority key that can authorize operation on the position. Defaults to ctx.wallet key.
 * @param payer - The key that will pay for the initialization of ATA token accounts. Defaults to ctx.wallet key.
 */
export type CollectAllPositionAddressParams = {
	positions: Address[];
} & CollectAllParams;

/**
 * Parameters to collect all fees and rewards from a list of positions.
 *
 * @category Instruction Types
 * @param positions - An array of Yevefi positions.
 * @param receiver - The destination wallet that collected fees & reward will be sent to. Defaults to ctx.wallet key.
 * @param positionOwner - The wallet key that contains the position token. Defaults to ctx.wallet key.
 * @param positionAuthority - The authority key that can authorize operation on the position. Defaults to ctx.wallet key.
 * @param payer - The key that will pay for the initialization of ATA token accounts. Defaults to ctx.wallet key.
 */
export type CollectAllPositionParams = {
	positions: Record<string, PositionData>;
} & CollectAllParams;

/**
 * Common parameters between {@link CollectAllPositionParams} & {@link CollectAllPositionAddressParams}
 *
 * @category Instruction Types
 * @param receiver - The destination wallet that collected fees & reward will be sent to. Defaults to ctx.wallet key.
 * @param positionOwner - The wallet key that contains the position token. Defaults to ctx.wallet key.
 * @param positionAuthority - The authority key that can authorize operation on the position. Defaults to ctx.wallet key.
 * @param payer - The key that will pay for the initialization of ATA token accounts. Defaults to ctx.wallet key.
 */
export type CollectAllParams = {
	receiver?: PublicKey;
	positionOwner?: PublicKey;
	positionAuthority?: PublicKey;
	payer?: PublicKey;
};

/**
 * Build a set of transactions to collect fees and rewards for a set of Yevefi Positions.
 *
 * @category Instructions
 * @experimental
 * @param ctx - YevefiContext object for the current environment.
 * @param params - CollectAllPositionAddressParams object
 * @param opts an {@link YevefiAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
 * @returns A set of transaction-builders to resolve ATA for affliated tokens, collect fee & rewards for all positions.
 */
export async function collectAllForPositionAddressesTxns(
	ctx: YevefiContext,
	params: CollectAllPositionAddressParams,
	opts: YevefiAccountFetchOptions = PREFER_CACHE,
): Promise<TransactionBuilder[]> {
	const { positions, ...rest } = params;
	const fetchedPositions = await ctx.fetcher.getPositions(positions, opts);

	const positionMap: Record<string, PositionData> = {};
	fetchedPositions.forEach((pos, addr) => {
		if (pos) {
			positionMap[addr] = pos;
		}
	});

	return collectAllForPositionsTxns(ctx, { positions: positionMap, ...rest });
}

/**
 * Build a set of transactions to collect fees and rewards for a set of Yevefi Positions.
 *
 * @experimental
 * @param ctx - YevefiContext object for the current environment.
 * @param params - CollectAllPositionParams object
 * @returns A set of transaction-builders to resolve ATA for affliated tokens, collect fee & rewards for all positions.
 */
export async function collectAllForPositionsTxns(
	ctx: YevefiContext,
	params: CollectAllPositionParams,
): Promise<TransactionBuilder[]> {
	const { positions, receiver, positionAuthority, positionOwner, payer } =
		params;
	const receiverKey = receiver ?? ctx.wallet.publicKey;
	const positionAuthorityKey = positionAuthority ?? ctx.wallet.publicKey;
	const positionOwnerKey = positionOwner ?? ctx.wallet.publicKey;
	const payerKey = payer ?? ctx.wallet.publicKey;
	const positionList = Object.entries(positions);

	if (positionList.length === 0) {
		return [];
	}

	const yevefiAddrs = positionList.map(([, pos]) => pos.yevefi.toBase58());
	const yevefis = await ctx.fetcher.getPools(yevefiAddrs, PREFER_CACHE);

	const allMints = getTokenMintsFromYevefis(Array.from(yevefis.values()));
	const accountExemption = await ctx.fetcher.getAccountRentExempt();

	// resolvedAtas[mint] => Instruction & { address }
	// if already ATA exists, Instruction will be EMPTY_INSTRUCTION
	const resolvedAtas = convertListToMap(
		await resolveOrCreateATAs(
			ctx.connection,
			receiverKey,
			allMints.mintMap.map((tokenMint) => ({ tokenMint })),
			async () => accountExemption,
			payerKey,
			true, // CreateIdempotent
			ctx.accountResolverOpts.allowPDAOwnerAddress,
			ctx.accountResolverOpts.createWrappedSolAccountMethod,
		),
		allMints.mintMap.map((mint) => mint.toBase58()),
	);

	const latestBlockhash = await ctx.connection.getLatestBlockhash();
	const txBuilders: TransactionBuilder[] = [];

	let posIndex = 0;
	let pendingTxBuilder = null;
	let touchedMints = null;
	let reattempt = false;
	while (posIndex < positionList.length) {
		if (!pendingTxBuilder || !touchedMints) {
			pendingTxBuilder = new TransactionBuilder(
				ctx.connection,
				ctx.wallet,
				ctx.txBuilderOpts,
			);
			touchedMints = new Set<string>();
			resolvedAtas[NATIVE_MINT.toBase58()] =
				TokenUtil.createWrappedNativeAccountInstruction(
					receiverKey,
					ZERO,
					accountExemption,
					undefined, // use default
					undefined, // use default
					ctx.accountResolverOpts.createWrappedSolAccountMethod,
				);
		}

		// Build collect instructions
		const [positionAddr, position] = positionList[posIndex];
		const collectIxForPosition = constructCollectIxForPosition(
			ctx,
			new PublicKey(positionAddr),
			position,
			yevefis,
			positionOwnerKey,
			positionAuthorityKey,
			resolvedAtas,
			touchedMints,
		);
		const positionTxBuilder = new TransactionBuilder(
			ctx.connection,
			ctx.wallet,
			ctx.txBuilderOpts,
		);
		positionTxBuilder.addInstructions(collectIxForPosition);

		// Attempt to push the new instructions into the pending builder
		// Iterate to the next position if possible
		// Create a builder and reattempt if the current one is full.
		const mergeable = await checkMergedTransactionSizeIsValid(
			ctx,
			[pendingTxBuilder, positionTxBuilder],
			latestBlockhash,
		);
		if (mergeable) {
			pendingTxBuilder.addInstruction(positionTxBuilder.compressIx(false));
			posIndex += 1;
			reattempt = false;
		} else {
			if (reattempt) {
				throw new Error(
					`Unable to fit collection ix for ${position.positionMint.toBase58()} in a Transaction.`,
				);
			}

			txBuilders.push(pendingTxBuilder);
			pendingTxBuilder = null;
			touchedMints = null;
			reattempt = true;
		}
	}

	if (pendingTxBuilder) {
		txBuilders.push(pendingTxBuilder);
	}
	return txBuilders;
}

// TODO: Once individual collect ix for positions is implemented, maybe migrate over if it can take custom ATA?
const constructCollectIxForPosition = (
	ctx: YevefiContext,
	positionKey: PublicKey,
	position: PositionData,
	yevefis: ReadonlyMap<string, YevefiData | null>,
	positionOwner: PublicKey,
	positionAuthority: PublicKey,
	resolvedAtas: Record<string, ResolvedTokenAddressInstruction>,
	touchedMints: Set<string>,
) => {
	const ixForPosition: Instruction[] = [];
	const {
		yevefi: yevefiKey,
		liquidity,
		tickLowerIndex,
		tickUpperIndex,
		positionMint,
		rewardInfos: positionRewardInfos,
	} = position;

	const yevefi = yevefis.get(yevefiKey.toBase58());
	if (!yevefi) {
		throw new Error(
			`Unable to process positionMint ${positionMint} - unable to derive yevefi ${yevefiKey.toBase58()}`,
		);
	}
	const { tickSpacing } = yevefi;
	const mintA = yevefi.tokenMintA.toBase58();
	const mintB = yevefi.tokenMintB.toBase58();

	const positionTokenAccount = getAssociatedTokenAddressSync(
		positionMint,
		positionOwner,
		ctx.accountResolverOpts.allowPDAOwnerAddress,
	);

	// Update fee and reward values if necessary
	if (!liquidity.eq(ZERO)) {
		ixForPosition.push(
			updateFeesAndRewardsIx(ctx.program, {
				position: positionKey,
				yevefi: yevefiKey,
				tickArrayLower: PDAUtil.getTickArray(
					ctx.program.programId,
					yevefiKey,
					TickUtil.getStartTickIndex(tickLowerIndex, tickSpacing),
				).publicKey,
				tickArrayUpper: PDAUtil.getTickArray(
					ctx.program.programId,
					yevefiKey,
					TickUtil.getStartTickIndex(tickUpperIndex, tickSpacing),
				).publicKey,
			}),
		);
	}

	// Collect Fee
	if (!touchedMints.has(mintA)) {
		ixForPosition.push(resolvedAtas[mintA]);
		touchedMints.add(mintA);
	}
	if (!touchedMints.has(mintB)) {
		ixForPosition.push(resolvedAtas[mintB]);
		touchedMints.add(mintB);
	}
	ixForPosition.push(
		YevefiIx.collectFeesIx(ctx.program, {
			yevefi: yevefiKey,
			position: positionKey,
			positionAuthority,
			positionTokenAccount,
			tokenOwnerAccountA: resolvedAtas[mintA].address,
			tokenOwnerAccountB: resolvedAtas[mintB].address,
			tokenVaultA: yevefi.tokenVaultA,
			tokenVaultB: yevefi.tokenVaultB,
		}),
	);

	// Collect Rewards
	// TODO: handle empty vault values?
	positionRewardInfos.forEach((_, index) => {
		const rewardInfo = yevefi.rewardInfos[index];
		if (PoolUtil.isRewardInitialized(rewardInfo)) {
			const mintReward = rewardInfo.mint.toBase58();
			if (!touchedMints.has(mintReward)) {
				ixForPosition.push(resolvedAtas[mintReward]);
				touchedMints.add(mintReward);
			}
			ixForPosition.push(
				YevefiIx.collectRewardIx(ctx.program, {
					yevefi: yevefiKey,
					position: positionKey,
					positionAuthority,
					positionTokenAccount,
					rewardIndex: index,
					rewardOwnerAccount: resolvedAtas[mintReward].address,
					rewardVault: rewardInfo.vault,
				}),
			);
		}
	});

	return ixForPosition;
};
