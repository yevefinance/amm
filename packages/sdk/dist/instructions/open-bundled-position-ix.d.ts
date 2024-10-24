import type { Program } from "@coral-xyz/anchor";
import type { Instruction, PDA } from "@orca-so/common-sdk";
import { type PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";
/**
 * Parameters to open a bundled position in a Yevefi.
 *
 * @category Instruction Types
 * @param yevefi - PublicKey for the yevefi that the bundled position will be opened for.
 * @param bundledPositionPda - PDA for the derived bundled position address.
 * @param positionBundle - PublicKey for the position bundle.
 * @param positionBundleTokenAccount - The associated token address for the position bundle token in the owners wallet.
 * @param positionBundleAuthority - authority that owns the token corresponding to this desired bundled position.
 * @param bundleIndex - The bundle index that holds the bundled position.
 * @param tickLowerIndex - The tick specifying the lower end of the bundled position range.
 * @param tickUpperIndex - The tick specifying the upper end of the bundled position range.
 * @param funder - The account that would fund the creation of this account
 */
export type OpenBundledPositionParams = {
    yevefi: PublicKey;
    bundledPositionPda: PDA;
    positionBundle: PublicKey;
    positionBundleTokenAccount: PublicKey;
    positionBundleAuthority: PublicKey;
    bundleIndex: number;
    tickLowerIndex: number;
    tickUpperIndex: number;
    funder: PublicKey;
};
/**
 * Open a bundled position in a Yevefi.
 * No new tokens are issued because the owner of the position bundle becomes the owner of the position.
 * The position will start off with 0 liquidity.
 *
 * #### Special Errors
 * `InvalidBundleIndex` - If the provided bundle index is out of bounds.
 * `InvalidTickIndex` - If a provided tick is out of bounds, out of order or not a multiple of the tick-spacing in this pool.
 *
 * @category Instructions
 * @param program - program object containing services required to generate the instruction
 * @param params - OpenBundledPositionParams object
 * @returns - Instruction to perform the action.
 */
export declare function openBundledPositionIx(program: Program<Yevefi>, params: OpenBundledPositionParams): Instruction;
