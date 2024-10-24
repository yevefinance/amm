"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCollectProtocolFeesAuthorityIx = setCollectProtocolFeesAuthorityIx;
/**
 * Sets the fee authority to collect protocol fees for a YevefisConfig.
 * Only the current collect protocol fee authority has permission to invoke this instruction.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetCollectProtocolFeesAuthorityParams object
 * @returns - Instruction to perform the action.
 */
function setCollectProtocolFeesAuthorityIx(program, params) {
    const { yevefisConfig, collectProtocolFeesAuthority, newCollectProtocolFeesAuthority, } = params;
    const ix = program.instruction.setCollectProtocolFeesAuthority({
        accounts: {
            yevefisConfig,
            collectProtocolFeesAuthority,
            newCollectProtocolFeesAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
