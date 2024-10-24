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
 * @param protocolFeeRate - The new default protocol fee rate for this pool. Stored as a basis point of the total fees collected by feeRate.
 */
export type SetProtocolFeeRateParams = {
	yevefi: PublicKey;
	yevefisConfig: PublicKey;
	feeAuthority: PublicKey;
	protocolFeeRate: number;
};

/**
 * Sets the protocol fee rate for a Yevefi.
 * Only the current fee authority has permission to invoke this instruction.
 *
 * #### Special Errors
 * - `ProtocolFeeRateMaxExceeded` - If the provided default_protocol_fee_rate exceeds MAX_PROTOCOL_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetFeeRateParams object
 * @returns - Instruction to perform the action.
 */
export function setProtocolFeeRateIx(
	program: Program<Yevefi>,
	params: SetProtocolFeeRateParams,
): Instruction {
	const { yevefisConfig, yevefi, feeAuthority, protocolFeeRate } = params;

	const ix = program.instruction.setProtocolFeeRate(protocolFeeRate, {
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
