"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRewardEmissionsSuperAuthorityIx = setRewardEmissionsSuperAuthorityIx;
/**
 * Set the yevefi reward super authority for a YevefisConfig
 * Only the current reward super authority has permission to invoke this instruction.
 * This instruction will not change the authority on any `YevefiRewardInfo` yevefi rewards.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetRewardEmissionsSuperAuthorityParams object
 * @returns - Instruction to perform the action.
 */
function setRewardEmissionsSuperAuthorityIx(program, params) {
    const { yevefisConfig, rewardEmissionsSuperAuthority, newRewardEmissionsSuperAuthority, } = params;
    const ix = program.instruction.setRewardEmissionsSuperAuthority({
        accounts: {
            yevefisConfig,
            rewardEmissionsSuperAuthority: rewardEmissionsSuperAuthority,
            newRewardEmissionsSuperAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
