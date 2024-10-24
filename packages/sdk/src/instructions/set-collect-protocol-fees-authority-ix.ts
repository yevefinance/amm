import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";

/**
 * Parameters to set the collect fee authority in a YevefisConfig
 *
 * @category Instruction Types
 * @param yevefisConfig - The public key for the YevefisConfig this pool is initialized in
 * @param collectProtocolFeesAuthority - The current collectProtocolFeesAuthority in the YevefisConfig
 * @param newCollectProtocolFeesAuthority - The new collectProtocolFeesAuthority in the YevefisConfig
 */
export type SetCollectProtocolFeesAuthorityParams = {
	yevefisConfig: PublicKey;
	collectProtocolFeesAuthority: PublicKey;
	newCollectProtocolFeesAuthority: PublicKey;
};

/**
 * Sets the fee authority to collect protocol fees for a YevefisConfig.
 * Only the current collect protocol fee authority has permission to invoke this instruction.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetCollectProtocolFeesAuthorityParams object
 * @returns - Instruction to perform the action.
 */
export function setCollectProtocolFeesAuthorityIx(
	program: Program<Yevefi>,
	params: SetCollectProtocolFeesAuthorityParams,
): Instruction {
	const {
		yevefisConfig,
		collectProtocolFeesAuthority,
		newCollectProtocolFeesAuthority,
	} = params;

	const ix = program.instruction.setCollectProtocolFeesAuthority({
		accounts: {
			yevefisConfig,
			collectProtocolFeesAuthority,
			newCollectProtocolFeesAuthority,
		},
	});

	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}
