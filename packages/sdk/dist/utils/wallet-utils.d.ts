import type { Wallet } from "@orca-so/common-sdk";
/**
 * Checks if a wallet is connected.
 * @category Yevefi Utils
 * @param wallet The wallet to check.
 * @returns True if the wallet is connected, false otherwise.
 */
export declare function isWalletConnected(wallet: Wallet | null): boolean;
