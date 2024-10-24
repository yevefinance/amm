"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeesAndRewardsIx = updateFeesAndRewardsIx;
/**
 * Update the accrued fees and rewards for a position.
 *
 * #### Special Errors
 * `TickNotFound` - Provided tick array account does not contain the tick for this position.
 * `LiquidityZero` - Position has zero liquidity and therefore already has the most updated fees and reward values.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - UpdateFeesAndRewardsParams object
 * @returns - Instruction to perform the action.
 */
function updateFeesAndRewardsIx(program, params) {
    const { yevefi, position, tickArrayLower, tickArrayUpper } = params;
    const ix = program.instruction.updateFeesAndRewards({
        accounts: {
            yevefi,
            position,
            tickArrayLower,
            tickArrayUpper,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
