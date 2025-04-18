import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import type Decimal from "decimal.js";
import { type TickArrayData, type YevefiData } from "../types/public";
export * from "./price-module";
/**
 * A config object for the {@link PriceModule} functions.
 *
 * @category PriceModule
 * @param quoteTokens The group of quote tokens that you want to search Yevefis for.
 *                    The first token must be the token that is being priced against the other tokens.
 *                    The subsequent tokens are alternative tokens that can be used to price the first token.
 * @param tickSpacings The group of tick spacings that you want to search Yevefis for.
 * @param programId The public key of the Yevefi Program account that you want to search Yevefis for.
 * @param yevefisConfig The public key of the {@link YevefisConfig} account that you want to search Yevefis for.
 */
export type GetPricesConfig = {
    quoteTokens: PublicKey[];
    tickSpacings: number[];
    programId: PublicKey;
    yevefisConfig: PublicKey;
};
/**
 * A config object for the {@link PriceModule} functions to define thresholds for price calculations.
 * Yevefis that do not fit the criteria set by the parameters below will be excluded in the price calculation.
 *
 * @category PriceModule
 * @param amountOut The token amount in terms of the first quote token amount to evaluate a Yevefi's liquidity against.
 * @param priceImpactThreshold Using amountOut to perform a swap quote on a pool, this value is the maximum price impact
 *                             that a Yevefi can have to be included in the price calculation.
 */
export type GetPricesThresholdConfig = {
    amountOut: BN;
    priceImpactThreshold: number;
};
/**
 * A set of fetched accounts that are used for price calculations in {@link PriceModule} functions.
 *
 * @category PriceModule
 * @param poolMap A map of {@link YevefiData} accounts that are used for price calculations.
 * @param tickArrayMap A map of {@link TickArrayData} accounts that are used for price calculations.
 * @param decimalsMap A map of token decimals that are used for price calculations.
 */
export type PriceCalculationData = {
    poolMap: PoolMap;
    tickArrayMap: TickArrayMap;
    decimalsMap: DecimalsMap;
};
/**
 * A map of yevefi addresses against {@link YevefiData} accounts
 * @category PriceModule
 */
export type PoolMap = Record<string, YevefiData>;
/**
 * A map of tick-array addresses against {@link TickArrayData} accounts
 * @category PriceModule
 */
export type TickArrayMap = Record<string, TickArrayData>;
/**
 * A map of token mint addresses against price values. If a price is not available, the value will be null.
 * @category PriceModule
 */
export type PriceMap = Record<string, Decimal | null>;
/**
 * A map of token mint addresses against token decimals.
 * @category PriceModule
 */
export type DecimalsMap = Record<string, number>;
/**
 * The default quote tokens used for Orca's mainnet deployment.
 * Supply your own if you are using a different deployment.
 * @category PriceModule
 */
export declare const defaultQuoteTokens: PublicKey[];
/**
 * The default {@link GetPricesConfig} config for Orca's mainnet deployment.
 * @category PriceModule
 */
export declare const defaultGetPricesConfig: GetPricesConfig;
/**
 * The default {@link GetPricesThresholdConfig} config for Orca's mainnet deployment.
 * @category PriceModule
 */
export declare const defaultGetPricesThresholdConfig: GetPricesThresholdConfig;
