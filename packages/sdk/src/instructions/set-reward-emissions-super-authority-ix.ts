import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";

/**
 * Parameters to set rewards emissions for a reward in a Yevefi
 *
 * @category Instruction Types
 * @param yevefisConfig - PublicKey for the YevefisConfig that we want to update.
 * @param rewardEmissionsSuperAuthority - Current reward emission super authority in this YevefisConfig
 * @param newRewardEmissionsSuperAuthority - New reward emission super authority for this YevefisConfig
 */
export type SetRewardEmissionsSuperAuthorityParams = {
	yevefisConfig: PublicKey;
	rewardEmissionsSuperAuthority: PublicKey;
	newRewardEmissionsSuperAuthority: PublicKey;
};

/**
 * Set the yevefi reward super authority for a YevefisConfig
 * Only the current reward super authority has permission to invoke this instruction.
 * This instruction will not change the authority on any `YevefiRewardInfo` yevefi rewards.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetRewardEmissionsSuperAuthorityParams object
 * @returns - Instruction to perform the action.
 */
export function setRewardEmissionsSuperAuthorityIx(
	program: Program<Yevefi>,
	params: SetRewardEmissionsSuperAuthorityParams,
): Instruction {
	const {
		yevefisConfig,
		rewardEmissionsSuperAuthority,
		newRewardEmissionsSuperAuthority,
	} = params;

	const ix = program.instruction.setRewardEmissionsSuperAuthority({
		accounts: {
			yevefisConfig,
			rewardEmissionsSuperAuthority: rewardEmissionsSuperAuthority,
			newRewardEmissionsSuperAuthority,
		},
	});

	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}
