"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YEVEFI_ACCOUNT_SIZE = exports.YEVEFI_CODER = exports.YEVEFI_IDL = exports.AccountName = void 0;
exports.getAccountSize = getAccountSize;
const anchor_1 = require("@coral-xyz/anchor");
const yevefi_json_1 = __importDefault(require("../../artifacts/yevefi.json"));
/**
 * This file contains the types that has the same structure as the types anchor functions returns.
 * These types are hard-casted by the client function.
 *
 * This file must be manually updated every time the idl updates as accounts will
 * be hard-casted to fit the type.
 */
/**
 * Supported parasable account names from the Yevefi contract.
 * @category Network
 */
var AccountName;
(function (AccountName) {
    AccountName["YevefisConfig"] = "YevefisConfig";
    AccountName["Position"] = "Position";
    AccountName["TickArray"] = "TickArray";
    AccountName["Yevefi"] = "Yevefi";
    AccountName["FeeTier"] = "FeeTier";
    AccountName["PositionBundle"] = "PositionBundle";
})(AccountName || (exports.AccountName = AccountName = {}));
exports.YEVEFI_IDL = yevefi_json_1.default;
/**
 * The Anchor coder for the Yevefi program.
 * @category Solana Accounts
 */
exports.YEVEFI_CODER = new anchor_1.BorshAccountsCoder(exports.YEVEFI_IDL);
/**
 * Get the size of an account owned by the Yevefi program in bytes.
 * @param accountName Yevefi account name
 * @returns Size in bytes of the account
 */
function getAccountSize(accountName) {
    const size = exports.YEVEFI_CODER.size(exports.YEVEFI_IDL.accounts?.find((account) => account.name === accountName));
    return size + RESERVED_BYTES[accountName];
}
/**
 * Reserved bytes for each account used for calculating the account size.
 */
const RESERVED_BYTES = {
    [AccountName.YevefisConfig]: 2,
    [AccountName.Position]: 0,
    [AccountName.TickArray]: 0,
    [AccountName.Yevefi]: 0,
    [AccountName.FeeTier]: 0,
    [AccountName.PositionBundle]: 64,
};
/**
 * Size of the Yevefi account in bytes.
 * @deprecated Please use {@link getAccountSize} instead.
 * @category Solana Accounts
 */
exports.YEVEFI_ACCOUNT_SIZE = getAccountSize(AccountName.Yevefi);
