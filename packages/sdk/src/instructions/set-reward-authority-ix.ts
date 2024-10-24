import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";

/**
 * Parameters to update the reward authority at a particular rewardIndex on a Yevefi.
 *
 * @category Instruction Types
 * @param yevefi - PublicKey for the yevefi to update.
 * @param rewardIndex - The reward index that we'd like to update. (0 <= index <= NUM_REWARDS).
 * @param rewardAuthority - The current rewardAuthority in the Yevefi at the rewardIndex
 * @param newRewardAuthority - The new rewardAuthority in the Yevefi at the rewardIndex
 */
export type SetRewardAuthorityParams = {
	yevefi: PublicKey;
	rewardIndex: number;
	rewardAuthority: PublicKey;
	newRewardAuthority: PublicKey;
};

/**
 * Set the yevefi reward authority at the provided `reward_index`.
 * Only the current reward authority for this reward index has permission to invoke this instruction.
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
export function setRewardAuthorityIx(
	program: Program<Yevefi>,
	params: SetRewardAuthorityParams,
): Instruction {
	const { yevefi, rewardAuthority, newRewardAuthority, rewardIndex } = params;
	const ix = program.instruction.setRewardAuthority(rewardIndex, {
		accounts: {
			yevefi,
			rewardAuthority,
			newRewardAuthority,
		},
	});

	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}
