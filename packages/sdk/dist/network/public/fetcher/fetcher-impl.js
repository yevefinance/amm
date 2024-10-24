"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YevefiAccountFetcher = exports.buildDefaultAccountFetcher = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const spl_token_1 = require("@solana/spl-token");
const __1 = require("..");
const parsing_1 = require("../parsing");
/**
 * Build a default instance of {@link YevefiAccountFetcherInterface} with the default {@link AccountFetcher} implementation
 * @param connection An instance of {@link Connection} to use for fetching accounts
 * @returns An instance of {@link YevefiAccountFetcherInterface}
 * @category Network
 */
const buildDefaultAccountFetcher = (connection) => {
    return new YevefiAccountFetcher(connection, new common_sdk_1.SimpleAccountFetcher(connection, __1.DEFAULT_YEVEFI_RETENTION_POLICY));
};
exports.buildDefaultAccountFetcher = buildDefaultAccountFetcher;
/**
 * Fetcher and cache layer for fetching {@link YevefiSupportedTypes} from the network
 * Default implementation for {@link YevefiAccountFetcherInterface}
 * @category Network
 */
class YevefiAccountFetcher {
    constructor(connection, fetcher) {
        this.connection = connection;
        this.fetcher = fetcher;
    }
    async getAccountRentExempt(refresh = false) {
        // This value should be relatively static or at least not break according to spec
        // https://docs.solana.com/developing/programming-model/accounts#rent-exemption
        if (!this._accountRentExempt || refresh) {
            this._accountRentExempt =
                await this.connection.getMinimumBalanceForRentExemption(spl_token_1.AccountLayout.span);
        }
        return this._accountRentExempt;
    }
    getPool(address, opts) {
        return this.fetcher.getAccount(address, parsing_1.ParsableYevefi, opts);
    }
    getPools(addresses, opts) {
        return this.fetcher.getAccounts(addresses, parsing_1.ParsableYevefi, opts);
    }
    getPosition(address, opts) {
        return this.fetcher.getAccount(address, parsing_1.ParsablePosition, opts);
    }
    getPositions(addresses, opts) {
        return this.fetcher.getAccounts(addresses, parsing_1.ParsablePosition, opts);
    }
    getTickArray(address, opts) {
        return this.fetcher.getAccount(address, parsing_1.ParsableTickArray, opts);
    }
    getTickArrays(addresses, opts) {
        return this.fetcher.getAccountsAsArray(addresses, parsing_1.ParsableTickArray, opts);
    }
    getFeeTier(address, opts) {
        return this.fetcher.getAccount(address, parsing_1.ParsableFeeTier, opts);
    }
    getFeeTiers(addresses, opts) {
        return this.fetcher.getAccounts(addresses, parsing_1.ParsableFeeTier, opts);
    }
    getTokenInfo(address, opts) {
        return this.fetcher.getAccount(address, common_sdk_1.ParsableTokenAccountInfo, opts);
    }
    getTokenInfos(addresses, opts) {
        return this.fetcher.getAccounts(addresses, common_sdk_1.ParsableTokenAccountInfo, opts);
    }
    getMintInfo(address, opts) {
        return this.fetcher.getAccount(address, common_sdk_1.ParsableMintInfo, opts);
    }
    getMintInfos(addresses, opts) {
        return this.fetcher.getAccounts(addresses, common_sdk_1.ParsableMintInfo, opts);
    }
    getConfig(address, opts) {
        return this.fetcher.getAccount(address, parsing_1.ParsableYevefisConfig, opts);
    }
    getConfigs(addresses, opts) {
        return this.fetcher.getAccounts(addresses, parsing_1.ParsableYevefisConfig, opts);
    }
    getPositionBundle(address, opts) {
        return this.fetcher.getAccount(address, parsing_1.ParsablePositionBundle, opts);
    }
    getPositionBundles(addresses, opts) {
        return this.fetcher.getAccounts(addresses, parsing_1.ParsablePositionBundle, opts);
    }
    populateCache(accounts, parser, now = Date.now()) {
        this.fetcher.populateAccounts(accounts, parser, now);
    }
}
exports.YevefiAccountFetcher = YevefiAccountFetcher;
