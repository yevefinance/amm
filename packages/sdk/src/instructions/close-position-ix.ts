import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";

/**
 * Parameters to close a position in a Yevefi.
 *
 * @category Instruction Types
 * @param receiver - PublicKey for the wallet that will receive the rented lamports.
 * @param position - PublicKey for the position.
 * @param positionMint - PublicKey for the mint token for the Position token.
 * @param positionTokenAccount - The associated token address for the position token in the owners wallet.
 * @param positionAuthority - Authority that owns the position token.
 */
export type ClosePositionParams = {
	receiver: PublicKey;
	position: PublicKey;
	positionMint: PublicKey;
	positionTokenAccount: PublicKey;
	positionAuthority: PublicKey;
};

/**
 * Close a position in a Yevefi. Burns the position token in the owner's wallet.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - ClosePositionParams object
 * @returns - Instruction to perform the action.
 */
export function closePositionIx(
	program: Program<Yevefi>,
	params: ClosePositionParams,
): Instruction {
	const {
		positionAuthority,
		receiver,
		position,
		positionMint,
		positionTokenAccount,
	} = params;

	const ix = program.instruction.closePosition({
		accounts: {
			positionAuthority,
			receiver,
			position,
			positionMint,
			positionTokenAccount,
			tokenProgram: TOKEN_PROGRAM_ID,
		},
	});

	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}
