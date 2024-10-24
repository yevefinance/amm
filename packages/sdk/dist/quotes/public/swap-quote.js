"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swapQuoteByInputToken = swapQuoteByInputToken;
exports.swapQuoteByOutputToken = swapQuoteByOutputToken;
exports.swapQuoteWithParams = swapQuoteWithParams;
const common_sdk_1 = require("@orca-so/common-sdk");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const public_1 = require("../../utils/public");
const swap_utils_1 = require("../../utils/public/swap-utils");
const swap_quote_impl_1 = require("../swap/swap-quote-impl");
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
async function swapQuoteByInputToken(yevefi, inputTokenMint, tokenAmount, slippageTolerance, programId, fetcher, opts) {
    const params = await swapQuoteByToken(yevefi, inputTokenMint, tokenAmount, true, programId, fetcher, opts);
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
async function swapQuoteByOutputToken(yevefi, outputTokenMint, tokenAmount, slippageTolerance, programId, fetcher, opts) {
    const params = await swapQuoteByToken(yevefi, outputTokenMint, tokenAmount, false, programId, fetcher, opts);
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
function swapQuoteWithParams(params, slippageTolerance) {
    const quote = (0, swap_quote_impl_1.simulateSwap)(params);
    const slippageAdjustedQuote = {
        ...quote,
        ...swap_utils_1.SwapUtils.calculateSwapAmountsFromQuote(quote.amount, quote.estimatedAmountIn, quote.estimatedAmountOut, slippageTolerance, quote.amountSpecifiedIsInput),
    };
    return slippageAdjustedQuote;
}
async function swapQuoteByToken(yevefi, inputTokenMint, tokenAmount, amountSpecifiedIsInput, programId, fetcher, opts) {
    const yevefiData = yevefi.getData();
    const swapMintKey = common_sdk_1.AddressUtil.toPubKey(inputTokenMint);
    const swapTokenType = public_1.PoolUtil.getTokenType(yevefiData, swapMintKey);
    (0, tiny_invariant_1.default)(!!swapTokenType, "swapTokenMint does not match any tokens on this pool");
    const aToB = swap_utils_1.SwapUtils.getSwapDirection(yevefiData, swapMintKey, amountSpecifiedIsInput) === public_1.SwapDirection.AtoB;
    const tickArrays = await swap_utils_1.SwapUtils.getTickArrays(yevefiData.tickCurrentIndex, yevefiData.tickSpacing, aToB, common_sdk_1.AddressUtil.toPubKey(programId), yevefi.getAddress(), fetcher, opts);
    return {
        yevefiData,
        tokenAmount,
        aToB,
        amountSpecifiedIsInput,
        sqrtPriceLimit: swap_utils_1.SwapUtils.getDefaultSqrtPriceLimit(aToB),
        otherAmountThreshold: swap_utils_1.SwapUtils.getDefaultOtherAmountThreshold(amountSpecifiedIsInput),
        tickArrays,
    };
}
