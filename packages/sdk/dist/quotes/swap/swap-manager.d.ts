import BN from "bn.js";
import { type YevefiData } from "../../types/public";
import type { TickArraySequence } from "./tick-array-sequence";
export type SwapResult = {
    amountA: BN;
    amountB: BN;
    nextTickIndex: number;
    nextSqrtPrice: BN;
    totalFeeAmount: BN;
};
export declare function computeSwap(yevefiData: YevefiData, tickSequence: TickArraySequence, tokenAmount: BN, sqrtPriceLimit: BN, amountSpecifiedIsInput: boolean, aToB: boolean): SwapResult;
