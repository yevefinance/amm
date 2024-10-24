import { BN } from "@coral-xyz/anchor";
import type { PublicKey } from "@solana/web3.js";
/**
 * @category Yevefi Utils
 */
export declare class PDAUtil {
    /**
     *
     * @param programId
     * @param yevefisConfigKey
     * @param tokenMintAKey
     * @param tokenMintBKey
     * @param tickSpacing
     * @returns
     */
    static getYevefi(programId: PublicKey, yevefisConfigKey: PublicKey, tokenMintAKey: PublicKey, tokenMintBKey: PublicKey, tickSpacing: number): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param positionMintKey
     * @returns
     */
    static getPosition(programId: PublicKey, positionMintKey: PublicKey): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param positionMintKey
     * @returns
     */
    static getPositionMetadata(positionMintKey: PublicKey): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param yevefiAddress
     * @param startTick
     * @returns
     */
    static getTickArray(programId: PublicKey, yevefiAddress: PublicKey, startTick: number): import("@orca-so/common-sdk").PDA;
    /**
     * Get the PDA of the tick array containing tickIndex.
     * tickArrayOffset can be used to get neighboring tick arrays.
     *
     * @param tickIndex
     * @param tickSpacing
     * @param yevefi
     * @param programId
     * @param tickArrayOffset
     * @returns
     */
    static getTickArrayFromTickIndex(tickIndex: number, tickSpacing: number, yevefi: PublicKey, programId: PublicKey, tickArrayOffset?: number): import("@orca-so/common-sdk").PDA;
    static getTickArrayFromSqrtPrice(sqrtPriceX64: BN, tickSpacing: number, yevefi: PublicKey, programId: PublicKey, tickArrayOffset?: number): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param yevefisConfigAddress
     * @param tickSpacing
     * @returns
     */
    static getFeeTier(programId: PublicKey, yevefisConfigAddress: PublicKey, tickSpacing: number): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param yevefiAddress
     * @returns
     */
    static getOracle(programId: PublicKey, yevefiAddress: PublicKey): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param positionBundleMintKey
     * @param bundleIndex
     * @returns
     */
    static getBundledPosition(programId: PublicKey, positionBundleMintKey: PublicKey, bundleIndex: number): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param positionBundleMintKey
     * @returns
     */
    static getPositionBundle(programId: PublicKey, positionBundleMintKey: PublicKey): import("@orca-so/common-sdk").PDA;
    /**
     * @category Program Derived Addresses
     * @param positionBundleMintKey
     * @returns
     */
    static getPositionBundleMetadata(positionBundleMintKey: PublicKey): import("@orca-so/common-sdk").PDA;
}
