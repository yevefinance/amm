import type { Program } from "@coral-xyz/anchor";
import type { Instruction } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";
import type { Yevefi } from "../artifacts/yevefi";
/**
 * Parameters to execute a two-hop swap on a Yevefi.
 *
 * @category Instruction Types
 * @param yevefiOne - PublicKey for the yevefi that the swap-one will occur on
 * @param yevefiTwo - PublicKey for the yevefi that the swap-two will occur on
 * @param tokenOwnerAccountOneA - PublicKey for the associated token account for tokenA in yevefiOne in the collection wallet
 * @param tokenOwnerAccountOneB - PublicKey for the associated token account for tokenB in yevefiOne in the collection wallet
 * @param tokenOwnerAccountTwoA - PublicKey for the associated token account for tokenA in yevefiTwo in the collection wallet
 * @param tokenOwnerAccountTwoB - PublicKey for the associated token account for tokenB in yevefiTwo in the collection wallet
 * @param tokenVaultOneA - PublicKey for the tokenA vault for yevefiOne.
 * @param tokenVaultOneB - PublicKey for the tokenB vault for yevefiOne.
 * @param tokenVaultTwoA - PublicKey for the tokenA vault for yevefiTwo.
 * @param tokenVaultTwoB - PublicKey for the tokenB vault for yevefiTwo.
 * @param oracleOne - PublicKey for the oracle account for this yevefiOne.
 * @param oracleTwo - PublicKey for the oracle account for this yevefiTwo.
 * @param tokenAuthority - authority to withdraw tokens from the input token account
 * @param swapInput - Parameters in {@link TwoHopSwapInput}
 */
export type TwoHopSwapParams = TwoHopSwapInput & {
    yevefiOne: PublicKey;
    yevefiTwo: PublicKey;
    tokenOwnerAccountOneA: PublicKey;
    tokenOwnerAccountOneB: PublicKey;
    tokenOwnerAccountTwoA: PublicKey;
    tokenOwnerAccountTwoB: PublicKey;
    tokenVaultOneA: PublicKey;
    tokenVaultOneB: PublicKey;
    tokenVaultTwoA: PublicKey;
    tokenVaultTwoB: PublicKey;
    oracleOne: PublicKey;
    oracleTwo: PublicKey;
    tokenAuthority: PublicKey;
};
/**
 * Parameters that define a two-hop swap on a Yevefi.
 *
 * @category Instruction Types
 * @param amount - The amount of input or output token to swap from (depending on amountSpecifiedIsInput).
 * @param otherAmountThreshold - The maximum/minimum of input/output token to swap into (depending on amountSpecifiedIsInput).
 * @param amountSpecifiedIsInput - Specifies the token the paramneter `amount`represets. If true, the amount represents
 *                                 the input token of the swap.
 * @param aToBOne - The direction of the swap-one. True if swapping from A to B. False if swapping from B to A.
 * @param aToBTwo - The direction of the swap-two. True if swapping from A to B. False if swapping from B to A.
 * @param sqrtPriceLimitOne - The maximum/minimum price that swap-one will swap to.
 * @param sqrtPriceLimitTwo - The maximum/minimum price that swap-two will swap to.
 * @param tickArrayOne0 - PublicKey of the tick-array of swap-One where the Yevefi's currentTickIndex resides in
 * @param tickArrayOne1 - The next tick-array in the swap direction of swap-One. If the swap will not reach the next tick-aray, input the same array as tickArray0.
 * @param tickArrayOne2 - The next tick-array in the swap direction after tickArray2 of swap-One. If the swap will not reach the next tick-aray, input the same array as tickArray1.
 * @param tickArrayTwo0 - PublicKey of the tick-array of swap-Two where the Yevefi's currentTickIndex resides in
 * @param tickArrayTwo1 - The next tick-array in the swap direction of swap-Two. If the swap will not reach the next tick-aray, input the same array as tickArray0.
 * @param tickArrayTwo2 - The next tick-array in the swap direction after tickArray2 of swap-Two. If the swap will not reach the next tick-aray, input the same array as tickArray1.
 */
export type TwoHopSwapInput = {
    amount: BN;
    otherAmountThreshold: BN;
    amountSpecifiedIsInput: boolean;
    aToBOne: boolean;
    aToBTwo: boolean;
    sqrtPriceLimitOne: BN;
    sqrtPriceLimitTwo: BN;
    tickArrayOne0: PublicKey;
    tickArrayOne1: PublicKey;
    tickArrayOne2: PublicKey;
    tickArrayTwo0: PublicKey;
    tickArrayTwo1: PublicKey;
    tickArrayTwo2: PublicKey;
};
/**
 * Perform a two-hop swap in this Yevefi
 *
 * #### Special Errors
 * - `ZeroTradableAmount` - User provided parameter `amount` is 0.
 * - `InvalidSqrtPriceLimitDirection` - User provided parameter `sqrt_price_limit` does not match the direction of the trade.
 * - `SqrtPriceOutOfBounds` - User provided parameter `sqrt_price_limit` is over Whirlppool's max/min bounds for sqrt-price.
 * - `InvalidTickArraySequence` - User provided tick-arrays are not in sequential order required to proceed in this trade direction.
 * - `TickArraySequenceInvalidIndex` - The swap loop attempted to access an invalid array index during the query of the next initialized tick.
 * - `TickArrayIndexOutofBounds` - The swap loop attempted to access an invalid array index during tick crossing.
 * - `LiquidityOverflow` - Liquidity value overflowed 128bits during tick crossing.
 * - `InvalidTickSpacing` - The swap pool was initialized with tick-spacing of 0.
 * - `InvalidIntermediaryMint` - Error if the intermediary mint between hop one and two do not equal.
 * - `DuplicateTwoHopPool` - Error if yevefi one & two are the same pool.
 *
 * ### Parameters
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - {@link TwoHopSwapParams} object
 * @returns - Instruction to perform the action.
 */
export declare function twoHopSwapIx(program: Program<Yevefi>, params: TwoHopSwapParams): Instruction;
