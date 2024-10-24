import { type Address } from "@coral-xyz/anchor";
import { type Percentage, TransactionBuilder } from "@orca-so/common-sdk";
import { type PublicKey } from "@solana/web3.js";
import type { YevefiContext } from "../context";
import { type DevFeeSwapInput, type IncreaseLiquidityInput, type SwapInput } from "../instructions";
import type { TokenAccountInfo, TokenInfo, YevefiData, YevefiRewardInfo } from "../types/public";
import type { Yevefi } from "../yevefi-client";
export declare class YevefiImpl implements Yevefi {
    readonly ctx: YevefiContext;
    readonly address: PublicKey;
    readonly tokenAInfo: TokenInfo;
    readonly tokenBInfo: TokenInfo;
    private tokenVaultAInfo;
    private tokenVaultBInfo;
    private rewardInfos;
    private data;
    constructor(ctx: YevefiContext, address: PublicKey, tokenAInfo: TokenInfo, tokenBInfo: TokenInfo, tokenVaultAInfo: TokenAccountInfo, tokenVaultBInfo: TokenAccountInfo, rewardInfos: YevefiRewardInfo[], data: YevefiData);
    getAddress(): PublicKey;
    getData(): YevefiData;
    getTokenAInfo(): TokenInfo;
    getTokenBInfo(): TokenInfo;
    getTokenVaultAInfo(): TokenAccountInfo;
    getTokenVaultBInfo(): TokenAccountInfo;
    getRewardInfos(): YevefiRewardInfo[];
    refreshData(): Promise<YevefiData>;
    openPosition(tickLower: number, tickUpper: number, liquidityInput: IncreaseLiquidityInput, wallet?: Address, funder?: Address, positionMint?: PublicKey): Promise<{
        positionMint: PublicKey;
        tx: TransactionBuilder;
    }>;
    openPositionWithMetadata(tickLower: number, tickUpper: number, liquidityInput: IncreaseLiquidityInput, sourceWallet?: Address, funder?: Address, positionMint?: PublicKey): Promise<{
        positionMint: PublicKey;
        tx: TransactionBuilder;
    }>;
    initTickArrayForTicks(ticks: number[], funder?: Address, opts?: import("@orca-so/common-sdk").SimpleAccountFetchOptions): Promise<TransactionBuilder | null>;
    closePosition(positionAddress: Address, slippageTolerance: Percentage, destinationWallet?: Address, positionWallet?: Address, payer?: Address): Promise<TransactionBuilder[]>;
    swap(quote: SwapInput, sourceWallet?: Address): Promise<TransactionBuilder>;
    swapWithDevFees(quote: DevFeeSwapInput, devFeeWallet: PublicKey, wallet?: PublicKey | undefined, payer?: PublicKey | undefined): Promise<TransactionBuilder>;
    /**
     * Construct a transaction for opening an new position with optional metadata
     */
    getOpenPositionWithOptMetadataTx(tickLower: number, tickUpper: number, liquidityInput: IncreaseLiquidityInput, wallet: PublicKey, funder: PublicKey, withMetadata?: boolean, positionMint?: PublicKey): Promise<{
        positionMint: PublicKey;
        tx: TransactionBuilder;
    }>;
    getClosePositionIx(positionAddress: PublicKey, slippageTolerance: Percentage, destinationWallet: PublicKey, positionWallet: PublicKey, payerKey: PublicKey): Promise<TransactionBuilder[]>;
    private refresh;
}
