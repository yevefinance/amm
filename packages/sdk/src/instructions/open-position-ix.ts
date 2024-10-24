import type { Program } from "@coral-xyz/anchor";
import type { Instruction, PDA } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import { METADATA_PROGRAM_ADDRESS, YEVEFI_NFT_UPDATE_AUTH } from "..";
import type { Yevefi } from "../artifacts/yevefi";
import type {
	OpenPositionBumpsData,
	OpenPositionWithMetadataBumpsData,
} from "../types/public/anchor-types";
import { openPositionAccounts } from "../utils/instructions-util";

/**
 * Parameters to open a position in a Yevefi.
 *
 * @category Instruction Types
 * @param yevefi - PublicKey for the yevefi that the position will be opened for.
 * @param ownerKey - PublicKey for the wallet that will host the minted position token.
 * @param positionPda - PDA for the derived position address.
 * @param positionMintAddress - PublicKey for the mint token for the Position token.
 * @param positionTokenAccount - The associated token address for the position token in the owners wallet.
 * @param tickLowerIndex - The tick specifying the lower end of the position range.
 * @param tickUpperIndex - The tick specifying the upper end of the position range.
 * @param funder - The account that would fund the creation of this account
 */
export type OpenPositionParams = {
	yevefi: PublicKey;
	owner: PublicKey;
	positionPda: PDA;
	positionMintAddress: PublicKey;
	positionTokenAccount: PublicKey;
	tickLowerIndex: number;
	tickUpperIndex: number;
	funder: PublicKey;
};

/**
 * Open a position in a Yevefi. A unique token will be minted to represent the position in the users wallet.
 * The position will start off with 0 liquidity.
 *
 * #### Special Errors
 * `InvalidTickIndex` - If a provided tick is out of bounds, out of order or not a multiple of the tick-spacing in this pool.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - OpenPositionParams object
 * @returns - Instruction to perform the action.
 */
export function openPositionIx(
	program: Program<Yevefi>,
	params: OpenPositionParams,
): Instruction {
	const { positionPda, tickLowerIndex, tickUpperIndex } = params;

	const bumps: OpenPositionBumpsData = {
		positionBump: positionPda.bump,
	};

	const ix = program.instruction.openPosition(
		bumps,
		tickLowerIndex,
		tickUpperIndex,
		{
			accounts: openPositionAccounts(params),
		},
	);

	// TODO: Require Keypair and auto sign this ix
	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}

/**
 * Open a position in a Yevefi. A unique token will be minted to represent the position
 * in the users wallet. Additional Metaplex metadata is appended to identify the token.
 * The position will start off with 0 liquidity.
 *
 * #### Special Errors
 * `InvalidTickIndex` - If a provided tick is out of bounds, out of order or not a multiple of the tick-spacing in this pool.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - OpenPositionParams object and a derived PDA that hosts the position's metadata.
 * @returns - Instruction to perform the action.
 */
export function openPositionWithMetadataIx(
	program: Program<Yevefi>,
	params: OpenPositionParams & { metadataPda: PDA },
): Instruction {
	const { positionPda, metadataPda, tickLowerIndex, tickUpperIndex } = params;

	const bumps: OpenPositionWithMetadataBumpsData = {
		positionBump: positionPda.bump,
		metadataBump: metadataPda.bump,
	};

	const ix = program.instruction.openPositionWithMetadata(
		bumps,
		tickLowerIndex,
		tickUpperIndex,
		{
			accounts: {
				...openPositionAccounts(params),
				positionMetadataAccount: metadataPda.publicKey,
				metadataProgram: METADATA_PROGRAM_ADDRESS,
				metadataUpdateAuth: YEVEFI_NFT_UPDATE_AUTH,
			},
		},
	);

	// TODO: Require Keypair and auto sign this ix
	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}
