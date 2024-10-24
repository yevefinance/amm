"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePositionIx = closePositionIx;
const spl_token_1 = require("@solana/spl-token");
/**
 * Close a position in a Yevefi. Burns the position token in the owner's wallet.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - ClosePositionParams object
 * @returns - Instruction to perform the action.
 */
function closePositionIx(program, params) {
    const { positionAuthority, receiver, position, positionMint, positionTokenAccount, } = params;
    const ix = program.instruction.closePosition({
        accounts: {
            positionAuthority,
            receiver,
            position,
            positionMint,
            positionTokenAccount,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
