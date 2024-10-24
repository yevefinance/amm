import { type TokenInfo } from "..";
import type { YevefiAccountFetchOptions, YevefiAccountFetcherInterface } from "../network/public/fetcher";
import type { TokenAccountInfo, YevefiData, YevefiRewardInfo } from "../types/public";
export declare function getTokenMintInfos(fetcher: YevefiAccountFetcherInterface, data: YevefiData, opts?: YevefiAccountFetchOptions): Promise<TokenInfo[]>;
export declare function getRewardInfos(fetcher: YevefiAccountFetcherInterface, data: YevefiData, opts?: YevefiAccountFetchOptions): Promise<YevefiRewardInfo[]>;
export declare function getTokenVaultAccountInfos(fetcher: YevefiAccountFetcherInterface, data: YevefiData, opts?: YevefiAccountFetchOptions): Promise<TokenAccountInfo[]>;
