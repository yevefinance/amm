"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseLiquidityIx = increaseLiquidityIx;
const spl_token_1 = require("@solana/spl-token");
/**
 * Add liquidity to a position in the Yevefi.
 *
 * #### Special Errors
 * `LiquidityZero` - Provided liquidity amount is zero.
 * `LiquidityTooHigh` - Provided liquidity exceeds u128::max.
 * `TokenMaxExceeded` - The required token to perform this operation exceeds the user defined amount.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - IncreaseLiquidityParams object
 * @returns - Instruction to perform the action.
 */
function increaseLiquidityIx(program, params) {
    const { liquidityAmount, tokenMaxA, tokenMaxB, yevefi, positionAuthority, position, positionTokenAccount, tokenOwnerAccountA, tokenOwnerAccountB, tokenVaultA, tokenVaultB, tickArrayLower, tickArrayUpper, } = params;
    const ix = program.instruction.increaseLiquidity(liquidityAmount, tokenMaxA, tokenMaxB, {
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
