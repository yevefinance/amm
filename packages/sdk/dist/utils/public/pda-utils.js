"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDAUtil = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const common_sdk_1 = require("@orca-so/common-sdk");
const public_1 = require("../../types/public");
const price_math_1 = require("./price-math");
const tick_utils_1 = require("./tick-utils");
const PDA_YEVEFI_SEED = "yevefi";
const PDA_POSITION_SEED = "position";
const PDA_METADATA_SEED = "metadata";
const PDA_TICK_ARRAY_SEED = "tick_array";
const PDA_FEE_TIER_SEED = "fee_tier";
const PDA_ORACLE_SEED = "oracle";
const PDA_POSITION_BUNDLE_SEED = "position_bundle";
const PDA_BUNDLED_POSITION_SEED = "bundled_position";
/**
 * @category Yevefi Utils
 */
class PDAUtil {
    /**
     *
     * @param programId
     * @param yevefisConfigKey
     * @param tokenMintAKey
     * @param tokenMintBKey
     * @param tickSpacing
     * @returns
     */
    static getYevefi(programId, yevefisConfigKey, tokenMintAKey, tokenMintBKey, tickSpacing) {
        return common_sdk_1.AddressUtil.findProgramAddress([
            Buffer.from(PDA_YEVEFI_SEED),
            yevefisConfigKey.toBuffer(),
            tokenMintAKey.toBuffer(),
            tokenMintBKey.toBuffer(),
            new anchor_1.BN(tickSpacing).toArrayLike(Buffer, "le", 2),
        ], programId);
    }
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param positionMintKey
     * @returns
     */
    static getPosition(programId, positionMintKey) {
        return common_sdk_1.AddressUtil.findProgramAddress([Buffer.from(PDA_POSITION_SEED), positionMintKey.toBuffer()], programId);
    }
    /**
     * @category Program Derived Addresses
     * @param positionMintKey
     * @returns
     */
    static getPositionMetadata(positionMintKey) {
        return common_sdk_1.AddressUtil.findProgramAddress([
            Buffer.from(PDA_METADATA_SEED),
            public_1.METADATA_PROGRAM_ADDRESS.toBuffer(),
            positionMintKey.toBuffer(),
        ], public_1.METADATA_PROGRAM_ADDRESS);
    }
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param yevefiAddress
     * @param startTick
     * @returns
     */
    static getTickArray(programId, yevefiAddress, startTick) {
        return common_sdk_1.AddressUtil.findProgramAddress([
            Buffer.from(PDA_TICK_ARRAY_SEED),
            yevefiAddress.toBuffer(),
            Buffer.from(startTick.toString()),
        ], programId);
    }
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
    static getTickArrayFromTickIndex(tickIndex, tickSpacing, yevefi, programId, tickArrayOffset = 0) {
        const startIndex = tick_utils_1.TickUtil.getStartTickIndex(tickIndex, tickSpacing, tickArrayOffset);
        return PDAUtil.getTickArray(common_sdk_1.AddressUtil.toPubKey(programId), common_sdk_1.AddressUtil.toPubKey(yevefi), startIndex);
    }
    static getTickArrayFromSqrtPrice(sqrtPriceX64, tickSpacing, yevefi, programId, tickArrayOffset = 0) {
        const tickIndex = price_math_1.PriceMath.sqrtPriceX64ToTickIndex(sqrtPriceX64);
        return PDAUtil.getTickArrayFromTickIndex(tickIndex, tickSpacing, yevefi, programId, tickArrayOffset);
    }
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param yevefisConfigAddress
     * @param tickSpacing
     * @returns
     */
    static getFeeTier(programId, yevefisConfigAddress, tickSpacing) {
        return common_sdk_1.AddressUtil.findProgramAddress([
            Buffer.from(PDA_FEE_TIER_SEED),
            yevefisConfigAddress.toBuffer(),
            new anchor_1.BN(tickSpacing).toArrayLike(Buffer, "le", 2),
        ], programId);
    }
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param yevefiAddress
     * @returns
     */
    static getOracle(programId, yevefiAddress) {
        return common_sdk_1.AddressUtil.findProgramAddress([Buffer.from(PDA_ORACLE_SEED), yevefiAddress.toBuffer()], programId);
    }
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param positionBundleMintKey
     * @param bundleIndex
     * @returns
     */
    static getBundledPosition(programId, positionBundleMintKey, bundleIndex) {
        return common_sdk_1.AddressUtil.findProgramAddress([
            Buffer.from(PDA_BUNDLED_POSITION_SEED),
            positionBundleMintKey.toBuffer(),
            Buffer.from(bundleIndex.toString()),
        ], programId);
    }
    /**
     * @category Program Derived Addresses
     * @param programId
     * @param positionBundleMintKey
     * @returns
     */
    static getPositionBundle(programId, positionBundleMintKey) {
        return common_sdk_1.AddressUtil.findProgramAddress([Buffer.from(PDA_POSITION_BUNDLE_SEED), positionBundleMintKey.toBuffer()], programId);
    }
    /**
     * @category Program Derived Addresses
     * @param positionBundleMintKey
     * @returns
     */
    static getPositionBundleMetadata(positionBundleMintKey) {
        return common_sdk_1.AddressUtil.findProgramAddress([
            Buffer.from(PDA_METADATA_SEED),
            public_1.METADATA_PROGRAM_ADDRESS.toBuffer(),
            positionBundleMintKey.toBuffer(),
        ], public_1.METADATA_PROGRAM_ADDRESS);
    }
}
exports.PDAUtil = PDAUtil;
