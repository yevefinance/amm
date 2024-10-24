"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeConfigIx = initializeConfigIx;
const web3_js_1 = require("@solana/web3.js");
/**
 * Initializes a YevefisConfig account that hosts info & authorities
 * required to govern a set of Yevefis.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - InitConfigParams object
 * @returns - Instruction to perform the action.
 */
function initializeConfigIx(program, params) {
    const { feeAuthority, collectProtocolFeesAuthority, rewardEmissionsSuperAuthority, defaultProtocolFeeRate, funder, } = params;
    const ix = program.instruction.initializeConfig(feeAuthority, collectProtocolFeesAuthority, rewardEmissionsSuperAuthority, defaultProtocolFeeRate, {
        accounts: {
            config: params.yevefisConfigKeypair.publicKey,
            funder,
            systemProgram: web3_js_1.SystemProgram.programId,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [params.yevefisConfigKeypair],
    };
}
