import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";
/**
 * Parameters to set the fee authority in a YevefisConfig
 *
 * @category Instruction Types
 * @param yevefisConfig - The public key for the YevefisConfig this pool is initialized in
 * @param feeAuthority - The current feeAuthority in the YevefisConfig
 * @param newFeeAuthority - The new feeAuthority in the YevefisConfig
 */
export type SetFeeAuthorityParams = {
    yevefisConfig: PublicKey;
    feeAuthority: PublicKey;
    newFeeAuthority: PublicKey;
};
/**
 * Sets the fee authority for a YevefisConfig.
 * The fee authority can set the fee & protocol fee rate for individual pools or set the default fee rate for newly minted pools.
 * Only the current fee authority has permission to invoke this instruction.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - SetFeeAuthorityParams object
 * @returns - Instruction to perform the action.
 */
export declare function setFeeAuthorityIx(program: Program<Yevefi>, params: SetFeeAuthorityParams): Instruction;
