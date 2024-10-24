import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";
/**
 * Parameters to set the default fee rate for a FeeTier.
 *
 * @category Instruction Types
 * @param yevefisConfig - The public key for the YevefisConfig this fee-tier is initialized in
 * @param feeAuthority - Authority authorized in the YevefisConfig to set default fee rates.
 * @param tickSpacing - The tick spacing of the fee-tier that we would like to update.
 * @param defaultFeeRate - The new default fee rate for this fee-tier. Stored as a hundredths of a basis point.
 */
export type SetDefaultFeeRateParams = {
    yevefisConfig: PublicKey;
    feeAuthority: PublicKey;
    tickSpacing: number;
    defaultFeeRate: number;
};
/**
 * Updates a fee tier account with a new default fee rate. The new rate will not retroactively update
 * initialized pools.
 *
 * #### Special Errors
 * - `FeeRateMaxExceeded` - If the provided default_fee_rate exceeds MAX_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetDefaultFeeRateParams object
 * @returns - Instruction to perform the action.
 */
export declare function setDefaultFeeRateIx(program: Program<Yevefi>, params: SetDefaultFeeRateParams): Instruction;
