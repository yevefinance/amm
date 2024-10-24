"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRewardAuthorityBySuperAuthorityIx = setRewardAuthorityBySuperAuthorityIx;
/**
 * Set the yevefi reward authority at the provided `reward_index`.
 * Only the current reward super authority has permission to invoke this instruction.
 *
 * #### Special Errors
 * - `InvalidRewardIndex` - If the provided reward index doesn't match the lowest uninitialized index in this pool,
 *                          or exceeds NUM_REWARDS.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetRewardAuthorityParams object
 * @returns - Instruction to perform the action.
 */
function setRewardAuthorityBySuperAuthorityIx(program, params) {
    const { yevefisConfig, yevefi, rewardEmissionsSuperAuthority, newRewardAuthority, rewardIndex, } = params;
    const ix = program.instruction.setRewardAuthorityBySuperAuthority(rewardIndex, {
        accounts: {
            yevefisConfig,
            yevefi,
            rewardEmissionsSuperAuthority,
            newRewardAuthority,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
