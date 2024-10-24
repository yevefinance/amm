import type { Address } from "@coral-xyz/anchor";
import { type AccountFetcher, type ParsableEntity } from "@orca-so/common-sdk";
import { type Mint, type Account as TokenAccount } from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";
import { type YevefiAccountFetchOptions, type YevefiAccountFetcherInterface, type YevefiSupportedTypes } from "..";
import type { FeeTierData, PositionBundleData, PositionData, TickArrayData, YevefiData, YevefisConfigData } from "../../../types/public";
/**
 * Build a default instance of {@link YevefiAccountFetcherInterface} with the default {@link AccountFetcher} implementation
 * @param connection An instance of {@link Connection} to use for fetching accounts
 * @returns An instance of {@link YevefiAccountFetcherInterface}
 * @category Network
 */
export declare const buildDefaultAccountFetcher: (connection: Connection) => YevefiAccountFetcher;
/**
 * Fetcher and cache layer for fetching {@link YevefiSupportedTypes} from the network
 * Default implementation for {@link YevefiAccountFetcherInterface}
 * @category Network
 */
export declare class YevefiAccountFetcher implements YevefiAccountFetcherInterface {
    readonly connection: Connection;
    readonly fetcher: AccountFetcher<YevefiSupportedTypes, YevefiAccountFetchOptions>;
    private _accountRentExempt;
    constructor(connection: Connection, fetcher: AccountFetcher<YevefiSupportedTypes, YevefiAccountFetchOptions>);
    getAccountRentExempt(refresh?: boolean): Promise<number>;
    getPool(address: Address, opts?: YevefiAccountFetchOptions): Promise<YevefiData | null>;
    getPools(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, YevefiData | null>>;
    getPosition(address: Address, opts?: YevefiAccountFetchOptions): Promise<PositionData | null>;
    getPositions(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, PositionData | null>>;
    getTickArray(address: Address, opts?: YevefiAccountFetchOptions): Promise<TickArrayData | null>;
    getTickArrays(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyArray<TickArrayData | null>>;
    getFeeTier(address: Address, opts?: YevefiAccountFetchOptions): Promise<FeeTierData | null>;
    getFeeTiers(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, FeeTierData | null>>;
    getTokenInfo(address: Address, opts?: YevefiAccountFetchOptions): Promise<TokenAccount | null>;
    getTokenInfos(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, TokenAccount | null>>;
    getMintInfo(address: Address, opts?: YevefiAccountFetchOptions): Promise<Mint | null>;
    getMintInfos(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, Mint | null>>;
    getConfig(address: Address, opts?: YevefiAccountFetchOptions): Promise<YevefisConfigData | null>;
    getConfigs(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, YevefisConfigData | null>>;
    getPositionBundle(address: Address, opts?: YevefiAccountFetchOptions): Promise<PositionBundleData | null>;
    getPositionBundles(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, PositionBundleData | null>>;
    populateCache<T extends YevefiSupportedTypes>(accounts: ReadonlyMap<string, T>, parser: ParsableEntity<T>, now?: number): void;
}
