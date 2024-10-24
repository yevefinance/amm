import { type BN, BorshAccountsCoder, type Idl } from "@coral-xyz/anchor";
import type { PublicKey } from "@solana/web3.js";
import YevefiIDL from "../../artifacts/yevefi.json";

/**
 * This file contains the types that has the same structure as the types anchor functions returns.
 * These types are hard-casted by the client function.
 *
 * This file must be manually updated every time the idl updates as accounts will
 * be hard-casted to fit the type.
 */

/**
 * Supported parasable account names from the Yevefi contract.
 * @category Network
 */
export enum AccountName {
	YevefisConfig = "YevefisConfig",
	Position = "Position",
	TickArray = "TickArray",
	Yevefi = "Yevefi",
	FeeTier = "FeeTier",
	PositionBundle = "PositionBundle",
}

export const YEVEFI_IDL = YevefiIDL as Idl;

/**
 * The Anchor coder for the Yevefi program.
 * @category Solana Accounts
 */
export const YEVEFI_CODER = new BorshAccountsCoder(YEVEFI_IDL);

/**
 * Get the size of an account owned by the Yevefi program in bytes.
 * @param accountName Yevefi account name
 * @returns Size in bytes of the account
 */
export function getAccountSize(accountName: AccountName) {
	const size = YEVEFI_CODER.size(
		YEVEFI_IDL.accounts?.find((account) => account.name === accountName)!,
	);
	return size + RESERVED_BYTES[accountName];
}

/**
 * Reserved bytes for each account used for calculating the account size.
 */
const RESERVED_BYTES: ReservedBytes = {
	[AccountName.YevefisConfig]: 2,
	[AccountName.Position]: 0,
	[AccountName.TickArray]: 0,
	[AccountName.Yevefi]: 0,
	[AccountName.FeeTier]: 0,
	[AccountName.PositionBundle]: 64,
};

type ReservedBytes = {
	[name in AccountName]: number;
};

/**
 * Size of the Yevefi account in bytes.
 * @deprecated Please use {@link getAccountSize} instead.
 * @category Solana Accounts
 */
export const YEVEFI_ACCOUNT_SIZE = getAccountSize(AccountName.Yevefi);

/**
 * @category Solana Accounts
 */
export type YevefisConfigData = {
	feeAuthority: PublicKey;
	collectProtocolFeesAuthority: PublicKey;
	rewardEmissionsSuperAuthority: PublicKey;
	defaultFeeRate: number;
	defaultProtocolFeeRate: number;
};

/**
 * @category Solana Accounts
 */
export type YevefiRewardInfoData = {
	mint: PublicKey;
	vault: PublicKey;
	authority: PublicKey;
	emissionsPerSecondX64: BN;
	growthGlobalX64: BN;
};

/**
 * @category Solana Accounts
 */
export type YevefiBumpsData = {
	yevefiBump: number;
};

/**
 * @category Solana Accounts
 */
export type YevefiData = {
	yevefisConfig: PublicKey;
	yevefiBump: number[];
	feeRate: number;
	protocolFeeRate: number;
	liquidity: BN;
	sqrtPrice: BN;
	tickCurrentIndex: number;
	protocolFeeOwedA: BN;
	protocolFeeOwedB: BN;
	tokenMintA: PublicKey;
	tokenVaultA: PublicKey;
	feeGrowthGlobalA: BN;
	tokenMintB: PublicKey;
	tokenVaultB: PublicKey;
	feeGrowthGlobalB: BN;
	rewardLastUpdatedTimestamp: BN;
	rewardInfos: YevefiRewardInfoData[];
	tickSpacing: number;
};

/**
 * @category Solana Accounts
 */
export type TickArrayData = {
	yevefi: PublicKey;
	startTickIndex: number;
	ticks: TickData[];
};

/**
 * @category Solana Accounts
 */
export type TickData = {
	initialized: boolean;
	liquidityNet: BN;
	liquidityGross: BN;
	feeGrowthOutsideA: BN;
	feeGrowthOutsideB: BN;
	rewardGrowthsOutside: BN[];
};

/**
 * @category Solana Accounts
 */
export type PositionRewardInfoData = {
	growthInsideCheckpoint: BN;
	amountOwed: BN;
};

/**
 * @category Solana Accounts
 */
export type OpenPositionBumpsData = {
	positionBump: number;
};

/**
 * @category Solana Accounts
 */
export type OpenPositionWithMetadataBumpsData = {
	positionBump: number;
	metadataBump: number;
};

/**
 * @category Solana Accounts
 */
export type PositionData = {
	yevefi: PublicKey;
	positionMint: PublicKey;
	liquidity: BN;
	tickLowerIndex: number;
	tickUpperIndex: number;
	feeGrowthCheckpointA: BN;
	feeOwedA: BN;
	feeGrowthCheckpointB: BN;
	feeOwedB: BN;
	rewardInfos: PositionRewardInfoData[];
};

/**
 * @category Solana Accounts
 */
export type FeeTierData = {
	yevefisConfig: PublicKey;
	tickSpacing: number;
	defaultFeeRate: number;
};

/**
 * @category Solana Accounts
 */
export type PositionBundleData = {
	positionBundleMint: PublicKey;
	positionBitmap: number[];
};
