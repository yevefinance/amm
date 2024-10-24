import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";
/**
 * Parameters to collect protocol fees for a Yevefi
 *
 * @category Instruction Types
 * @param yevefisConfig - The public key for the YevefisConfig this pool is initialized in
 * @param yevefi - PublicKey for the yevefi that the position will be opened for.
 * @param tokenVaultA - PublicKey for the tokenA vault for this yevefi.
 * @param tokenVaultB - PublicKey for the tokenB vault for this yevefi.
 * @param tokenOwnerAccountA - PublicKey for the associated token account for tokenA in the collection wallet
 * @param tokenOwnerAccountB - PublicKey for the associated token account for tokenA in the collection wallet
 * @param collectProtocolFeesAuthority - assigned authority in the YevefisConfig that can collect protocol fees
 */
export type CollectProtocolFeesParams = {
    yevefisConfig: PublicKey;
    yevefi: PublicKey;
    tokenVaultA: PublicKey;
    tokenVaultB: PublicKey;
    tokenOwnerAccountA: PublicKey;
    tokenOwnerAccountB: PublicKey;
    collectProtocolFeesAuthority: PublicKey;
};
/**
 * Collect protocol fees accrued in this Yevefi.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - CollectProtocolFeesParams object
 * @returns - Instruction to perform the action.
 */
export declare function collectProtocolFeesIx(program: Program<Yevefi>, params: CollectProtocolFeesParams): Instruction;
