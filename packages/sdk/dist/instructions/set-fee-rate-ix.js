"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFeeRateIx = setFeeRateIx;
/**
 * Sets the fee rate for a Yevefi.
 * Only the current fee authority has permission to invoke this instruction.
 *
 * #### Special Errors
 * - `FeeRateMaxExceeded` - If the provided fee_rate exceeds MAX_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetFeeRateParams object
 * @returns - Instruction to perform the action.
 */
function setFeeRateIx(program, params) {
    const { yevefisConfig, yevefi, feeAuthority, feeRate } = params;
    const ix = program.instruction.setFeeRate(feeRate, {
        accounts: {
            yevefisConfig,
            yevefi,
            feeAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
