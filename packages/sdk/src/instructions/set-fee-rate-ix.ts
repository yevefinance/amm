import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";

/**
 * Parameters to set fee rate for a Yevefi.
 *
 * @category Instruction Types
 * @param yevefi - PublicKey for the yevefi to update. This yevefi has to be part of the provided YevefisConfig space.
 * @param yevefisConfig - The public key for the YevefisConfig this pool is initialized in
 * @param feeAuthority - Authority authorized in the YevefisConfig to set default fee rates.
 * @param feeRate - The new fee rate for this fee-tier. Stored as a hundredths of a basis point.
 */
export type SetFeeRateParams = {
	yevefi: PublicKey;
	yevefisConfig: PublicKey;
	feeAuthority: PublicKey;
	feeRate: number;
};

/**
 * Sets the fee rate for a Yevefi.
 * Only the current fee authority has permission to invoke this instruction.
 *
 * #### Special Errors
 * - `FeeRateMaxExceeded` - If the provided fee_rate exceeds MAX_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetFeeRateParams object
 * @returns - Instruction to perform the action.
 */
export function setFeeRateIx(
	program: Program<Yevefi>,
	params: SetFeeRateParams,
): Instruction {
	const { yevefisConfig, yevefi, feeAuthority, feeRate } = params;

	const ix = program.instruction.setFeeRate(feeRate, {
		accounts: {
			yevefisConfig,
			yevefi,
			feeAuthority,
		},
	});

	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}
