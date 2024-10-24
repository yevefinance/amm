import { BN } from "@coral-xyz/anchor";
import { AddressUtil } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import { METADATA_PROGRAM_ADDRESS } from "../../types/public";
import { PriceMath } from "./price-math";
import { TickUtil } from "./tick-utils";

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
export class PDAUtil {
	/**
	 *
	 * @param programId
	 * @param yevefisConfigKey
	 * @param tokenMintAKey
	 * @param tokenMintBKey
	 * @param tickSpacing
	 * @returns
	 */
	public static getYevefi(
		programId: PublicKey,
		yevefisConfigKey: PublicKey,
		tokenMintAKey: PublicKey,
		tokenMintBKey: PublicKey,
		tickSpacing: number,
	) {
		return AddressUtil.findProgramAddress(
			[
				Buffer.from(PDA_YEVEFI_SEED),
				yevefisConfigKey.toBuffer(),
				tokenMintAKey.toBuffer(),
				tokenMintBKey.toBuffer(),
				new BN(tickSpacing).toArrayLike(Buffer, "le", 2),
			],
			programId,
		);
	}

	/**
	 * @category Program Derived Addresses
	 * @param programId
	 * @param positionMintKey
	 * @returns
	 */
	public static getPosition(programId: PublicKey, positionMintKey: PublicKey) {
		return AddressUtil.findProgramAddress(
			[Buffer.from(PDA_POSITION_SEED), positionMintKey.toBuffer()],
			programId,
		);
	}

	/**
	 * @category Program Derived Addresses
	 * @param positionMintKey
	 * @returns
	 */
	public static getPositionMetadata(positionMintKey: PublicKey) {
		return AddressUtil.findProgramAddress(
			[
				Buffer.from(PDA_METADATA_SEED),
				METADATA_PROGRAM_ADDRESS.toBuffer(),
				positionMintKey.toBuffer(),
			],
			METADATA_PROGRAM_ADDRESS,
		);
	}

	/**
	 * @category Program Derived Addresses
	 * @param programId
	 * @param yevefiAddress
	 * @param startTick
	 * @returns
	 */
	public static getTickArray(
		programId: PublicKey,
		yevefiAddress: PublicKey,
		startTick: number,
	) {
		return AddressUtil.findProgramAddress(
			[
				Buffer.from(PDA_TICK_ARRAY_SEED),
				yevefiAddress.toBuffer(),
				Buffer.from(startTick.toString()),
			],
			programId,
		);
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
	public static getTickArrayFromTickIndex(
		tickIndex: number,
		tickSpacing: number,
		yevefi: PublicKey,
		programId: PublicKey,
		tickArrayOffset = 0,
	) {
		const startIndex = TickUtil.getStartTickIndex(
			tickIndex,
			tickSpacing,
			tickArrayOffset,
		);
		return PDAUtil.getTickArray(
			AddressUtil.toPubKey(programId),
			AddressUtil.toPubKey(yevefi),
			startIndex,
		);
	}

	public static getTickArrayFromSqrtPrice(
		sqrtPriceX64: BN,
		tickSpacing: number,
		yevefi: PublicKey,
		programId: PublicKey,
		tickArrayOffset = 0,
	) {
		const tickIndex = PriceMath.sqrtPriceX64ToTickIndex(sqrtPriceX64);
		return PDAUtil.getTickArrayFromTickIndex(
			tickIndex,
			tickSpacing,
			yevefi,
			programId,
			tickArrayOffset,
		);
	}

	/**
	 * @category Program Derived Addresses
	 * @param programId
	 * @param yevefisConfigAddress
	 * @param tickSpacing
	 * @returns
	 */
	public static getFeeTier(
		programId: PublicKey,
		yevefisConfigAddress: PublicKey,
		tickSpacing: number,
	) {
		return AddressUtil.findProgramAddress(
			[
				Buffer.from(PDA_FEE_TIER_SEED),
				yevefisConfigAddress.toBuffer(),
				new BN(tickSpacing).toArrayLike(Buffer, "le", 2),
			],
			programId,
		);
	}

	/**
	 * @category Program Derived Addresses
	 * @param programId
	 * @param yevefiAddress
	 * @returns
	 */
	public static getOracle(programId: PublicKey, yevefiAddress: PublicKey) {
		return AddressUtil.findProgramAddress(
			[Buffer.from(PDA_ORACLE_SEED), yevefiAddress.toBuffer()],
			programId,
		);
	}

	/**
	 * @category Program Derived Addresses
	 * @param programId
	 * @param positionBundleMintKey
	 * @param bundleIndex
	 * @returns
	 */
	public static getBundledPosition(
		programId: PublicKey,
		positionBundleMintKey: PublicKey,
		bundleIndex: number,
	) {
		return AddressUtil.findProgramAddress(
			[
				Buffer.from(PDA_BUNDLED_POSITION_SEED),
				positionBundleMintKey.toBuffer(),
				Buffer.from(bundleIndex.toString()),
			],
			programId,
		);
	}

	/**
	 * @category Program Derived Addresses
	 * @param programId
	 * @param positionBundleMintKey
	 * @returns
	 */
	public static getPositionBundle(
		programId: PublicKey,
		positionBundleMintKey: PublicKey,
	) {
		return AddressUtil.findProgramAddress(
			[Buffer.from(PDA_POSITION_BUNDLE_SEED), positionBundleMintKey.toBuffer()],
			programId,
		);
	}

	/**
	 * @category Program Derived Addresses
	 * @param positionBundleMintKey
	 * @returns
	 */
	public static getPositionBundleMetadata(positionBundleMintKey: PublicKey) {
		return AddressUtil.findProgramAddress(
			[
				Buffer.from(PDA_METADATA_SEED),
				METADATA_PROGRAM_ADDRESS.toBuffer(),
				positionBundleMintKey.toBuffer(),
			],
			METADATA_PROGRAM_ADDRESS,
		);
	}
}
