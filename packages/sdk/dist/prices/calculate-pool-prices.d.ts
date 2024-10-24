import type { Address } from "@coral-xyz/anchor";
import type { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";
import Decimal from "decimal.js";
import { type DecimalsMap, type GetPricesConfig, type GetPricesThresholdConfig, type PoolMap, type PriceMap, type TickArrayMap } from ".";
export declare function calculatePricesForQuoteToken(mints: Address[], quoteTokenMint: PublicKey, poolMap: PoolMap, tickArrayMap: TickArrayMap, decimalsMap: DecimalsMap, config: GetPricesConfig, thresholdConfig: GetPricesThresholdConfig): PriceMap;
export declare function isSubset(listA: string[], listB: string[]): boolean;
export declare function convertAmount(amount: BN, price: Decimal, amountDecimal: number, resultDecimal: number): BN;
