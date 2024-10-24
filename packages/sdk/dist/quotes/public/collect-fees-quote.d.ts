import type { BN } from "@coral-xyz/anchor";
import type { PositionData, TickData, YevefiData } from "../../types/public";
/**
 * @category Quotes
 */
export type CollectFeesQuoteParam = {
    yevefi: YevefiData;
    position: PositionData;
    tickLower: TickData;
    tickUpper: TickData;
};
/**
 * @category Quotes
 */
export type CollectFeesQuote = {
    feeOwedA: BN;
    feeOwedB: BN;
};
/**
 * Get a quote on the outstanding fees owed to a position.
 *
 * @category Quotes
 * @param param A collection of fetched Yevefi accounts to faciliate the quote.
 * @returns A quote object containing the fees owed for each token in the pool.
 */
export declare function collectFeesQuote(param: CollectFeesQuoteParam): CollectFeesQuote;
