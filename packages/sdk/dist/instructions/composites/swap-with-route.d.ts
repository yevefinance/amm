import { type Percentage, TransactionBuilder } from "@orca-so/common-sdk";
import { PublicKey } from "@solana/web3.js";
import { type AtaAccountInfo, type TradeRoute, type YevefiContext } from "../..";
import { type YevefiAccountFetchOptions } from "../../network/public/fetcher";
export type SwapFromRouteParams = {
    route: TradeRoute;
    slippage: Percentage;
    wallet: PublicKey;
    resolvedAtaAccounts: AtaAccountInfo[] | null;
};
export declare function getSwapFromRoute(ctx: YevefiContext, params: SwapFromRouteParams, opts?: YevefiAccountFetchOptions, txBuilder?: TransactionBuilder): Promise<TransactionBuilder>;
