"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateSwap = simulateSwap;
const anchor_1 = require("@coral-xyz/anchor");
const common_sdk_1 = require("@orca-so/common-sdk");
const errors_1 = require("../../errors/errors");
const public_1 = require("../../types/public");
const swap_manager_1 = require("./swap-manager");
const tick_array_sequence_1 = require("./tick-array-sequence");
/**
 * Figure out the quote parameters needed to successfully complete this trade on chain
 * @param param
 * @returns
 * @exceptions
 */
function simulateSwap(params) {
    const { aToB, yevefiData, tickArrays, tokenAmount, sqrtPriceLimit, otherAmountThreshold, amountSpecifiedIsInput, } = params;
    if (sqrtPriceLimit.gt(new anchor_1.BN(public_1.MAX_SQRT_PRICE)) ||
        sqrtPriceLimit.lt(new anchor_1.BN(public_1.MIN_SQRT_PRICE))) {
        throw new errors_1.YevefisError("Provided SqrtPriceLimit is out of bounds.", errors_1.SwapErrorCode.SqrtPriceOutOfBounds);
    }
    if ((aToB && sqrtPriceLimit.gt(yevefiData.sqrtPrice)) ||
        (!aToB && sqrtPriceLimit.lt(yevefiData.sqrtPrice))) {
        throw new errors_1.YevefisError("Provided SqrtPriceLimit is in the opposite direction of the trade.", errors_1.SwapErrorCode.InvalidSqrtPriceLimitDirection);
    }
    if (tokenAmount.eq(common_sdk_1.ZERO)) {
        throw new errors_1.YevefisError("Provided tokenAmount is zero.", errors_1.SwapErrorCode.ZeroTradableAmount);
    }
    const tickSequence = new tick_array_sequence_1.TickArraySequence(tickArrays, yevefiData.tickSpacing, aToB);
    // Ensure 1st search-index resides on the 1st array in the sequence to match smart contract expectation.
    if (!tickSequence.isValidTickArray0(yevefiData.tickCurrentIndex)) {
        throw new errors_1.YevefisError("TickArray at index 0 does not contain the Yevefi current tick index.", errors_1.SwapErrorCode.TickArraySequenceInvalid);
    }
    const swapResults = (0, swap_manager_1.computeSwap)(yevefiData, tickSequence, tokenAmount, sqrtPriceLimit, amountSpecifiedIsInput, aToB);
    if (amountSpecifiedIsInput) {
        if ((aToB && otherAmountThreshold.gt(swapResults.amountB)) ||
            (!aToB && otherAmountThreshold.gt(swapResults.amountA))) {
            throw new errors_1.YevefisError("Quoted amount for the other token is below the otherAmountThreshold.", errors_1.SwapErrorCode.AmountOutBelowMinimum);
        }
    }
    else {
        if ((aToB && otherAmountThreshold.lt(swapResults.amountA)) ||
            (!aToB && otherAmountThreshold.lt(swapResults.amountB))) {
            throw new errors_1.YevefisError("Quoted amount for the other token is above the otherAmountThreshold.", errors_1.SwapErrorCode.AmountInAboveMaximum);
        }
    }
    const { estimatedAmountIn, estimatedAmountOut } = remapAndAdjustTokens(swapResults.amountA, swapResults.amountB, aToB);
    const numOfTickCrossings = tickSequence.getNumOfTouchedArrays();
    if (numOfTickCrossings > public_1.MAX_SWAP_TICK_ARRAYS) {
        throw new errors_1.YevefisError(`Input amount causes the quote to traverse more than the allowable amount of tick-arrays ${numOfTickCrossings}`, errors_1.SwapErrorCode.TickArrayCrossingAboveMax);
    }
    const touchedArrays = tickSequence.getTouchedArrays(public_1.MAX_SWAP_TICK_ARRAYS);
    return {
        estimatedAmountIn,
        estimatedAmountOut,
        estimatedEndTickIndex: swapResults.nextTickIndex,
        estimatedEndSqrtPrice: swapResults.nextSqrtPrice,
        estimatedFeeAmount: swapResults.totalFeeAmount,
        amount: tokenAmount,
        amountSpecifiedIsInput,
        aToB,
        otherAmountThreshold,
        sqrtPriceLimit,
        tickArray0: touchedArrays[0],
        tickArray1: touchedArrays[1],
        tickArray2: touchedArrays[2],
    };
}
function remapAndAdjustTokens(amountA, amountB, aToB) {
    const estimatedAmountIn = aToB ? amountA : amountB;
    const estimatedAmountOut = aToB ? amountB : amountA;
    return {
        estimatedAmountIn,
        estimatedAmountOut,
    };
}
