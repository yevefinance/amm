"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePoolIx = initializePoolIx;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
/**
 * Initializes a tick_array account to represent a tick-range in a Yevefi.
 *
 * Special Errors
 * `InvalidTokenMintOrder` - The order of mints have to be ordered by
 * `SqrtPriceOutOfBounds` - provided initial_sqrt_price is not between 2^-64 to 2^64
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - InitPoolParams object
 * @returns - Instruction to perform the action.
 */
function initializePoolIx(program, params) {
    const { initSqrtPrice, tokenMintA, tokenMintB, yevefisConfig, yevefiPda, feeTierKey, tokenVaultAKeypair, tokenVaultBKeypair, tickSpacing, funder, } = params;
    const yevefiBumps = {
        yevefiBump: yevefiPda.bump,
    };
    const ix = program.instruction.initializePool(yevefiBumps, tickSpacing, initSqrtPrice, {
        accounts: {
            yevefisConfig,
            tokenMintA,
            tokenMintB,
            funder,
            yevefi: yevefiPda.publicKey,
            tokenVaultA: tokenVaultAKeypair.publicKey,
            tokenVaultB: tokenVaultBKeypair.publicKey,
            feeTier: feeTierKey,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [tokenVaultAKeypair, tokenVaultBKeypair],
    };
}
