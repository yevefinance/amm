import { TransactionBuilder } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import { type Yevefi, type YevefiContext } from "../..";
import type { YevefiAccountFetchOptions } from "../../network/public/fetcher";
import { type SwapInput } from "../swap-ix";
export type SwapAsyncParams = {
    swapInput: SwapInput;
    yevefi: Yevefi;
    wallet: PublicKey;
};
/**
 * Swap instruction builder method with resolveATA & additional checks.
 * @param ctx - YevefiContext object for the current environment.
 * @param params - {@link SwapAsyncParams}
 * @param opts - {@link YevefiAccountFetchOptions} to use for account fetching.
 * @returns
 */
export declare function swapAsync(ctx: YevefiContext, params: SwapAsyncParams, opts: YevefiAccountFetchOptions): Promise<TransactionBuilder>;
