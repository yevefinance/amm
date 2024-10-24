import type { BN } from "@coral-xyz/anchor";
import { type Percentage } from "@orca-so/common-sdk";
import type { DecreaseLiquidityInput } from "../../instructions";
import type { Position, Yevefi } from "../../yevefi-client";
/**
 * @category Quotes
 * @param liquidity - The desired liquidity to withdraw from the Yevefi
 * @param tickCurrentIndex - The Yevefi's current tickIndex
 * @param sqrtPrice - The Yevefi's current sqrtPrice
 * @param tickLowerIndex - The lower index of the position that we are withdrawing from.
 * @param tickUpperIndex - The upper index of the position that we are withdrawing from.
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 */
export type DecreaseLiquidityQuoteParam = {
    liquidity: BN;
    tickCurrentIndex: number;
    sqrtPrice: BN;
    tickLowerIndex: number;
    tickUpperIndex: number;
    slippageTolerance: Percentage;
};
/**
 * Return object from decrease liquidity quote functions.
 * @category Quotes
 */
export type DecreaseLiquidityQuote = DecreaseLiquidityInput & {
    tokenEstA: BN;
    tokenEstB: BN;
};
/**
 * Get an estimated quote on the minimum tokens receivable based on the desired withdraw liquidity value.
 *
 * @category Quotes
 * @param liquidity - The desired liquidity to withdraw from the Yevefi
 * @param slippageTolerance - The maximum slippage allowed when calculating the minimum tokens received.
 * @param position - A Position helper class to help interact with the Position account.
 * @param yevefi - A Yevefi helper class to help interact with the Yevefi account.
 * @returns An DecreaseLiquidityQuote object detailing the tokenMin & liquidity values to use when calling decrease-liquidity-ix.
 */
export declare function decreaseLiquidityQuoteByLiquidity(liquidity: BN, slippageTolerance: Percentage, position: Position, yevefi: Yevefi): DecreaseLiquidityQuote;
/**
 * Get an estimated quote on the minimum tokens receivable based on the desired withdraw liquidity value.
 *
 * @category Quotes
 * @param param DecreaseLiquidityQuoteParam
 * @returns An DecreaseLiquidityInput object detailing the tokenMin & liquidity values to use when calling decrease-liquidity-ix.
 */
export declare function decreaseLiquidityQuoteByLiquidityWithParams(param: DecreaseLiquidityQuoteParam): DecreaseLiquidityQuote;
