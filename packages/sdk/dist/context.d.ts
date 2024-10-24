import { AnchorProvider, Program } from "@coral-xyz/anchor";
import type { BuildOptions, LookupTableFetcher, TransactionBuilderOptions, Wallet, WrappedSolAccountCreateMethod } from "@orca-so/common-sdk";
import type { Commitment, Connection, PublicKey, SendOptions } from "@solana/web3.js";
import type { Yevefi } from "./artifacts/yevefi";
import { type YevefiAccountFetcherInterface } from "./network/public/";
/**
 * Default settings used when interacting with transactions.
 * @category Core
 */
export type YevefiContextOpts = {
    userDefaultBuildOptions?: Partial<BuildOptions>;
    userDefaultSendOptions?: Partial<SendOptions>;
    userDefaultConfirmCommitment?: Commitment;
    accountResolverOptions?: AccountResolverOptions;
};
/**
 * Default settings used when resolving token accounts.
 * @category Core
 */
export type AccountResolverOptions = {
    createWrappedSolAccountMethod: WrappedSolAccountCreateMethod;
    allowPDAOwnerAddress: boolean;
};
/**
 * Context for storing environment classes and objects for usage throughout the SDK
 * @category Core
 */
export declare class YevefiContext {
    readonly connection: Connection;
    readonly wallet: Wallet;
    readonly program: Program<Yevefi>;
    readonly provider: AnchorProvider;
    readonly fetcher: YevefiAccountFetcherInterface;
    readonly lookupTableFetcher: LookupTableFetcher | undefined;
    readonly opts: YevefiContextOpts;
    readonly txBuilderOpts: TransactionBuilderOptions | undefined;
    readonly accountResolverOpts: AccountResolverOptions;
    static from(connection: Connection, wallet: Wallet, programId: PublicKey, fetcher?: YevefiAccountFetcherInterface, lookupTableFetcher?: LookupTableFetcher, opts?: YevefiContextOpts): YevefiContext;
    static fromWorkspace(provider: AnchorProvider, program: Program, fetcher?: YevefiAccountFetcherInterface, lookupTableFetcher?: LookupTableFetcher, opts?: YevefiContextOpts): YevefiContext;
    static withProvider(provider: AnchorProvider, programId: PublicKey, fetcher?: YevefiAccountFetcherInterface, lookupTableFetcher?: LookupTableFetcher, opts?: YevefiContextOpts): YevefiContext;
    constructor(provider: AnchorProvider, wallet: Wallet, program: Program, fetcher: YevefiAccountFetcherInterface, lookupTableFetcher?: LookupTableFetcher, opts?: YevefiContextOpts);
}
