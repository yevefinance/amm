import { BN } from "@coral-xyz/anchor";
import { type PositionData, type TickData, type YevefiData } from "../../types/public";
/**
 * Parameters needed to generate a quote on collectible rewards on a position.
 * @category Quotes
 * @param yevefi - the account data for the yevefi this position belongs to
 * @param position - the account data for the position
 * @param tickLower - the TickData account for the lower bound of this position
 * @param tickUpper - the TickData account for the upper bound of this position
 * @param timeStampInSeconds - optional parameter to generate this quote to a unix time stamp.
 */
export type CollectRewardsQuoteParam = {
    yevefi: YevefiData;
    position: PositionData;
    tickLower: TickData;
    tickUpper: TickData;
    timeStampInSeconds?: BN;
};
/**
 * An array of reward amounts that is collectible on a position.
 * @category Quotes
 */
export type CollectRewardsQuote = [
    BN | undefined,
    BN | undefined,
    BN | undefined
];
/**
 * Get a quote on the outstanding rewards owed to a position.
 *
 * @category Quotes
 * @param param A collection of fetched Yevefi accounts to faciliate the quote.
 * @returns A quote object containing the rewards owed for each reward in the pool.
 */
export declare function collectRewardsQuote(param: CollectRewardsQuoteParam): CollectRewardsQuote;
