import type { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import type { SwapErrorCode } from "../errors/errors";
import { type YevefiAccountFetcherInterface } from "../network/public/fetcher";
import { type Path } from "../utils/public";
import type { RoutingOptions, Trade, TradeHop } from "./public";
export type SanitizedQuoteMap = Record<number, PathQuote[]>;
export type PathQuote = {
    path: Path;
    edgesPoolAddrs: string[];
    splitPercent: number;
    amountIn: BN;
    amountOut: BN;
    calculatedEdgeQuotes: TradeHopQuoteSuccess[];
};
export declare function getQuoteMap(trade: Trade, paths: Path[], amountSpecifiedIsInput: boolean, programId: PublicKey, fetcher: YevefiAccountFetcherInterface, opts: RoutingOptions): Promise<readonly [SanitizedQuoteMap, Set<SwapErrorCode>]>;
type TradeHopQuoteSuccess = TradeHop & {
    success: true;
};
export {};
