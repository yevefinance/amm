"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllYevefiAccountsForConfig = getAllYevefiAccountsForConfig;
const common_sdk_1 = require("@orca-so/common-sdk");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const public_1 = require("../../../types/public");
const parsing_1 = require("../parsing");
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
async function getAllYevefiAccountsForConfig({ connection, programId, configId, }) {
    const filters = [
        { dataSize: (0, public_1.getAccountSize)(public_1.AccountName.Yevefi) },
        {
            memcmp: public_1.YEVEFI_CODER.memcmp(public_1.AccountName.Yevefi, common_sdk_1.AddressUtil.toPubKey(configId).toBuffer()),
        },
    ];
    const accounts = await connection.getProgramAccounts(common_sdk_1.AddressUtil.toPubKey(programId), {
        filters,
    });
    const parsedAccounts = [];
    accounts.forEach(({ pubkey, account }) => {
        const parsedAccount = parsing_1.ParsableYevefi.parse(pubkey, account);
        (0, tiny_invariant_1.default)(!!parsedAccount, `could not parse yevefi: ${pubkey.toBase58()}`);
        parsedAccounts.push([common_sdk_1.AddressUtil.toString(pubkey), parsedAccount]);
    });
    return new Map(parsedAccounts.map(([address, pool]) => [
        common_sdk_1.AddressUtil.toString(address),
        pool,
    ]));
}
