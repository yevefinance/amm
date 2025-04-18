"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultProtocolFeeRateIx = setDefaultProtocolFeeRateIx;
/**
 * Updates a YevefisConfig with a new default protocol fee rate. The new rate will not retroactively update
 * initialized pools.
 *
 * #### Special Errors
 * - `ProtocolFeeRateMaxExceeded` - If the provided default_protocol_fee_rate exceeds MAX_PROTOCOL_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetDefaultFeeRateParams object
 * @returns - Instruction to perform the action.
 */
function setDefaultProtocolFeeRateIx(program, params) {
    const { yevefisConfig, feeAuthority, defaultProtocolFeeRate } = params;
    const ix = program.instruction.setDefaultProtocolFeeRate(defaultProtocolFeeRate, {
        accounts: {
            yevefisConfig,
            feeAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
