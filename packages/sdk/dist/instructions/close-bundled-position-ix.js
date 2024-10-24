"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeBundledPositionIx = closeBundledPositionIx;
/**
 * Close a bundled position in a Yevefi.
 *
 * #### Special Errors
 * `InvalidBundleIndex` - If the provided bundle index is out of bounds.
 * `ClosePositionNotEmpty` - The provided position account is not empty.
 *
 * @category Instructions
 * @param program - program object containing services required to generate the instruction
 * @param params - CloseBundledPositionParams object
 * @returns - Instruction to perform the action.
 */
function closeBundledPositionIx(program, params) {
    const { bundledPosition, positionBundle, positionBundleTokenAccount, positionBundleAuthority, bundleIndex, receiver, } = params;
    const ix = program.instruction.closeBundledPosition(bundleIndex, {
        accounts: {
            bundledPosition,
            positionBundle,
            positionBundleTokenAccount,
            positionBundleAuthority,
            receiver,
        },
    });
    return {
        instructions: [ix],
        cleanupInstructions: [],
        signers: [],
    };
}
