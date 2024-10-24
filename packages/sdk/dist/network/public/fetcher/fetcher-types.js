"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFER_CACHE = exports.IGNORE_CACHE = exports.DEFAULT_YEVEFI_RETENTION_POLICY = void 0;
/**
 * The default retention periods for each {@link ParsableEntity} type in the {@link YevefiAccountFetcherInterface}
 * @category Network
 */
exports.DEFAULT_YEVEFI_RETENTION_POLICY = new Map([]);
/**
 * Default fetch option for always fetching when making an account request to the {@link YevefiAccountFetcherInterface}
 * @category Network
 */
exports.IGNORE_CACHE = { maxAge: 0 };
/**
 * Default fetch option for always using the cached value for an account request to the {@link YevefiAccountFetcherInterface}
 * @category Network
 */
exports.PREFER_CACHE = {
    maxAge: Number.POSITIVE_INFINITY,
};
