"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFeeTierIx = initializeFeeTierIx;
const web3_js_1 = require("@solana/web3.js");
/**
 * Initializes a fee tier account usable by Yevefis in this YevefisConfig space.
 *
 *  Special Errors
 * `FeeRateMaxExceeded` - If the provided default_fee_rate exceeds MAX_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - InitFeeTierParams object
 * @returns - Instruction to perform the action.
 */
function initializeFeeTierIx(program, params) {
    const { feeTierPda, yevefisConfig, tickSpacing, feeAuthority, defaultFeeRate, funder, } = params;
    const ix = program.instruction.initializeFeeTier(tickSpacing, defaultFeeRate, {
        accounts: {
            config: yevefisConfig,
            feeTier: feeTierPda.publicKey,
            feeAuthority,
            funder,
            systemProgram: web3_js_1.SystemProgram.programId,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
