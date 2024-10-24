import { type Address } from "@orca-so/common-sdk";
import type { Connection } from "@solana/web3.js";
import { type YevefiData } from "../../../types/public";
/**
 * Retrieve a list of yevefi addresses and accounts filtered by the given params using
 * getProgramAccounts.
 * @category Network
 *
 * @param connection The connection to use to fetch accounts
 * @param programId The Yevefi program to search Yevefi accounts for
 * @param configId The {@link YevefiConfig} account program address to filter by
 * @returns tuple of yevefi addresses and accounts
 */
export declare function getAllYevefiAccountsForConfig({ connection, programId, configId, }: {
    connection: Connection;
    programId: Address;
    configId: Address;
}): Promise<ReadonlyMap<string, YevefiData>>;
