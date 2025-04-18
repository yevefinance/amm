import type { Program } from "@coral-xyz/anchor";
import type { PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";
import type { Instruction } from "@orca-so/common-sdk";
/**
 * Parameters to collect fees from a position.
 *
 * @category Instruction Types
 * @param yevefi - PublicKey for the yevefi that the position will be opened for.
 * @param position - PublicKey for the  position will be opened for.
 * @param positionTokenAccount - PublicKey for the position token's associated token address.
 * @param tokenOwnerAccountA - PublicKey for the token A account that will be withdrawed from.
 * @param tokenOwnerAccountB - PublicKey for the token B account that will be withdrawed from.
 * @param tokenVaultA - PublicKey for the tokenA vault for this yevefi.
 * @param tokenVaultB - PublicKey for the tokenB vault for this yevefi.
 * @param positionAuthority - authority that owns the token corresponding to this desired position.
 */
export type CollectFeesParams = {
    yevefi: PublicKey;
    position: PublicKey;
    positionTokenAccount: PublicKey;
    tokenOwnerAccountA: PublicKey;
    tokenOwnerAccountB: PublicKey;
    tokenVaultA: PublicKey;
    tokenVaultB: PublicKey;
    positionAuthority: PublicKey;
};
/**
 * Collect fees accrued for this position.
 * Call updateFeesAndRewards before this to update the position to the newest accrued values.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - CollectFeesParams object
 * @returns - Instruction to perform the action.
 */
export declare function collectFeesIx(program: Program<Yevefi>, params: CollectFeesParams): Instruction;
