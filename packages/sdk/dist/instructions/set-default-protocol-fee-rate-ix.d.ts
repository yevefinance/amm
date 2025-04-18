import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";
/**
 * Parameters to set the default fee rate for a FeeTier.
 *
 * @category Instruction Types
 * @param yevefisConfig - The public key for the YevefisConfig this pool is initialized in
 * @param feeAuthority - Authority authorized in the YevefisConfig to set default fee rates.
 * @param defaultProtocolFeeRate - The new default protocol fee rate for this config. Stored as a basis point of the total fees collected by feeRate.
 */
export type SetDefaultProtocolFeeRateParams = {
    yevefisConfig: PublicKey;
    feeAuthority: PublicKey;
    defaultProtocolFeeRate: number;
};
/**
 * Updates a YevefisConfig with a new default protocol fee rate. The new rate will not retroactively update
 * initialized pools.
 *
 * #### Special Errors
 * - `ProtocolFeeRateMaxExceeded` - If the provided default_protocol_fee_rate exceeds MAX_PROTOCOL_FEE_RATE.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetDefaultFeeRateParams object
 * @returns - Instruction to perform the action.
 */
export declare function setDefaultProtocolFeeRateIx(program: Program<Yevefi>, params: SetDefaultProtocolFeeRateParams): Instruction;
