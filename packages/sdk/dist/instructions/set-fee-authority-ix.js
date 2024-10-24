"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFeeAuthorityIx = setFeeAuthorityIx;
/**
 * Sets the fee authority for a YevefisConfig.
 * The fee authority can set the fee & protocol fee rate for individual pools or set the default fee rate for newly minted pools.
 * Only the current fee authority has permission to invoke this instruction.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetFeeAuthorityParams object
 * @returns - Instruction to perform the action.
 */
function setFeeAuthorityIx(program, params) {
    const { yevefisConfig, feeAuthority, newFeeAuthority } = params;
    const ix = program.instruction.setFeeAuthority({
        accounts: {
            yevefisConfig,
            feeAuthority,
            newFeeAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
