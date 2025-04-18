"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceMath = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const common_sdk_1 = require("@orca-so/common-sdk");
const decimal_js_1 = __importDefault(require("decimal.js"));
const public_1 = require("../../types/public");
const tick_utils_1 = require("./tick-utils");
const BIT_PRECISION = 14;
const LOG_B_2_X32 = "59543866431248";
const LOG_B_P_ERR_MARGIN_LOWER_X64 = "184467440737095516";
const LOG_B_P_ERR_MARGIN_UPPER_X64 = "15793534762490258745";
/**
 * A collection of utility functions to convert between price, tickIndex and sqrtPrice.
 *
 * @category Yevefi Utils
 */
class PriceMath {
    static priceToSqrtPriceX64(price, decimalsA, decimalsB) {
        return common_sdk_1.MathUtil.toX64(price.mul(decimal_js_1.default.pow(10, decimalsB - decimalsA)).sqrt());
    }
    static sqrtPriceX64ToPrice(sqrtPriceX64, decimalsA, decimalsB) {
        return common_sdk_1.MathUtil.fromX64(sqrtPriceX64)
            .pow(2)
            .mul(decimal_js_1.default.pow(10, decimalsA - decimalsB));
    }
    /**
     * @param tickIndex
     * @returns
     */
    static tickIndexToSqrtPriceX64(tickIndex) {
        if (tickIndex > 0) {
            return new anchor_1.BN(tickIndexToSqrtPricePositive(tickIndex));
        }
        return new anchor_1.BN(tickIndexToSqrtPriceNegative(tickIndex));
    }
    /**
     *
     * @param sqrtPriceX64
     * @returns
     */
    static sqrtPriceX64ToTickIndex(sqrtPriceX64) {
        if (sqrtPriceX64.gt(new anchor_1.BN(public_1.MAX_SQRT_PRICE)) ||
            sqrtPriceX64.lt(new anchor_1.BN(public_1.MIN_SQRT_PRICE))) {
            throw new Error("Provided sqrtPrice is not within the supported sqrtPrice range.");
        }
        const msb = sqrtPriceX64.bitLength() - 1;
        const adjustedMsb = new anchor_1.BN(msb - 64);
        const log2pIntegerX32 = signedShiftLeft(adjustedMsb, 32, 128);
        let bit = new anchor_1.BN("8000000000000000", "hex");
        let precision = 0;
        let log2pFractionX64 = new anchor_1.BN(0);
        let r = msb >= 64 ? sqrtPriceX64.shrn(msb - 63) : sqrtPriceX64.shln(63 - msb);
        while (bit.gt(new anchor_1.BN(0)) && precision < BIT_PRECISION) {
            r = r.mul(r);
            const rMoreThanTwo = r.shrn(127);
            r = r.shrn(63 + rMoreThanTwo.toNumber());
            log2pFractionX64 = log2pFractionX64.add(bit.mul(rMoreThanTwo));
            bit = bit.shrn(1);
            precision += 1;
        }
        const log2pFractionX32 = log2pFractionX64.shrn(32);
        const log2pX32 = log2pIntegerX32.add(log2pFractionX32);
        const logbpX64 = log2pX32.mul(new anchor_1.BN(LOG_B_2_X32));
        const tickLow = signedShiftRight(logbpX64.sub(new anchor_1.BN(LOG_B_P_ERR_MARGIN_LOWER_X64)), 64, 128).toNumber();
        const tickHigh = signedShiftRight(logbpX64.add(new anchor_1.BN(LOG_B_P_ERR_MARGIN_UPPER_X64)), 64, 128).toNumber();
        if (tickLow === tickHigh) {
            return tickLow;
        }
        const derivedTickHighSqrtPriceX64 = PriceMath.tickIndexToSqrtPriceX64(tickHigh);
        if (derivedTickHighSqrtPriceX64.lte(sqrtPriceX64)) {
            return tickHigh;
        }
        return tickLow;
    }
    static tickIndexToPrice(tickIndex, decimalsA, decimalsB) {
        return PriceMath.sqrtPriceX64ToPrice(PriceMath.tickIndexToSqrtPriceX64(tickIndex), decimalsA, decimalsB);
    }
    static priceToTickIndex(price, decimalsA, decimalsB) {
        return PriceMath.sqrtPriceX64ToTickIndex(PriceMath.priceToSqrtPriceX64(price, decimalsA, decimalsB));
    }
    static priceToInitializableTickIndex(price, decimalsA, decimalsB, tickSpacing) {
        return tick_utils_1.TickUtil.getInitializableTickIndex(PriceMath.priceToTickIndex(price, decimalsA, decimalsB), tickSpacing);
    }
    /**
     * Utility to invert the price Pb/Pa to Pa/Pb
     * NOTE: precision is lost in this conversion
     *
     * @param price Pb / Pa
     * @param decimalsA Decimals of original token A (i.e. token A in the given Pb / Pa price)
     * @param decimalsB Decimals of original token B (i.e. token B in the given Pb / Pa price)
     * @returns inverted price, i.e. Pa / Pb
     */
    static invertPrice(price, decimalsA, decimalsB) {
        const tick = PriceMath.priceToTickIndex(price, decimalsA, decimalsB);
        const invTick = tick_utils_1.TickUtil.invertTick(tick);
        return PriceMath.tickIndexToPrice(invTick, decimalsB, decimalsA);
    }
    /**
     * Utility to invert the sqrtPriceX64 from X64 repr. of sqrt(Pb/Pa) to X64 repr. of sqrt(Pa/Pb)
     * NOTE: precision is lost in this conversion
     *
     * @param sqrtPriceX64 X64 representation of sqrt(Pb / Pa)
     * @returns inverted sqrtPriceX64, i.e. X64 representation of sqrt(Pa / Pb)
     */
    static invertSqrtPriceX64(sqrtPriceX64) {
        const tick = PriceMath.sqrtPriceX64ToTickIndex(sqrtPriceX64);
        const invTick = tick_utils_1.TickUtil.invertTick(tick);
        return PriceMath.tickIndexToSqrtPriceX64(invTick);
    }
    /**
     * Calculate the sqrtPriceX64 & tick index slippage price boundary for a given price and slippage.
     * Note: This function loses precision
     *
     * @param sqrtPriceX64 the sqrtPriceX64 to apply the slippage on
     * @param slippage the slippage to apply onto the sqrtPriceX64
     * @returns the sqrtPriceX64 & tick index slippage price boundary
     */
    static getSlippageBoundForSqrtPrice(sqrtPriceX64, slippage) {
        const sqrtPriceX64Decimal = common_sdk_1.DecimalUtil.fromBN(sqrtPriceX64);
        const slippageNumerator = new decimal_js_1.default(slippage.numerator.toString());
        const slippageDenominator = new decimal_js_1.default(slippage.denominator.toString());
        const lowerBoundSqrtPriceDecimal = sqrtPriceX64Decimal
            .mul(slippageDenominator.sub(slippageNumerator).sqrt())
            .div(slippageDenominator.sqrt())
            .toDecimalPlaces(0);
        const upperBoundSqrtPriceDecimal = sqrtPriceX64Decimal
            .mul(slippageDenominator.add(slippageNumerator).sqrt())
            .div(slippageDenominator.sqrt())
            .toDecimalPlaces(0);
        const lowerBoundSqrtPrice = anchor_1.BN.min(anchor_1.BN.max(new anchor_1.BN(lowerBoundSqrtPriceDecimal.toString()), public_1.MIN_SQRT_PRICE_BN), public_1.MAX_SQRT_PRICE_BN);
        const upperBoundSqrtPrice = anchor_1.BN.min(anchor_1.BN.max(new anchor_1.BN(upperBoundSqrtPriceDecimal.toString()), public_1.MIN_SQRT_PRICE_BN), public_1.MAX_SQRT_PRICE_BN);
        const lowerTickCurrentIndex = PriceMath.sqrtPriceX64ToTickIndex(lowerBoundSqrtPrice);
        const upperTickCurrentIndex = PriceMath.sqrtPriceX64ToTickIndex(upperBoundSqrtPrice);
        return {
            lowerBound: [lowerBoundSqrtPrice, lowerTickCurrentIndex],
            upperBound: [upperBoundSqrtPrice, upperTickCurrentIndex],
        };
    }
}
exports.PriceMath = PriceMath;
// Private Functions
function tickIndexToSqrtPricePositive(tick) {
    let ratio;
    if ((tick & 1) !== 0) {
        ratio = new anchor_1.BN("79232123823359799118286999567");
    }
    else {
        ratio = new anchor_1.BN("79228162514264337593543950336");
    }
    if ((tick & 2) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("79236085330515764027303304731")), 96, 256);
    }
    if ((tick & 4) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("79244008939048815603706035061")), 96, 256);
    }
    if ((tick & 8) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("79259858533276714757314932305")), 96, 256);
    }
    if ((tick & 16) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("79291567232598584799939703904")), 96, 256);
    }
    if ((tick & 32) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("79355022692464371645785046466")), 96, 256);
    }
    if ((tick & 64) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("79482085999252804386437311141")), 96, 256);
    }
    if ((tick & 128) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("79736823300114093921829183326")), 96, 256);
    }
    if ((tick & 256) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("80248749790819932309965073892")), 96, 256);
    }
    if ((tick & 512) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("81282483887344747381513967011")), 96, 256);
    }
    if ((tick & 1024) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("83390072131320151908154831281")), 96, 256);
    }
    if ((tick & 2048) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("87770609709833776024991924138")), 96, 256);
    }
    if ((tick & 4096) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("97234110755111693312479820773")), 96, 256);
    }
    if ((tick & 8192) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("119332217159966728226237229890")), 96, 256);
    }
    if ((tick & 16384) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("179736315981702064433883588727")), 96, 256);
    }
    if ((tick & 32768) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("407748233172238350107850275304")), 96, 256);
    }
    if ((tick & 65536) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("2098478828474011932436660412517")), 96, 256);
    }
    if ((tick & 131072) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("55581415166113811149459800483533")), 96, 256);
    }
    if ((tick & 262144) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("38992368544603139932233054999993551")), 96, 256);
    }
    return signedShiftRight(ratio, 32, 256);
}
function tickIndexToSqrtPriceNegative(tickIndex) {
    const tick = Math.abs(tickIndex);
    let ratio;
    if ((tick & 1) !== 0) {
        ratio = new anchor_1.BN("18445821805675392311");
    }
    else {
        ratio = new anchor_1.BN("18446744073709551616");
    }
    if ((tick & 2) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("18444899583751176498")), 64, 256);
    }
    if ((tick & 4) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("18443055278223354162")), 64, 256);
    }
    if ((tick & 8) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("18439367220385604838")), 64, 256);
    }
    if ((tick & 16) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("18431993317065449817")), 64, 256);
    }
    if ((tick & 32) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("18417254355718160513")), 64, 256);
    }
    if ((tick & 64) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("18387811781193591352")), 64, 256);
    }
    if ((tick & 128) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("18329067761203520168")), 64, 256);
    }
    if ((tick & 256) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("18212142134806087854")), 64, 256);
    }
    if ((tick & 512) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("17980523815641551639")), 64, 256);
    }
    if ((tick & 1024) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("17526086738831147013")), 64, 256);
    }
    if ((tick & 2048) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("16651378430235024244")), 64, 256);
    }
    if ((tick & 4096) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("15030750278693429944")), 64, 256);
    }
    if ((tick & 8192) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("12247334978882834399")), 64, 256);
    }
    if ((tick & 16384) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("8131365268884726200")), 64, 256);
    }
    if ((tick & 32768) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("3584323654723342297")), 64, 256);
    }
    if ((tick & 65536) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("696457651847595233")), 64, 256);
    }
    if ((tick & 131072) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("26294789957452057")), 64, 256);
    }
    if ((tick & 262144) !== 0) {
        ratio = signedShiftRight(ratio.mul(new anchor_1.BN("37481735321082")), 64, 256);
    }
    return ratio;
}
function signedShiftLeft(n0, shiftBy, bitWidth) {
    const twosN0 = n0.toTwos(bitWidth).shln(shiftBy);
    twosN0.imaskn(bitWidth + 1);
    return twosN0.fromTwos(bitWidth);
}
function signedShiftRight(n0, shiftBy, bitWidth) {
    const twoN0 = n0.toTwos(bitWidth).shrn(shiftBy);
    twoN0.imaskn(bitWidth - shiftBy + 1);
    return twoN0.fromTwos(bitWidth - shiftBy);
}
