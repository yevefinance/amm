import type { Program } from "@coral-xyz/anchor";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";

import type { Instruction } from "@orca-so/common-sdk";

/**
 * Parameters to update fees and reward values for a position.
 *
 * @category Instruction Types
 * @param yevefi - PublicKey for the yevefi that the position will be opened for.
 * @param position - PublicKey for the  position will be opened for.
 * @param tickArrayLower - PublicKey for the tick-array account that hosts the tick at the lower tick index.
 * @param tickArrayUpper - PublicKey for the tick-array account that hosts the tick at the upper tick index.
 */
export type UpdateFeesAndRewardsParams = {
	yevefi: PublicKey;
	position: PublicKey;
	tickArrayLower: PublicKey;
	tickArrayUpper: PublicKey;
};

/**
 * Update the accrued fees and rewards for a position.
 *
 * #### Special Errors
 * `TickNotFound` - Provided tick array account does not contain the tick for this position.
 * `LiquidityZero` - Position has zero liquidity and therefore already has the most updated fees and reward values.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - UpdateFeesAndRewardsParams object
 * @returns - Instruction to perform the action.
 */
export function updateFeesAndRewardsIx(
	program: Program<Yevefi>,
	params: UpdateFeesAndRewardsParams,
): Instruction {
	const { yevefi, position, tickArrayLower, tickArrayUpper } = params;

	const ix = program.instruction.updateFeesAndRewards({
		accounts: {
			yevefi,
			position,
			tickArrayLower,
			tickArrayUpper,
		},
	});

	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}
