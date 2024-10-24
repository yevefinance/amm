import {
	TransactionBuilder,
	ZERO,
	resolveOrCreateATAs,
} from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import {
	SwapUtils,
	TickArrayUtil,
	type Yevefi,
	type YevefiContext,
} from "../..";
import type { YevefiAccountFetchOptions } from "../../network/public/fetcher";
import { type SwapInput, swapIx } from "../swap-ix";

export type SwapAsyncParams = {
	swapInput: SwapInput;
	yevefi: Yevefi;
	wallet: PublicKey;
};

/**
 * Swap instruction builder method with resolveATA & additional checks.
 * @param ctx - YevefiContext object for the current environment.
 * @param params - {@link SwapAsyncParams}
 * @param opts - {@link YevefiAccountFetchOptions} to use for account fetching.
 * @returns
 */
export async function swapAsync(
	ctx: YevefiContext,
	params: SwapAsyncParams,
	opts: YevefiAccountFetchOptions,
): Promise<TransactionBuilder> {
	const { wallet, yevefi, swapInput } = params;
	const { aToB, amount } = swapInput;
	const txBuilder = new TransactionBuilder(
		ctx.connection,
		ctx.wallet,
		ctx.txBuilderOpts,
	);
	const tickArrayAddresses = [
		swapInput.tickArray0,
		swapInput.tickArray1,
		swapInput.tickArray2,
	];

	const uninitializedArrays = await TickArrayUtil.getUninitializedArraysString(
		tickArrayAddresses,
		ctx.fetcher,
		opts,
	);
	if (uninitializedArrays) {
		throw new Error(
			`TickArray addresses - [${uninitializedArrays}] need to be initialized.`,
		);
	}

	const data = yevefi.getData();
	const [resolvedAtaA, resolvedAtaB] = await resolveOrCreateATAs(
		ctx.connection,
		wallet,
		[
			{ tokenMint: data.tokenMintA, wrappedSolAmountIn: aToB ? amount : ZERO },
			{ tokenMint: data.tokenMintB, wrappedSolAmountIn: !aToB ? amount : ZERO },
		],
		() => ctx.fetcher.getAccountRentExempt(),
		undefined, // use default
		undefined, // use default
		ctx.accountResolverOpts.allowPDAOwnerAddress,
		ctx.accountResolverOpts.createWrappedSolAccountMethod,
	);
	const { address: ataAKey, ...tokenOwnerAccountAIx } = resolvedAtaA;
	const { address: ataBKey, ...tokenOwnerAccountBIx } = resolvedAtaB;
	txBuilder.addInstructions([tokenOwnerAccountAIx, tokenOwnerAccountBIx]);
	const inputTokenAccount = aToB ? ataAKey : ataBKey;
	const outputTokenAccount = aToB ? ataBKey : ataAKey;

	return txBuilder.addInstruction(
		swapIx(
			ctx.program,
			SwapUtils.getSwapParamsFromQuote(
				swapInput,
				ctx,
				yevefi,
				inputTokenAccount,
				outputTokenAccount,
				wallet,
			),
		),
	);
}
