"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectRewardIx = collectRewardIx;
const spl_token_1 = require("@solana/spl-token");
/**
 * Collect rewards accrued for this reward index in a position.
 * Call updateFeesAndRewards before this to update the position to the newest accrued values.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - CollectRewardParams object
 * @returns - Instruction to perform the action.
 */
function collectRewardIx(program, params) {
    const { yevefi, positionAuthority, position, positionTokenAccount, rewardOwnerAccount, rewardVault, rewardIndex, } = params;
    const ix = program.instruction.collectReward(rewardIndex, {
        accounts: {
            yevefi,
            positionAuthority,
            position,
            positionTokenAccount,
            rewardOwnerAccount,
            rewardVault,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
