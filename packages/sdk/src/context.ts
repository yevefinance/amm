import { AnchorProvider, type Idl, Program } from "@coral-xyz/anchor";
import type {
	BuildOptions,
	LookupTableFetcher,
	TransactionBuilderOptions,
	Wallet,
	WrappedSolAccountCreateMethod,
} from "@orca-so/common-sdk";
import type {
	Commitment,
	Connection,
	PublicKey,
	SendOptions,
} from "@solana/web3.js";
import type { Yevefi } from "./artifacts/yevefi";
import YevefiIDL from "./artifacts/yevefi.json";
import {
	type YevefiAccountFetcherInterface,
	buildDefaultAccountFetcher,
} from "./network/public/";
import { contextOptionsToBuilderOptions } from "./utils/txn-utils";

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

const DEFAULT_ACCOUNT_RESOLVER_OPTS: AccountResolverOptions = {
	createWrappedSolAccountMethod: "keypair",
	allowPDAOwnerAddress: false,
};

/**
 * Context for storing environment classes and objects for usage throughout the SDK
 * @category Core
 */
export class YevefiContext {
	readonly connection: Connection;
	readonly wallet: Wallet;
	readonly program: Program<Yevefi>;
	readonly provider: AnchorProvider;
	readonly fetcher: YevefiAccountFetcherInterface;
	readonly lookupTableFetcher: LookupTableFetcher | undefined;
	readonly opts: YevefiContextOpts;
	readonly txBuilderOpts: TransactionBuilderOptions | undefined;
	readonly accountResolverOpts: AccountResolverOptions;

	public static from(
		connection: Connection,
		wallet: Wallet,
		programId: PublicKey,
		fetcher: YevefiAccountFetcherInterface = buildDefaultAccountFetcher(
			connection,
		),
		lookupTableFetcher?: LookupTableFetcher,
		opts: YevefiContextOpts = {},
	): YevefiContext {
		const anchorProvider = new AnchorProvider(connection, wallet, {
			commitment: opts.userDefaultConfirmCommitment || "confirmed",
			preflightCommitment: opts.userDefaultConfirmCommitment || "confirmed",
		});
		const program = new Program(YevefiIDL as Idl, programId, anchorProvider);
		return new YevefiContext(
			anchorProvider,
			anchorProvider.wallet,
			program,
			fetcher,
			lookupTableFetcher,
			opts,
		);
	}

	public static fromWorkspace(
		provider: AnchorProvider,
		program: Program,
		fetcher: YevefiAccountFetcherInterface = buildDefaultAccountFetcher(
			provider.connection,
		),
		lookupTableFetcher?: LookupTableFetcher,
		opts: YevefiContextOpts = {},
	) {
		return new YevefiContext(
			provider,
			provider.wallet,
			program,
			fetcher,
			lookupTableFetcher,
			opts,
		);
	}

	public static withProvider(
		provider: AnchorProvider,
		programId: PublicKey,
		fetcher: YevefiAccountFetcherInterface = buildDefaultAccountFetcher(
			provider.connection,
		),
		lookupTableFetcher?: LookupTableFetcher,
		opts: YevefiContextOpts = {},
	): YevefiContext {
		const program = new Program(YevefiIDL as Idl, programId, provider);
		return new YevefiContext(
			provider,
			provider.wallet,
			program,
			fetcher,
			lookupTableFetcher,
			opts,
		);
	}

	public constructor(
		provider: AnchorProvider,
		wallet: Wallet,
		program: Program,
		fetcher: YevefiAccountFetcherInterface,
		lookupTableFetcher?: LookupTableFetcher,
		opts: YevefiContextOpts = {},
	) {
		this.connection = provider.connection;
		this.wallet = wallet;
		// It's a hack but it works on Anchor workspace *shrug*
		this.program = program as unknown as Program<Yevefi>;
		this.provider = provider;
		this.fetcher = fetcher;
		this.lookupTableFetcher = lookupTableFetcher;
		this.opts = opts;
		this.txBuilderOpts = contextOptionsToBuilderOptions(this.opts);
		this.accountResolverOpts =
			opts.accountResolverOptions ?? DEFAULT_ACCOUNT_RESOLVER_OPTS;
	}

	// TODO: Add another factory method to build from on-chain IDL
}
