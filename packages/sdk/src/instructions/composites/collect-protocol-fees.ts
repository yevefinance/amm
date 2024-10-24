import type { Address } from "@coral-xyz/anchor";
import {
	AddressUtil,
	type Instruction,
	TokenUtil,
	TransactionBuilder,
} from "@orca-so/common-sdk";
import { NATIVE_MINT } from "@solana/spl-token";
import { PACKET_DATA_SIZE } from "@solana/web3.js";
import type { YevefiContext } from "../..";
import { PREFER_CACHE } from "../../network/public/fetcher";
import {
	TokenMintTypes,
	addNativeMintHandlingIx,
	getTokenMintsFromYevefis,
	resolveAtaForMints,
} from "../../utils/yevefi-ata-utils";
import { collectProtocolFeesIx } from "../collect-protocol-fees-ix";

export async function collectProtocolFees(
	ctx: YevefiContext,
	poolAddresses: Address[],
): Promise<TransactionBuilder> {
	const receiverKey = ctx.wallet.publicKey;
	const payerKey = ctx.wallet.publicKey;

	const yevefiDatas = Array.from(
		(await ctx.fetcher.getPools(poolAddresses, PREFER_CACHE)).values(),
	);

	const accountExemption = await ctx.fetcher.getAccountRentExempt();
	const { ataTokenAddresses, resolveAtaIxs } = await resolveAtaForMints(ctx, {
		mints: getTokenMintsFromYevefis(yevefiDatas, TokenMintTypes.POOL_ONLY)
			.mintMap,
		accountExemption,
		receiver: receiverKey,
		payer: payerKey,
	});

	const latestBlockhash = await ctx.connection.getLatestBlockhash();
	const txBuilder = new TransactionBuilder(
		ctx.connection,
		ctx.wallet,
		ctx.txBuilderOpts,
	).addInstructions(resolveAtaIxs);

	const instructions: Instruction[] = [];

	for (const poolAddress of poolAddresses) {
		const pool = await ctx.fetcher.getPool(poolAddress);
		if (!pool) {
			throw new Error(`Pool not found: ${poolAddress}`);
		}

		const poolConfig = await ctx.fetcher.getConfig(pool.yevefisConfig);
		if (!poolConfig) {
			throw new Error(`Config not found: ${pool.yevefisConfig}`);
		}

		if (
			poolConfig.collectProtocolFeesAuthority.toBase58() !==
			ctx.wallet.publicKey.toBase58()
		) {
			throw new Error("Wallet is not the collectProtocolFeesAuthority");
		}

		const poolHandlesNativeMint =
			TokenUtil.isNativeMint(pool.tokenMintA) ||
			TokenUtil.isNativeMint(pool.tokenMintB);
		const txBuilderHasNativeMint = !!ataTokenAddresses[NATIVE_MINT.toBase58()];

		if (poolHandlesNativeMint && !txBuilderHasNativeMint) {
			addNativeMintHandlingIx(
				txBuilder,
				ataTokenAddresses,
				receiverKey,
				accountExemption,
				ctx.accountResolverOpts.createWrappedSolAccountMethod,
			);
		}

		// add collect ixn
		instructions.push(
			collectProtocolFeesIx(ctx.program, {
				yevefisConfig: pool.yevefisConfig,
				yevefi: AddressUtil.toPubKey(poolAddress),
				tokenVaultA: pool.tokenVaultA,
				tokenVaultB: pool.tokenVaultB,
				tokenOwnerAccountA: ataTokenAddresses[pool.tokenMintA.toBase58()],
				tokenOwnerAccountB: ataTokenAddresses[pool.tokenMintB.toBase58()],
				collectProtocolFeesAuthority: poolConfig.collectProtocolFeesAuthority,
			}),
		);
	}

	txBuilder.addInstructions(instructions);
	const txSize = await txBuilder.txnSize({ latestBlockhash });
	if (txSize > PACKET_DATA_SIZE) {
		throw new Error(`Transaction size is too large: ${txSize}`);
	}

	return txBuilder;
}
