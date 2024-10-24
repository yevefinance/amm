import type { Address } from "@coral-xyz/anchor";
import {
	type AccountFetcher,
	type ParsableEntity,
	ParsableMintInfo,
	ParsableTokenAccountInfo,
	SimpleAccountFetcher,
} from "@orca-so/common-sdk";
import {
	AccountLayout,
	type Mint,
	type Account as TokenAccount,
} from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";
import {
	DEFAULT_YEVEFI_RETENTION_POLICY,
	type YevefiAccountFetchOptions,
	type YevefiAccountFetcherInterface,
	type YevefiSupportedTypes,
} from "..";
import type {
	FeeTierData,
	PositionBundleData,
	PositionData,
	TickArrayData,
	YevefiData,
	YevefisConfigData,
} from "../../../types/public";
import {
	ParsableFeeTier,
	ParsablePosition,
	ParsablePositionBundle,
	ParsableTickArray,
	ParsableYevefi,
	ParsableYevefisConfig,
} from "../parsing";

/**
 * Build a default instance of {@link YevefiAccountFetcherInterface} with the default {@link AccountFetcher} implementation
 * @param connection An instance of {@link Connection} to use for fetching accounts
 * @returns An instance of {@link YevefiAccountFetcherInterface}
 * @category Network
 */
export const buildDefaultAccountFetcher = (connection: Connection) => {
	return new YevefiAccountFetcher(
		connection,
		new SimpleAccountFetcher(connection, DEFAULT_YEVEFI_RETENTION_POLICY),
	);
};

/**
 * Fetcher and cache layer for fetching {@link YevefiSupportedTypes} from the network
 * Default implementation for {@link YevefiAccountFetcherInterface}
 * @category Network
 */
export class YevefiAccountFetcher implements YevefiAccountFetcherInterface {
	private _accountRentExempt: number | undefined;

	constructor(
		readonly connection: Connection,
		readonly fetcher: AccountFetcher<
			YevefiSupportedTypes,
			YevefiAccountFetchOptions
		>,
	) {}

	async getAccountRentExempt(refresh = false): Promise<number> {
		// This value should be relatively static or at least not break according to spec
		// https://docs.solana.com/developing/programming-model/accounts#rent-exemption
		if (!this._accountRentExempt || refresh) {
			this._accountRentExempt =
				await this.connection.getMinimumBalanceForRentExemption(
					AccountLayout.span,
				);
		}
		return this._accountRentExempt;
	}

	getPool(
		address: Address,
		opts?: YevefiAccountFetchOptions,
	): Promise<YevefiData | null> {
		return this.fetcher.getAccount(address, ParsableYevefi, opts);
	}
	getPools(
		addresses: Address[],
		opts?: YevefiAccountFetchOptions,
	): Promise<ReadonlyMap<string, YevefiData | null>> {
		return this.fetcher.getAccounts(addresses, ParsableYevefi, opts);
	}
	getPosition(
		address: Address,
		opts?: YevefiAccountFetchOptions,
	): Promise<PositionData | null> {
		return this.fetcher.getAccount(address, ParsablePosition, opts);
	}
	getPositions(
		addresses: Address[],
		opts?: YevefiAccountFetchOptions,
	): Promise<ReadonlyMap<string, PositionData | null>> {
		return this.fetcher.getAccounts(addresses, ParsablePosition, opts);
	}
	getTickArray(
		address: Address,
		opts?: YevefiAccountFetchOptions,
	): Promise<TickArrayData | null> {
		return this.fetcher.getAccount(address, ParsableTickArray, opts);
	}
	getTickArrays(
		addresses: Address[],
		opts?: YevefiAccountFetchOptions,
	): Promise<ReadonlyArray<TickArrayData | null>> {
		return this.fetcher.getAccountsAsArray(addresses, ParsableTickArray, opts);
	}
	getFeeTier(
		address: Address,
		opts?: YevefiAccountFetchOptions,
	): Promise<FeeTierData | null> {
		return this.fetcher.getAccount(address, ParsableFeeTier, opts);
	}
	getFeeTiers(
		addresses: Address[],
		opts?: YevefiAccountFetchOptions,
	): Promise<ReadonlyMap<string, FeeTierData | null>> {
		return this.fetcher.getAccounts(addresses, ParsableFeeTier, opts);
	}
	getTokenInfo(
		address: Address,
		opts?: YevefiAccountFetchOptions,
	): Promise<TokenAccount | null> {
		return this.fetcher.getAccount(address, ParsableTokenAccountInfo, opts);
	}
	getTokenInfos(
		addresses: Address[],
		opts?: YevefiAccountFetchOptions,
	): Promise<ReadonlyMap<string, TokenAccount | null>> {
		return this.fetcher.getAccounts(addresses, ParsableTokenAccountInfo, opts);
	}
	getMintInfo(
		address: Address,
		opts?: YevefiAccountFetchOptions,
	): Promise<Mint | null> {
		return this.fetcher.getAccount(address, ParsableMintInfo, opts);
	}
	getMintInfos(
		addresses: Address[],
		opts?: YevefiAccountFetchOptions,
	): Promise<ReadonlyMap<string, Mint | null>> {
		return this.fetcher.getAccounts(addresses, ParsableMintInfo, opts);
	}
	getConfig(
		address: Address,
		opts?: YevefiAccountFetchOptions,
	): Promise<YevefisConfigData | null> {
		return this.fetcher.getAccount(address, ParsableYevefisConfig, opts);
	}
	getConfigs(
		addresses: Address[],
		opts?: YevefiAccountFetchOptions,
	): Promise<ReadonlyMap<string, YevefisConfigData | null>> {
		return this.fetcher.getAccounts(addresses, ParsableYevefisConfig, opts);
	}
	getPositionBundle(
		address: Address,
		opts?: YevefiAccountFetchOptions,
	): Promise<PositionBundleData | null> {
		return this.fetcher.getAccount(address, ParsablePositionBundle, opts);
	}
	getPositionBundles(
		addresses: Address[],
		opts?: YevefiAccountFetchOptions,
	): Promise<ReadonlyMap<string, PositionBundleData | null>> {
		return this.fetcher.getAccounts(addresses, ParsablePositionBundle, opts);
	}
	populateCache<T extends YevefiSupportedTypes>(
		accounts: ReadonlyMap<string, T>,
		parser: ParsableEntity<T>,
		now = Date.now(),
	): void {
		this.fetcher.populateAccounts(accounts, parser, now);
	}
}
