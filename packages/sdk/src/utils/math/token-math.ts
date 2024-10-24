import { type Percentage, U64_MAX, ZERO } from "@orca-so/common-sdk";
import BN from "bn.js";
import {
	MathErrorCode,
	TokenErrorCode,
	YevefisError,
} from "../../errors/errors";
import { MAX_SQRT_PRICE, MIN_SQRT_PRICE } from "../../types/public";
import { BitMath } from "./bit-math";

export function getAmountDeltaA(
	currSqrtPrice: BN,
	targetSqrtPrice: BN,
	currLiquidity: BN,
	roundUp: boolean,
): BN {
	const [sqrtPriceLower, sqrtPriceUpper] = toIncreasingPriceOrder(
		currSqrtPrice,
		targetSqrtPrice,
	);
	const sqrtPriceDiff = sqrtPriceUpper.sub(sqrtPriceLower);

	const numerator = currLiquidity.mul(sqrtPriceDiff).shln(64);
	const denominator = sqrtPriceLower.mul(sqrtPriceUpper);

	const quotient = numerator.div(denominator);
	const remainder = numerator.mod(denominator);

	const result =
		roundUp && !remainder.eq(ZERO) ? quotient.add(new BN(1)) : quotient;

	if (result.gt(U64_MAX)) {
		throw new YevefisError(
			"Results larger than U64",
			TokenErrorCode.TokenMaxExceeded,
		);
	}

	return result;
}

export function getAmountDeltaB(
	currSqrtPrice: BN,
	targetSqrtPrice: BN,
	currLiquidity: BN,
	roundUp: boolean,
): BN {
	const [sqrtPriceLower, sqrtPriceUpper] = toIncreasingPriceOrder(
		currSqrtPrice,
		targetSqrtPrice,
	);
	const sqrtPriceDiff = sqrtPriceUpper.sub(sqrtPriceLower);
	return BitMath.checked_mul_shift_right_round_up_if(
		currLiquidity,
		sqrtPriceDiff,
		roundUp,
		128,
	);
}

export function getNextSqrtPrice(
	sqrtPrice: BN,
	currLiquidity: BN,
	amount: BN,
	amountSpecifiedIsInput: boolean,
	aToB: boolean,
) {
	if (amountSpecifiedIsInput === aToB) {
		return getNextSqrtPriceFromARoundUp(
			sqrtPrice,
			currLiquidity,
			amount,
			amountSpecifiedIsInput,
		);
	}
	return getNextSqrtPriceFromBRoundDown(
		sqrtPrice,
		currLiquidity,
		amount,
		amountSpecifiedIsInput,
	);
}

export function adjustForSlippage(
	n: BN,
	{ numerator, denominator }: Percentage,
	adjustUp: boolean,
): BN {
	if (adjustUp) {
		return n.mul(denominator.add(numerator)).div(denominator);
	}
	return n.mul(denominator).div(denominator.add(numerator));
}

function toIncreasingPriceOrder(sqrtPrice0: BN, sqrtPrice1: BN) {
	if (sqrtPrice0.gt(sqrtPrice1)) {
		return [sqrtPrice1, sqrtPrice0];
	}
	return [sqrtPrice0, sqrtPrice1];
}

function getNextSqrtPriceFromARoundUp(
	sqrtPrice: BN,
	currLiquidity: BN,
	amount: BN,
	amountSpecifiedIsInput: boolean,
) {
	if (amount.eq(ZERO)) {
		return sqrtPrice;
	}

	const p = BitMath.mul(sqrtPrice, amount, 256);
	const numerator = BitMath.mul(currLiquidity, sqrtPrice, 256).shln(64);
	if (BitMath.isOverLimit(numerator, 256)) {
		throw new YevefisError(
			"getNextSqrtPriceFromARoundUp - numerator overflow u256",
			MathErrorCode.MultiplicationOverflow,
		);
	}

	const currLiquidityShiftLeft = currLiquidity.shln(64);
	if (!amountSpecifiedIsInput && currLiquidityShiftLeft.lte(p)) {
		throw new YevefisError(
			"getNextSqrtPriceFromARoundUp - Unable to divide currLiquidityX64 by product",
			MathErrorCode.DivideByZero,
		);
	}

	const denominator = amountSpecifiedIsInput
		? currLiquidityShiftLeft.add(p)
		: currLiquidityShiftLeft.sub(p);

	const price = BitMath.divRoundUp(numerator, denominator);

	if (price.lt(new BN(MIN_SQRT_PRICE))) {
		throw new YevefisError(
			"getNextSqrtPriceFromARoundUp - price less than min sqrt price",
			TokenErrorCode.TokenMinSubceeded,
		);
	}
	if (price.gt(new BN(MAX_SQRT_PRICE))) {
		throw new YevefisError(
			"getNextSqrtPriceFromARoundUp - price less than max sqrt price",
			TokenErrorCode.TokenMaxExceeded,
		);
	}

	return price;
}

function getNextSqrtPriceFromBRoundDown(
	sqrtPrice: BN,
	currLiquidity: BN,
	amount: BN,
	amountSpecifiedIsInput: boolean,
) {
	const amountX64 = amount.shln(64);

	const delta = BitMath.divRoundUpIf(
		amountX64,
		currLiquidity,
		!amountSpecifiedIsInput,
	);

	if (amountSpecifiedIsInput) {
		sqrtPrice = sqrtPrice.add(delta);
	} else {
		sqrtPrice = sqrtPrice.sub(delta);
	}

	return sqrtPrice;
}
