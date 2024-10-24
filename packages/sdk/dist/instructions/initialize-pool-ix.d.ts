import type { BN, Program } from "@coral-xyz/anchor";
import type { Instruction, PDA } from "@orca-so/common-sdk";
import { type Keypair, type PublicKey } from "@solana/web3.js";
import type { Yevefi } from "../artifacts/yevefi";
/**
 * Parameters to initialize a Yevefi account.
 *
 * @category Instruction Types
 * @param initSqrtPrice - The desired initial sqrt-price for this pool
 * @param yevefisConfig - The public key for the YevefisConfig this pool is initialized in
 * @param yevefiPda - PDA for the yevefi account that would be initialized
 * @param tokenMintA - Mint public key for token A
 * @param tokenMintB - Mint public key for token B
 * @param tokenVaultAKeypair - Keypair of the token A vault for this pool
 * @param tokenVaultBKeypair - Keypair of the token B vault for this pool
 * @param feeTierKey - PublicKey of the fee-tier account that this pool would use for the fee-rate
 * @param tickSpacing - The desired tick spacing for this pool.
 * @param funder - The account that would fund the creation of this account
 */
export type InitPoolParams = {
    initSqrtPrice: BN;
    yevefisConfig: PublicKey;
    yevefiPda: PDA;
    tokenMintA: PublicKey;
    tokenMintB: PublicKey;
    tokenVaultAKeypair: Keypair;
    tokenVaultBKeypair: Keypair;
    feeTierKey: PublicKey;
    tickSpacing: number;
    funder: PublicKey;
};
/**
 * Initializes a tick_array account to represent a tick-range in a Yevefi.
 *
 * Special Errors
 * `InvalidTokenMintOrder` - The order of mints have to be ordered by
 * `SqrtPriceOutOfBounds` - provided initial_sqrt_price is not between 2^-64 to 2^64
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - InitPoolParams object
 * @returns - Instruction to perform the action.
 */
export declare function initializePoolIx(program: Program<Yevefi>, params: InitPoolParams): Instruction;
