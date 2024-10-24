"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YevefiContext = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const yevefi_json_1 = __importDefault(require("./artifacts/yevefi.json"));
const public_1 = require("./network/public/");
const txn_utils_1 = require("./utils/txn-utils");
const DEFAULT_ACCOUNT_RESOLVER_OPTS = {
    createWrappedSolAccountMethod: "keypair",
    allowPDAOwnerAddress: false,
};
/**
 * Context for storing environment classes and objects for usage throughout the SDK
 * @category Core
 */
class YevefiContext {
    static from(connection, wallet, programId, fetcher = (0, public_1.buildDefaultAccountFetcher)(connection), lookupTableFetcher, opts = {}) {
        const anchorProvider = new anchor_1.AnchorProvider(connection, wallet, {
            commitment: opts.userDefaultConfirmCommitment || "confirmed",
            preflightCommitment: opts.userDefaultConfirmCommitment || "confirmed",
        });
        const program = new anchor_1.Program(yevefi_json_1.default, programId, anchorProvider);
        return new YevefiContext(anchorProvider, anchorProvider.wallet, program, fetcher, lookupTableFetcher, opts);
    }
    static fromWorkspace(provider, program, fetcher = (0, public_1.buildDefaultAccountFetcher)(provider.connection), lookupTableFetcher, opts = {}) {
        return new YevefiContext(provider, provider.wallet, program, fetcher, lookupTableFetcher, opts);
    }
    static withProvider(provider, programId, fetcher = (0, public_1.buildDefaultAccountFetcher)(provider.connection), lookupTableFetcher, opts = {}) {
        const program = new anchor_1.Program(yevefi_json_1.default, programId, provider);
        return new YevefiContext(provider, provider.wallet, program, fetcher, lookupTableFetcher, opts);
    }
    constructor(provider, wallet, program, fetcher, lookupTableFetcher, opts = {}) {
        this.connection = provider.connection;
        this.wallet = wallet;
        // It's a hack but it works on Anchor workspace *shrug*
        this.program = program;
        this.provider = provider;
        this.fetcher = fetcher;
        this.lookupTableFetcher = lookupTableFetcher;
        this.opts = opts;
        this.txBuilderOpts = (0, txn_utils_1.contextOptionsToBuilderOptions)(this.opts);
        this.accountResolverOpts =
            opts.accountResolverOptions ?? DEFAULT_ACCOUNT_RESOLVER_OPTS;
    }
}
exports.YevefiContext = YevefiContext;
