import { type Percentage, type TransactionBuilder } from "@orca-so/common-sdk";
import type { Account } from "@solana/spl-token";
import type { YevefiContext } from "..";
import { type YevefiAccountFetchOptions } from "../network/public/fetcher";
import { type PoolGraph } from "../utils/public";
import { type ExecutableRoute, type RouteSelectOptions, type RoutingOptions, type Trade, type TradeRoute, type YevefiRouter } from "./public";
export declare class YevefiRouterImpl implements YevefiRouter {
    readonly ctx: YevefiContext;
    readonly poolGraph: PoolGraph;
    constructor(ctx: YevefiContext, poolGraph: PoolGraph);
    findAllRoutes(trade: Trade, opts?: Partial<RoutingOptions>, fetchOpts?: YevefiAccountFetchOptions): Promise<TradeRoute[]>;
    findBestRoute(trade: Trade, routingOpts?: Partial<RoutingOptions>, selectionOpts?: Partial<RouteSelectOptions>, fetchOpts?: YevefiAccountFetchOptions): Promise<ExecutableRoute | null>;
    swap(trade: TradeRoute, slippage: Percentage, resolvedAtas: Account[] | null): Promise<TransactionBuilder>;
}
