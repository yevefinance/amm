import type { Address } from "@coral-xyz/anchor";
import type { BasicSupportedTypes, ParsableEntity, SimpleAccountFetchOptions } from "@orca-so/common-sdk";
import type { Mint, Account as TokenAccount } from "@solana/spl-token";
import type { FeeTierData, PositionBundleData, PositionData, TickArrayData, YevefiData, YevefisConfigData } from "../../../types/public";
/**
 * Union type of all the {@link ParsableEntity} types that can be cached in the {@link YevefiAccountFetcherInterface}
 * @category Network
 */
export type YevefiSupportedTypes = YevefisConfigData | YevefiData | PositionData | TickArrayData | FeeTierData | PositionBundleData | BasicSupportedTypes;
/**
 * The default retention periods for each {@link ParsableEntity} type in the {@link YevefiAccountFetcherInterface}
 * @category Network
 */
export declare const DEFAULT_YEVEFI_RETENTION_POLICY: ReadonlyMap<ParsableEntity<YevefiSupportedTypes>, number>;
/**
 * Type to define fetch options for the {@link YevefiAccountFetcherInterface}
 * @category Network
 */
export type YevefiAccountFetchOptions = SimpleAccountFetchOptions;
/**
 * Default fetch option for always fetching when making an account request to the {@link YevefiAccountFetcherInterface}
 * @category Network
 */
export declare const IGNORE_CACHE: YevefiAccountFetchOptions;
/**
 * Default fetch option for always using the cached value for an account request to the {@link YevefiAccountFetcherInterface}
 * @category Network
 */
export declare const PREFER_CACHE: YevefiAccountFetchOptions;
/**
 * Fetcher interface for fetching {@link YevefiSupportedTypes} from the network
 * @category Network
 */
export interface YevefiAccountFetcherInterface {
    /**
     * Fetch and cache the rent exempt value
     * @param refresh If true, will always fetch from the network
     */
    getAccountRentExempt(refresh?: boolean): Promise<number>;
    /**
     * Fetch and cache the account for a given Yevefi addresses
     * @param address The mint address
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getPool(address: Address, opts?: YevefiAccountFetchOptions): Promise<YevefiData | null>;
    /**
     * Fetch and cache the accounts for a given array of Yevefi addresses
     * @param addresses The array of mint addresses
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getPools(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, YevefiData | null>>;
    /**
     * Fetch and cache the account for a given Position address
     * @param address The address of the position account
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getPosition(address: Address, opts?: YevefiAccountFetchOptions): Promise<PositionData | null>;
    /**
     * Fetch and cache the accounts for a given array of Position addresses
     * @param addresses The array of position account addresses
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getPositions(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, PositionData | null>>;
    /**
     * Fetch and cache the account for a given TickArray address.
     * @param address The address of the tick array account
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getTickArray(address: Address, opts?: YevefiAccountFetchOptions): Promise<TickArrayData | null>;
    /**
     * Fetch and cache the accounts for a given array of TickArray addresses
     * @param addresses The array of tick array account addresses
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getTickArrays(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyArray<TickArrayData | null>>;
    /**
     * Fetch and cache the account for a given FeeTier address
     * @param address The address of the fee tier account
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getFeeTier(address: Address, opts?: YevefiAccountFetchOptions): Promise<FeeTierData | null>;
    /**
     * Fetch and cache the accounts for a given array of FeeTier addresses
     * @param addresses The array of fee tier account addresses
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getFeeTiers(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, FeeTierData | null>>;
    /**
     * Fetch and cache the account for a given TokenAccount address
     * @param address The address of the token account
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getTokenInfo(address: Address, opts?: YevefiAccountFetchOptions): Promise<TokenAccount | null>;
    /**
     * Fetch and cache the accounts for a given array of TokenAccount addresses
     * @param addresses The array of token account addresses
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getTokenInfos(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, TokenAccount | null>>;
    /**
     * Fetch and cache the account for a given Mint address
     * @param address The address of the mint account
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getMintInfo(address: Address, opts?: YevefiAccountFetchOptions): Promise<Mint | null>;
    /**
     * Fetch and cache the accounts for a given array of Mint addresses
     * @param addresses The array of mint account addresses
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getMintInfos(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, Mint | null>>;
    /**
     * Fetch and cache the account for a given YevefiConfig address
     * @param address The address of the YevefiConfig account
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getConfig(address: Address, opts?: YevefiAccountFetchOptions): Promise<YevefisConfigData | null>;
    /**
     * Fetch and cache the accounts for a given array of YevefiConfig addresses
     * @param addresses The array of YevefiConfig account addresses
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getConfigs(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, YevefisConfigData | null>>;
    /**
     * Fetch and cache the account for a given PositionBundle address
     * @param address The address of the position bundle account
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getPositionBundle(address: Address, opts?: YevefiAccountFetchOptions): Promise<PositionBundleData | null>;
    /**
     * Fetch and cache the accounts for a given array of PositionBundle addresses
     * @param addresses The array of position bundle account addresses
     * @param opts {@link YevefiAccountFetchOptions} instance to dictate fetch behavior
     */
    getPositionBundles(addresses: Address[], opts?: YevefiAccountFetchOptions): Promise<ReadonlyMap<string, PositionBundleData | null>>;
    /**
     * Populate the fetcher's cache with the given {@link YevefisData} accounts
     * @param accounts The map of addresses to on-chain account data
     * @param parser The {@link ParsableEntity} instance to parse the accounts
     * @param now The current timestamp to use for the cache
     */
    populateCache<T extends YevefiSupportedTypes>(accounts: ReadonlyMap<string, T>, parser: ParsableEntity<T>, now: number): void;
}
