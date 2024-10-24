"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreaseLiquidityIx = decreaseLiquidityIx;
const spl_token_1 = require("@solana/spl-token");
/**
 * Remove liquidity to a position in the Yevefi.
 *
 * #### Special Errors
 * - `LiquidityZero` - Provided liquidity amount is zero.
 * - `LiquidityTooHigh` - Provided liquidity exceeds u128::max.
 * - `TokenMinSubceeded` - The required token to perform this operation subceeds the user defined amount.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - DecreaseLiquidityParams object
 * @returns - Instruction to perform the action.
 */
function decreaseLiquidityIx(program, params) {
    const { liquidityAmount, tokenMinA, tokenMinB, yevefi, positionAuthority, position, positionTokenAccount, tokenOwnerAccountA, tokenOwnerAccountB, tokenVaultA, tokenVaultB, tickArrayLower, tickArrayUpper, } = params;
    const ix = program.instruction.decreaseLiquidity(liquidityAmount, tokenMinA, tokenMinB, {
        accounts: {
            yevefi,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            positionAuthority,
            position,
            positionTokenAccount,
            tokenOwnerAccountA,
            tokenOwnerAccountB,
            tokenVaultA,
            tokenVaultB,
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
