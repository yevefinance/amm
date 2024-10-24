import { type Address, AddressUtil } from "@orca-so/common-sdk";
import type { Connection } from "@solana/web3.js";
import invariant from "tiny-invariant";
import {
	AccountName,
	YEVEFI_CODER,
	type YevefiData,
	getAccountSize,
} from "../../../types/public";
import { ParsableYevefi } from "../parsing";

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
export async function getAllYevefiAccountsForConfig({
	connection,
	programId,
	configId,
}: {
	connection: Connection;
	programId: Address;
	configId: Address;
}): Promise<ReadonlyMap<string, YevefiData>> {
	const filters = [
		{ dataSize: getAccountSize(AccountName.Yevefi) },
		{
			memcmp: YEVEFI_CODER.memcmp(
				AccountName.Yevefi,
				AddressUtil.toPubKey(configId).toBuffer(),
			),
		},
	];

	const accounts = await connection.getProgramAccounts(
		AddressUtil.toPubKey(programId),
		{
			filters,
		},
	);

	const parsedAccounts: [string, YevefiData][] = [];
	accounts.forEach(({ pubkey, account }) => {
		const parsedAccount = ParsableYevefi.parse(pubkey, account);
		invariant(!!parsedAccount, `could not parse yevefi: ${pubkey.toBase58()}`);
		parsedAccounts.push([AddressUtil.toString(pubkey), parsedAccount]);
	});

	return new Map(
		parsedAccounts.map(([address, pool]) => [
			AddressUtil.toString(address),
			pool,
		]),
	);
}
