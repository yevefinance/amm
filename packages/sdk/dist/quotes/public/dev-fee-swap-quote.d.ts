import type { Address } from "@coral-xyz/anchor";
import type { Percentage } from "@orca-so/common-sdk";
import type BN from "bn.js";
import type { YevefiAccountFetchOptions, YevefiAccountFetcherInterface } from "../../network/public/fetcher";
import type { Yevefi } from "../../yevefi-client";
import { type NormalSwapQuote } from "./swap-quote";
/**
 * A collection of estimated values from quoting a swap that collects a developer-fee.
 * @category Quotes
 * @param estimatedAmountIn - Approximate number of input token swapped in the swap
 * @param estimatedAmountOut - Approximate number of output token swapped in the swap
 * @param estimatedEndTickIndex - Approximate tick-index the Yevefi will land on after this swap
 * @param estimatedEndSqrtPrice - Approximate sqrtPrice the Yevefi will land on after this swap
 * @param estimatedFeeAmount - Approximate feeAmount (all fees) charged on this swap
 * @param estimatedSwapFeeAmount - Approximate feeAmount (LP + protocol fees) charged on this swap
 * @param devFeeAmount -  FeeAmount (developer fees) charged on this swap
 */
export type DevFeeSwapQuote = NormalSwapQuote & {
    amountSpecifiedIsInput: true;
    estimatedSwapFeeAmount: BN;
    devFeeAmount: BN;
};
/**
 * Get an estimated swap quote using input token amount while collecting dev fees.
 *
 * @category Quotes
 * @param yevefi - Yevefi to perform the swap on
 * @param inputTokenMint - PublicKey for the input token mint to swap with
 * @param tokenAmount - The amount of input token to swap from
 * @param slippageTolerance - The amount of slippage to account for in this quote
 * @param programId - PublicKey for the Yevefi ProgramId
 * @param cache - YevefiAccountCacheInterface instance to fetch solana accounts
 * @param opts an {@link YevefiAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
 * @param devFeePercentage - The percentage amount to send to developer wallet prior to the swap. Percentage num/dem values has to match token decimal.
 * @returns a SwapQuote object with slippage adjusted SwapInput parameters & estimates on token amounts, fee & end yevefi states.
 */
export declare function swapQuoteByInputTokenWithDevFees(yevefi: Yevefi, inputTokenMint: Address, tokenAmount: BN, slippageTolerance: Percentage, programId: Address, fetcher: YevefiAccountFetcherInterface, devFeePercentage: Percentage, opts?: YevefiAccountFetchOptions): Promise<DevFeeSwapQuote>;
