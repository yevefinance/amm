"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultFeeRateIx = setDefaultFeeRateIx;
const public_1 = require("../utils/public");
/**
 * Updates a fee tier account with a new default fee rate. The new rate will not retroactively update
 * initialized pools.
 *
 * #### Special Errors
 * - `FeeRateMaxExceeded` - If the provided default_fee_rate exceeds MAX_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetDefaultFeeRateParams object
 * @returns - Instruction to perform the action.
 */
function setDefaultFeeRateIx(program, params) {
    const { yevefisConfig, feeAuthority, tickSpacing, defaultFeeRate } = params;
    const feeTierPda = public_1.PDAUtil.getFeeTier(program.programId, yevefisConfig, tickSpacing);
    const ix = program.instruction.setDefaultFeeRate(defaultFeeRate, {
        accounts: {
            yevefisConfig,
            feeTier: feeTierPda.publicKey,
            feeAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
