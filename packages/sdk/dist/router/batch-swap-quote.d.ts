import type { Address } from "@coral-xyz/anchor";
import type BN from "bn.js";
import type { YevefiAccountFetchOptions, YevefiAccountFetcherInterface } from "../network/public/fetcher";
import type { SwapQuoteParam } from "../quotes/public";
export interface SwapQuoteRequest {
    yevefi: Address;
    tradeTokenMint: Address;
    tokenAmount: BN;
    amountSpecifiedIsInput: boolean;
}
export declare function batchBuildSwapQuoteParams(quoteRequests: SwapQuoteRequest[], programId: Address, fetcher: YevefiAccountFetcherInterface, opts?: YevefiAccountFetchOptions): Promise<SwapQuoteParam[]>;
