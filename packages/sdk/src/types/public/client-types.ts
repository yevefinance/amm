import type { Account, Mint } from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";
import type { TickArrayData, YevefiRewardInfoData } from "./anchor-types";

/**
 * Extended Mint type to host token info.
 * @category YevefiClient
 */
export type TokenInfo = Mint & { mint: PublicKey };

/**
 * Extended (token) Account type to host account info for a Token.
 * @category YevefiClient
 */
export type TokenAccountInfo = Account;

/**
 * Type to represent a reward for a reward index on a Yevefi.
 * @category YevefiClient
 */
export type YevefiRewardInfo = YevefiRewardInfoData & {
	initialized: boolean;
	vaultAmount: BN;
};

/**
 * A wrapper class of a TickArray on a Yevefi
 * @category YevefiClient
 */
export type TickArray = {
	address: PublicKey;
	data: TickArrayData | null;
};
