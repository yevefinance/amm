import BN from "bn.js";
import { PoolUtil, type TokenInfo } from "..";
import type {
	YevefiAccountFetchOptions,
	YevefiAccountFetcherInterface,
} from "../network/public/fetcher";
import type {
	TokenAccountInfo,
	YevefiData,
	YevefiRewardInfo,
	YevefiRewardInfoData,
} from "../types/public";

export async function getTokenMintInfos(
	fetcher: YevefiAccountFetcherInterface,
	data: YevefiData,
	opts?: YevefiAccountFetchOptions,
): Promise<TokenInfo[]> {
	const mintA = data.tokenMintA;
	const infoA = await fetcher.getMintInfo(mintA, opts);
	if (!infoA) {
		throw new Error(`Unable to fetch MintInfo for mint - ${mintA}`);
	}
	const mintB = data.tokenMintB;
	const infoB = await fetcher.getMintInfo(mintB, opts);
	if (!infoB) {
		throw new Error(`Unable to fetch MintInfo for mint - ${mintB}`);
	}
	return [
		{ mint: mintA, ...infoA },
		{ mint: mintB, ...infoB },
	];
}

export async function getRewardInfos(
	fetcher: YevefiAccountFetcherInterface,
	data: YevefiData,
	opts?: YevefiAccountFetchOptions,
): Promise<YevefiRewardInfo[]> {
	const rewardInfos: YevefiRewardInfo[] = [];
	for (const rewardInfo of data.rewardInfos) {
		rewardInfos.push(await getRewardInfo(fetcher, rewardInfo, opts));
	}
	return rewardInfos;
}

async function getRewardInfo(
	fetcher: YevefiAccountFetcherInterface,
	data: YevefiRewardInfoData,
	opts?: YevefiAccountFetchOptions,
): Promise<YevefiRewardInfo> {
	const rewardInfo = { ...data, initialized: false, vaultAmount: new BN(0) };
	if (PoolUtil.isRewardInitialized(data)) {
		const vaultInfo = await fetcher.getTokenInfo(data.vault, opts);
		if (!vaultInfo) {
			throw new Error(
				`Unable to fetch TokenAccountInfo for vault - ${data.vault}`,
			);
		}
		rewardInfo.initialized = true;
		rewardInfo.vaultAmount = new BN(vaultInfo.amount.toString());
	}
	return rewardInfo;
}

export async function getTokenVaultAccountInfos(
	fetcher: YevefiAccountFetcherInterface,
	data: YevefiData,
	opts?: YevefiAccountFetchOptions,
): Promise<TokenAccountInfo[]> {
	const vaultA = data.tokenVaultA;
	const vaultInfoA = await fetcher.getTokenInfo(vaultA, opts);
	if (!vaultInfoA) {
		throw new Error(`Unable to fetch TokenAccountInfo for vault - ${vaultA}`);
	}
	const vaultB = data.tokenVaultB;
	const vaultInfoB = await fetcher.getTokenInfo(vaultB, opts);
	if (!vaultInfoB) {
		throw new Error(`Unable to fetch TokenAccountInfo for vault - ${vaultB}`);
	}
	return [vaultInfoA, vaultInfoB];
}
