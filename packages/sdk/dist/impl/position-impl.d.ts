import type { Address } from "@coral-xyz/anchor";
import { TransactionBuilder } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { YevefiContext } from "../context";
import { type DecreaseLiquidityInput, type IncreaseLiquidityInput } from "../instructions";
import { type YevefiAccountFetchOptions } from "../network/public/fetcher";
import type { PositionData, TickArrayData, TickData, YevefiData } from "../types/public";
import type { Position } from "../yevefi-client";
export declare class PositionImpl implements Position {
    readonly ctx: YevefiContext;
    readonly address: PublicKey;
    private data;
    private yevefiData;
    private lowerTickArrayData;
    private upperTickArrayData;
    constructor(ctx: YevefiContext, address: PublicKey, data: PositionData, yevefiData: YevefiData, lowerTickArrayData: TickArrayData, upperTickArrayData: TickArrayData);
    getAddress(): PublicKey;
    getData(): PositionData;
    getYevefiData(): YevefiData;
    getLowerTickData(): TickData;
    getUpperTickData(): TickData;
    refreshData(): Promise<PositionData>;
    increaseLiquidity(liquidityInput: IncreaseLiquidityInput, resolveATA?: boolean, sourceWallet?: Address, positionWallet?: Address, ataPayer?: Address): Promise<TransactionBuilder>;
    decreaseLiquidity(liquidityInput: DecreaseLiquidityInput, resolveATA?: boolean, sourceWallet?: Address, positionWallet?: Address, ataPayer?: Address): Promise<TransactionBuilder>;
    collectFees(updateFeesAndRewards?: boolean, ownerTokenAccountMap?: Partial<Record<string, Address>>, destinationWallet?: Address, positionWallet?: Address, ataPayer?: Address, opts?: YevefiAccountFetchOptions): Promise<TransactionBuilder>;
    collectRewards(rewardsToCollect?: Address[], updateFeesAndRewards?: boolean, ownerTokenAccountMap?: Partial<Record<string, Address>>, destinationWallet?: Address, positionWallet?: Address, ataPayer?: Address, opts?: YevefiAccountFetchOptions): Promise<TransactionBuilder>;
    private refresh;
    private updateFeesAndRewards;
}
