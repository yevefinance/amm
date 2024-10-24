"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitMath = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const common_sdk_1 = require("@orca-so/common-sdk");
const errors_1 = require("../../errors/errors");
class BitMath {
    static mul(n0, n1, limit) {
        const result = n0.mul(n1);
        if (BitMath.isOverLimit(result, limit)) {
            throw new errors_1.YevefisError(`Mul result higher than u${limit}`, errors_1.MathErrorCode.MultiplicationOverflow);
        }
        return result;
    }
    static mulDiv(n0, n1, d, limit) {
        return BitMath.mulDivRoundUpIf(n0, n1, d, false, limit);
    }
    static mulDivRoundUp(n0, n1, d, limit) {
        return BitMath.mulDivRoundUpIf(n0, n1, d, true, limit);
    }
    static mulDivRoundUpIf(n0, n1, d, roundUp, limit) {
        if (d.eq(common_sdk_1.ZERO)) {
            throw new errors_1.YevefisError("mulDiv denominator is zero", errors_1.MathErrorCode.DivideByZero);
        }
        const p = BitMath.mul(n0, n1, limit);
        const n = p.div(d);
        return roundUp && p.mod(d).gt(common_sdk_1.ZERO) ? n.add(common_sdk_1.ONE) : n;
    }
    static checked_mul_shift_right(n0, n1, limit) {
        return BitMath.checked_mul_shift_right_round_up_if(n0, n1, false, limit);
    }
    static checked_mul_shift_right_round_up_if(n0, n1, roundUp, limit) {
        if (n0.eq(common_sdk_1.ZERO) || n1.eq(common_sdk_1.ZERO)) {
            return common_sdk_1.ZERO;
        }
        const p = BitMath.mul(n0, n1, limit);
        if (BitMath.isOverLimit(p, limit)) {
            throw new errors_1.YevefisError(`MulShiftRight overflowed u${limit}.`, errors_1.MathErrorCode.MultiplicationShiftRightOverflow);
        }
        const result = common_sdk_1.MathUtil.fromX64_BN(p);
        const shouldRound = roundUp && result.and(common_sdk_1.U64_MAX).gt(common_sdk_1.ZERO);
        if (shouldRound && result.eq(common_sdk_1.U64_MAX)) {
            throw new errors_1.YevefisError(`MulShiftRight overflowed u${limit}.`, errors_1.MathErrorCode.MultiplicationOverflow);
        }
        return shouldRound ? result.add(common_sdk_1.ONE) : result;
    }
    static isOverLimit(n0, limit) {
        const limitBN = common_sdk_1.TWO.pow(new anchor_1.BN(limit)).sub(common_sdk_1.ONE);
        return n0.gt(limitBN);
    }
    static divRoundUp(n, d) {
        return BitMath.divRoundUpIf(n, d, true);
    }
    static divRoundUpIf(n, d, roundUp) {
        if (d.eq(common_sdk_1.ZERO)) {
            throw new errors_1.YevefisError("divRoundUpIf - divide by zero", errors_1.MathErrorCode.DivideByZero);
        }
        const q = n.div(d);
        return roundUp && n.mod(d).gt(common_sdk_1.ZERO) ? q.add(common_sdk_1.ONE) : q;
    }
}
exports.BitMath = BitMath;
