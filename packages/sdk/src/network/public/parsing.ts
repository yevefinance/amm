import { BorshAccountsCoder, type Idl } from "@coral-xyz/anchor";
import { type ParsableEntity, staticImplements } from "@orca-so/common-sdk";
import type { AccountInfo, PublicKey } from "@solana/web3.js";
import * as YevefiIDL from "../../artifacts/yevefi.json";
import {
	AccountName,
	type FeeTierData,
	type PositionBundleData,
	type PositionData,
	type TickArrayData,
	type YevefiData,
	type YevefisConfigData,
} from "../../types/public";

/**
 * @category Network
 */
@staticImplements<ParsableEntity<YevefisConfigData>>()
export class ParsableYevefisConfig {
	private constructor() {}

	public static parse(
		address: PublicKey,
		accountData: AccountInfo<Buffer> | undefined | null,
	): YevefisConfigData | null {
		if (!accountData?.data) {
			return null;
		}

		try {
			return parseAnchorAccount(AccountName.YevefisConfig, accountData);
		} catch (e) {
			console.error(`error while parsing YevefisConfig: ${e}`);
			return null;
		}
	}
}

/**
 * @category Network
 */
@staticImplements<ParsableEntity<YevefiData>>()
export class ParsableYevefi {
	private constructor() {}

	public static parse(
		address: PublicKey,
		accountData: AccountInfo<Buffer> | undefined | null,
	): YevefiData | null {
		if (!accountData?.data) {
			return null;
		}

		try {
			return parseAnchorAccount(AccountName.Yevefi, accountData);
		} catch (e) {
			console.error(`error while parsing Yevefi: ${e}`);
			return null;
		}
	}
}

/**
 * @category Network
 */
@staticImplements<ParsableEntity<PositionData>>()
export class ParsablePosition {
	private constructor() {}

	public static parse(
		address: PublicKey,
		accountData: AccountInfo<Buffer> | undefined | null,
	): PositionData | null {
		if (!accountData?.data) {
			return null;
		}

		try {
			return parseAnchorAccount(AccountName.Position, accountData);
		} catch (e) {
			console.error(`error while parsing Position: ${e}`);
			return null;
		}
	}
}

/**
 * @category Network
 */
@staticImplements<ParsableEntity<TickArrayData>>()
export class ParsableTickArray {
	private constructor() {}

	public static parse(
		address: PublicKey,
		accountData: AccountInfo<Buffer> | undefined | null,
	): TickArrayData | null {
		if (!accountData?.data) {
			return null;
		}

		try {
			return parseAnchorAccount(AccountName.TickArray, accountData);
		} catch (e) {
			console.error(`error while parsing TickArray: ${e}`);
			return null;
		}
	}
}

/**
 * @category Network
 */
@staticImplements<ParsableEntity<FeeTierData>>()
export class ParsableFeeTier {
	private constructor() {}

	public static parse(
		address: PublicKey,
		accountData: AccountInfo<Buffer> | undefined | null,
	): FeeTierData | null {
		if (!accountData?.data) {
			return null;
		}

		try {
			return parseAnchorAccount(AccountName.FeeTier, accountData);
		} catch (e) {
			console.error(`error while parsing FeeTier: ${e}`);
			return null;
		}
	}
}

/**
 * @category Network
 */
@staticImplements<ParsableEntity<PositionBundleData>>()
export class ParsablePositionBundle {
	private constructor() {}

	public static parse(
		address: PublicKey,
		accountData: AccountInfo<Buffer> | undefined | null,
	): PositionBundleData | null {
		if (!accountData?.data) {
			return null;
		}

		try {
			return parseAnchorAccount(AccountName.PositionBundle, accountData);
		} catch (e) {
			console.error(`error while parsing PositionBundle: ${e}`);
			return null;
		}
	}
}

const YevefiCoder = new BorshAccountsCoder(YevefiIDL as Idl);

function parseAnchorAccount(
	accountName: AccountName,
	accountData: AccountInfo<Buffer>,
) {
	const data = accountData.data;
	const discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
	if (discriminator.compare(data.slice(0, 8))) {
		console.error("incorrect account name during parsing");
		return null;
	}

	try {
		return YevefiCoder.decode(accountName, data);
	} catch (_e) {
		console.error("unknown account name during parsing");
		return null;
	}
}
