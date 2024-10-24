import type { Address } from "@coral-xyz/anchor";
import { TransactionBuilder } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import type { YevefiContext } from "../context";
import { type YevefiAccountFetchOptions, type YevefiAccountFetcherInterface } from "../network/public/fetcher";
import { type YevefiRouter } from "../router/public";
import type { Position, Yevefi, YevefiClient } from "../yevefi-client";
export declare class YevefiClientImpl implements YevefiClient {
    readonly ctx: YevefiContext;
    constructor(ctx: YevefiContext);
    getContext(): YevefiContext;
    getFetcher(): YevefiAccountFetcherInterface;
    getRouter(poolAddresses: Address[]): Promise<YevefiRouter>;
    getPool(poolAddress: Address, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<Yevefi>;
    getPools(poolAddresses: Address[], opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<Yevefi[]>;
    getPosition(positionAddress: Address, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<Position>;
    getPositions(positionAddresses: Address[], opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<Record<string, Position | null>>;
    createPool(yevefisConfig: Address, tokenMintA: Address, tokenMintB: Address, tickSpacing: number, initialTick: number, funder: Address, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<{
        poolKey: PublicKey;
        tx: TransactionBuilder;
    }>;
    collectFeesAndRewardsForPositions(positionAddresses: Address[], opts?: YevefiAccountFetchOptions): Promise<TransactionBuilder[]>;
    collectProtocolFeesForPools(poolAddresses: Address[]): Promise<TransactionBuilder>;
}
