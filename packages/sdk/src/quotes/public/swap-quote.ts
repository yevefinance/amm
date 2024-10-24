import type { Address } from "@coral-xyz/anchor";
import { AddressUtil, type Percentage } from "@orca-so/common-sdk";
import type BN from "bn.js";
import invariant from "tiny-invariant";
import type { SwapInput } from "../../instructions";
import type {
	YevefiAccountFetchOptions,
	YevefiAccountFetcherInterface,
} from "../../network/public/fetcher";
import type { TickArray, YevefiData } from "../../types/public";
import { PoolUtil, SwapDirection } from "../../utils/public";
import { SwapUtils } from "../../utils/public/swap-utils";
import type { Yevefi } from "../../yevefi-client";
import { simulateSwap } from "../swap/swap-quote-impl";
import type { DevFeeSwapQuote } from "./dev-fee-swap-quote";

/**
 * @category Quotes
 *
 * @param tokenAmount - The amount of input or output token to swap from (depending on amountSpecifiedIsInput).
 * @param otherAmountThreshold - The maximum/minimum of input/output token to swap into (depending on amountSpecifiedIsInput).
 * @param sqrtPriceLimit - The maximum/minimum price the swap will swap to.
 * @param aToB - The direction of the swap. True if swapping from A to B. False if swapping from B to A.
 * @param amountSpecifiedIsInput - Specifies the token the parameter `amount`represents. If true, the amount represents
 *                                 the input token of the swap.
 * @param tickArrays - An sequential array of tick-array objects in the direction of the trade to swap on
 */
export type SwapQuoteParam = {
	yevefiData: YevefiData;
	tokenAmount: BN;
	otherAmountThreshold: BN;
	sqrtPriceLimit: BN;
	aToB: boolean;
	amountSpecifiedIsInput: boolean;
	tickArrays: TickArray[];
};

/**
 * A collection of estimated values from quoting a swap.
 * @category Quotes
 * @link {BaseSwapQuote}
 * @link {DevFeeSwapQuote}
 */
export type SwapQuote = NormalSwapQuote | DevFeeSwapQuote;

/**
 * A collection of estimated values from quoting a swap.
 * @category Quotes
 * @param estimatedAmountIn - Approximate number of input token swapped in the swap
 * @param estimatedAmountOut - Approximate number of output token swapped in the swap
 * @param estimatedEndTickIndex - Approximate tick-index the Yevefi will land on after this swap
 * @param estimatedEndSqrtPrice - Approximate sqrtPrice the Yevefi will land on after this swap
 * @param estimatedFeeAmount - Approximate feeAmount (all fees) charged on this swap
 */
export type SwapEstimates = {
	estimatedAmountIn: BN;
	estimatedAmountOut: BN;
	estimatedEndTickIndex: number;
	estimatedEndSqrtPrice: BN;
	estimatedFeeAmount: BN;
};

/**
 * A collection of estimated values from quoting a swap. Object can be directly used in a swap transaction.
 * @category Quotes
 */
export type NormalSwapQuote = SwapInput & SwapEstimates;

/**
 * Get an estimated swap quote using input token amount.
 *
 * @category Quotes
 * @param yevefi - Yevefi to perform the swap on
 * @param inputTokenMint - PublicKey for the input token mint to swap with
 * @param tokenAmount - The amount of input token to swap from
 * @param slippageTolerance - The amount of slippage to account for in this quote
 * @param programId - PublicKey for the Yevefi ProgramId
 * @param cache - YevefiAccountCacheInterface instance object to fetch solana accounts
 * @param opts an {@link YevefiAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
 * @returns a SwapQuote object with slippage adjusted SwapInput parameters & estimates on token amounts, fee & end yevefi states.
 */
export async function swapQuoteByInputToken(
	yevefi: Yevefi,
	inputTokenMint: Address,
	tokenAmount: BN,
	slippageTolerance: Percentage,
	programId: Address,
	fetcher: YevefiAccountFetcherInterface,
	opts?: YevefiAccountFetchOptions,
): Promise<SwapQuote> {
	const params = await swapQuoteByToken(
		yevefi,
		inputTokenMint,
		tokenAmount,
		true,
		programId,
		fetcher,
		opts,
	);
	return swapQuoteWithParams(params, slippageTolerance);
}

/**
 * Get an estimated swap quote using an output token amount.
 *
 * Use this quote to get an estimated amount of input token needed to receive
 * the defined output token amount.
 *
 * @category Quotes
 * @param yevefi - Yevefi to perform the swap on
 * @param outputTokenMint - PublicKey for the output token mint to swap into
 * @param tokenAmount - The maximum amount of output token to receive in this swap.
 * @param slippageTolerance - The amount of slippage to account for in this quote
 * @param programId - PublicKey for the Yevefi ProgramId
 * @param cache - YevefiAccountCacheInterface instance to fetch solana accounts
 * @param opts an {@link YevefiAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
 * @returns a SwapQuote object with slippage adjusted SwapInput parameters & estimates on token amounts, fee & end yevefi states.
 */
export async function swapQuoteByOutputToken(
	yevefi: Yevefi,
	outputTokenMint: Address,
	tokenAmount: BN,
	slippageTolerance: Percentage,
	programId: Address,
	fetcher: YevefiAccountFetcherInterface,
	opts?: YevefiAccountFetchOptions,
): Promise<SwapQuote> {
	const params = await swapQuoteByToken(
		yevefi,
		outputTokenMint,
		tokenAmount,
		false,
		programId,
		fetcher,
		opts,
	);
	return swapQuoteWithParams(params, slippageTolerance);
}

/**
 * Perform a sync swap quote based on the basic swap instruction parameters.
 *
 * @category Quotes
 * @param params - SwapQuote parameters
 * @param slippageTolerance - The amount of slippage to account for when generating the final quote.
 * @returns a SwapQuote object with slippage adjusted SwapInput parameters & estimates on token amounts, fee & end yevefi states.
 */
export function swapQuoteWithParams(
	params: SwapQuoteParam,
	slippageTolerance: Percentage,
): SwapQuote {
	const quote = simulateSwap(params);

	const slippageAdjustedQuote: SwapQuote = {
		...quote,
		...SwapUtils.calculateSwapAmountsFromQuote(
			quote.amount,
			quote.estimatedAmountIn,
			quote.estimatedAmountOut,
			slippageTolerance,
			quote.amountSpecifiedIsInput,
		),
	};

	return slippageAdjustedQuote;
}

async function swapQuoteByToken(
	yevefi: Yevefi,
	inputTokenMint: Address,
	tokenAmount: BN,
	amountSpecifiedIsInput: boolean,
	programId: Address,
	fetcher: YevefiAccountFetcherInterface,
	opts?: YevefiAccountFetchOptions,
): Promise<SwapQuoteParam> {
	const yevefiData = yevefi.getData();
	const swapMintKey = AddressUtil.toPubKey(inputTokenMint);
	const swapTokenType = PoolUtil.getTokenType(yevefiData, swapMintKey);
	invariant(
		!!swapTokenType,
		"swapTokenMint does not match any tokens on this pool",
	);

	const aToB =
		SwapUtils.getSwapDirection(
			yevefiData,
			swapMintKey,
			amountSpecifiedIsInput,
		) === SwapDirection.AtoB;

	const tickArrays = await SwapUtils.getTickArrays(
		yevefiData.tickCurrentIndex,
		yevefiData.tickSpacing,
		aToB,
		AddressUtil.toPubKey(programId),
		yevefi.getAddress(),
		fetcher,
		opts,
	);

	return {
		yevefiData,
		tokenAmount,
		aToB,
		amountSpecifiedIsInput,
		sqrtPriceLimit: SwapUtils.getDefaultSqrtPriceLimit(aToB),
		otherAmountThreshold: SwapUtils.getDefaultOtherAmountThreshold(
			amountSpecifiedIsInput,
		),
		tickArrays,
	};
}