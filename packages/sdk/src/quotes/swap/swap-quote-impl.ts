import { BN } from "@coral-xyz/anchor";
import { ZERO } from "@orca-so/common-sdk";
import { SwapErrorCode, YevefisError } from "../../errors/errors";
import {
	MAX_SQRT_PRICE,
	MAX_SWAP_TICK_ARRAYS,
	MIN_SQRT_PRICE,
} from "../../types/public";
import type { SwapQuote, SwapQuoteParam } from "../public";
import { computeSwap } from "./swap-manager";
import { TickArraySequence } from "./tick-array-sequence";

/**
 * Figure out the quote parameters needed to successfully complete this trade on chain
 * @param param
 * @returns
 * @exceptions
 */
export function simulateSwap(params: SwapQuoteParam): SwapQuote {
	const {
		aToB,
		yevefiData,
		tickArrays,
		tokenAmount,
		sqrtPriceLimit,
		otherAmountThreshold,
		amountSpecifiedIsInput,
	} = params;

	if (
		sqrtPriceLimit.gt(new BN(MAX_SQRT_PRICE)) ||
		sqrtPriceLimit.lt(new BN(MIN_SQRT_PRICE))
	) {
		throw new YevefisError(
			"Provided SqrtPriceLimit is out of bounds.",
			SwapErrorCode.SqrtPriceOutOfBounds,
		);
	}

	if (
		(aToB && sqrtPriceLimit.gt(yevefiData.sqrtPrice)) ||
		(!aToB && sqrtPriceLimit.lt(yevefiData.sqrtPrice))
	) {
		throw new YevefisError(
			"Provided SqrtPriceLimit is in the opposite direction of the trade.",
			SwapErrorCode.InvalidSqrtPriceLimitDirection,
		);
	}

	if (tokenAmount.eq(ZERO)) {
		throw new YevefisError(
			"Provided tokenAmount is zero.",
			SwapErrorCode.ZeroTradableAmount,
		);
	}

	const tickSequence = new TickArraySequence(
		tickArrays,
		yevefiData.tickSpacing,
		aToB,
	);

	// Ensure 1st search-index resides on the 1st array in the sequence to match smart contract expectation.
	if (!tickSequence.isValidTickArray0(yevefiData.tickCurrentIndex)) {
		throw new YevefisError(
			"TickArray at index 0 does not contain the Yevefi current tick index.",
			SwapErrorCode.TickArraySequenceInvalid,
		);
	}

	const swapResults = computeSwap(
		yevefiData,
		tickSequence,
		tokenAmount,
		sqrtPriceLimit,
		amountSpecifiedIsInput,
		aToB,
	);

	if (amountSpecifiedIsInput) {
		if (
			(aToB && otherAmountThreshold.gt(swapResults.amountB)) ||
			(!aToB && otherAmountThreshold.gt(swapResults.amountA))
		) {
			throw new YevefisError(
				"Quoted amount for the other token is below the otherAmountThreshold.",
				SwapErrorCode.AmountOutBelowMinimum,
			);
		}
	} else {
		if (
			(aToB && otherAmountThreshold.lt(swapResults.amountA)) ||
			(!aToB && otherAmountThreshold.lt(swapResults.amountB))
		) {
			throw new YevefisError(
				"Quoted amount for the other token is above the otherAmountThreshold.",
				SwapErrorCode.AmountInAboveMaximum,
			);
		}
	}

	const { estimatedAmountIn, estimatedAmountOut } = remapAndAdjustTokens(
		swapResults.amountA,
		swapResults.amountB,
		aToB,
	);

	const numOfTickCrossings = tickSequence.getNumOfTouchedArrays();
	if (numOfTickCrossings > MAX_SWAP_TICK_ARRAYS) {
		throw new YevefisError(
			`Input amount causes the quote to traverse more than the allowable amount of tick-arrays ${numOfTickCrossings}`,
			SwapErrorCode.TickArrayCrossingAboveMax,
		);
	}

	const touchedArrays = tickSequence.getTouchedArrays(MAX_SWAP_TICK_ARRAYS);

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

function remapAndAdjustTokens(amountA: BN, amountB: BN, aToB: boolean) {
	const estimatedAmountIn = aToB ? amountA : amountB;
	const estimatedAmountOut = aToB ? amountB : amountA;
	return {
		estimatedAmountIn,
		estimatedAmountOut,
	};
}
