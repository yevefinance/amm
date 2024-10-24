import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";

/**
 * Parameters to update the reward authority at a particular rewardIndex on a Yevefi.
 *
 * @category Instruction Types
 * @param yevefi - PublicKey for the yevefi to update. This yevefi has to be part of the provided YevefisConfig space.
 * @param yevefisConfig - The public key for the YevefisConfig this pool is initialized in
 * @param rewardIndex - The reward index that we'd like to update. (0 <= index <= NUM_REWARDS).
 * @param rewardEmissionsSuperAuthority - The current rewardEmissionsSuperAuthority in the YevefisConfig
 * @param newRewardAuthority - The new rewardAuthority in the Yevefi at the rewardIndex
 */
export type SetRewardAuthorityBySuperAuthorityParams = {
	yevefi: PublicKey;
	yevefisConfig: PublicKey;
	rewardIndex: number;
	rewardEmissionsSuperAuthority: PublicKey;
	newRewardAuthority: PublicKey;
};

/**
 * Set the yevefi reward authority at the provided `reward_index`.
 * Only the current reward super authority has permission to invoke this instruction.
 *
 * #### Special Errors
 * - `InvalidRewardIndex` - If the provided reward index doesn't match the lowest uninitialized index in this pool,
 *                          or exceeds NUM_REWARDS.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetRewardAuthorityParams object
 * @returns - Instruction to perform the action.
 */
export function setRewardAuthorityBySuperAuthorityIx(
	program: Program<Yevefi>,
	params: SetRewardAuthorityBySuperAuthorityParams,
): Instruction {
	const {
		yevefisConfig,
		yevefi,
		rewardEmissionsSuperAuthority,
		newRewardAuthority,
		rewardIndex,
	} = params;

	const ix = program.instruction.setRewardAuthorityBySuperAuthority(
		rewardIndex,
		{
			accounts: {
				yevefisConfig,
				yevefi,
				rewardEmissionsSuperAuthority,
				newRewardAuthority,
			},
		},
	);

	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}
