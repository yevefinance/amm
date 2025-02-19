"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowerSqrtPriceFromTokenA = getLowerSqrtPriceFromTokenA;
exports.getUpperSqrtPriceFromTokenA = getUpperSqrtPriceFromTokenA;
exports.getLowerSqrtPriceFromTokenB = getLowerSqrtPriceFromTokenB;
exports.getUpperSqrtPriceFromTokenB = getUpperSqrtPriceFromTokenB;
const common_sdk_1 = require("@orca-so/common-sdk");
function getLowerSqrtPriceFromTokenA(amount, liquidity, sqrtPriceX64) {
    const numerator = liquidity.mul(sqrtPriceX64).shln(64);
    const denominator = liquidity.shln(64).add(amount.mul(sqrtPriceX64));
    // always round up
    return common_sdk_1.MathUtil.divRoundUp(numerator, denominator);
}
function getUpperSqrtPriceFromTokenA(amount, liquidity, sqrtPriceX64) {
    const numerator = liquidity.mul(sqrtPriceX64).shln(64);
    const denominator = liquidity.shln(64).sub(amount.mul(sqrtPriceX64));
    // always round up
    return common_sdk_1.MathUtil.divRoundUp(numerator, denominator);
}
function getLowerSqrtPriceFromTokenB(amount, liquidity, sqrtPriceX64) {
    // always round down
    return sqrtPriceX64.sub(common_sdk_1.MathUtil.divRoundUp(amount.shln(64), liquidity));
}
function getUpperSqrtPriceFromTokenB(amount, liquidity, sqrtPriceX64) {
    // always round down (rounding up a negative number)
    return sqrtPriceX64.add(amount.shln(64).div(liquidity));
}
