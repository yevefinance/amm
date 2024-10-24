import type { Program } from "@coral-xyz/anchor";
import type { PDA } from "@orca-so/common-sdk";
import type { Yevefi } from "./artifacts/yevefi";
import * as ix from "./instructions";
/**
 * Instruction builders for the Yevefis program.
 *
 * @category Core
 */
export declare class YevefiIx {
    /**
     * Initializes a YevefisConfig account that hosts info & authorities
     * required to govern a set of Yevefis.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - InitConfigParams object
     * @returns - Instruction to perform the action.
     */
    static initializeConfigIx(program: Program<Yevefi>, params: ix.InitConfigParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Initializes a fee tier account usable by Yevefis in this YevefisConfig space.
     *
     *  Special Errors
     * `FeeRateMaxExceeded` - If the provided default_fee_rate exceeds MAX_FEE_RATE.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - InitFeeTierParams object
     * @returns - Instruction to perform the action.
     */
    static initializeFeeTierIx(program: Program<Yevefi>, params: ix.InitFeeTierParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Initializes a tick_array account to represent a tick-range in a Yevefi.
     *
     * Special Errors
     * `InvalidTokenMintOrder` - The order of mints have to be ordered by
     * `SqrtPriceOutOfBounds` - provided initial_sqrt_price is not between 2^-64 to 2^64
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - InitPoolParams object
     * @returns - Instruction to perform the action.
     */
    static initializePoolIx(program: Program<Yevefi>, params: ix.InitPoolParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Initialize reward for a Yevefi. A pool can only support up to a set number of rewards.
     * The initial emissionsPerSecond is set to 0.
     *
     * #### Special Errors
     * - `InvalidRewardIndex` - If the provided reward index doesn't match the lowest uninitialized index in this pool,
     *                          or exceeds NUM_REWARDS, or all reward slots for this pool has been initialized.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - InitializeRewardParams object
     * @returns - Instruction to perform the action.
     */
    static initializeRewardIx(program: Program<Yevefi>, params: ix.InitializeRewardParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Initializes a TickArray account.
     *
     * #### Special Errors
     *  `InvalidStartTick` - if the provided start tick is out of bounds or is not a multiple of TICK_ARRAY_SIZE * tick spacing.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - InitTickArrayParams object
     * @returns - Instruction to perform the action.
     */
    static initTickArrayIx(program: Program<Yevefi>, params: ix.InitTickArrayParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Open a position in a Yevefi. A unique token will be minted to represent the position in the users wallet.
     * The position will start off with 0 liquidity.
     *
     * #### Special Errors
     * `InvalidTickIndex` - If a provided tick is out of bounds, out of order or not a multiple of the tick-spacing in this pool.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - OpenPositionParams object
     * @returns - Instruction to perform the action.
     */
    static openPositionIx(program: Program<Yevefi>, params: ix.OpenPositionParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Open a position in a Yevefi. A unique token will be minted to represent the position
     * in the users wallet. Additional Metaplex metadata is appended to identify the token.
     * The position will start off with 0 liquidity.
     *
     * #### Special Errors
     * `InvalidTickIndex` - If a provided tick is out of bounds, out of order or not a multiple of the tick-spacing in this pool.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - OpenPositionParams object and a derived PDA that hosts the position's metadata.
     * @returns - Instruction to perform the action.
     */
    static openPositionWithMetadataIx(program: Program<Yevefi>, params: ix.OpenPositionParams & {
        metadataPda: PDA;
    }): import("@orca-so/common-sdk").Instruction;
    /**
     * Add liquidity to a position in the Yevefi. This call also updates the position's accrued fees and rewards.
     *
     * #### Special Errors
     * `LiquidityZero` - Provided liquidity amount is zero.
     * `LiquidityTooHigh` - Provided liquidity exceeds u128::max.
     * `TokenMaxExceeded` - The required token to perform this operation exceeds the user defined amount.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - IncreaseLiquidityParams object
     * @returns - Instruction to perform the action.
     */
    static increaseLiquidityIx(program: Program<Yevefi>, params: ix.IncreaseLiquidityParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Remove liquidity to a position in the Yevefi. This call also updates the position's accrued fees and rewards.
     *
     * #### Special Errors
     * - `LiquidityZero` - Provided liquidity amount is zero.
     * - `LiquidityTooHigh` - Provided liquidity exceeds u128::max.
     * - `TokenMinSubceeded` - The required token to perform this operation subceeds the user defined amount.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - DecreaseLiquidityParams object
     * @returns - Instruction to perform the action.
     */
    static decreaseLiquidityIx(program: Program<Yevefi>, params: ix.DecreaseLiquidityParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Close a position in a Yevefi. Burns the position token in the owner's wallet.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - ClosePositionParams object
     * @returns - Instruction to perform the action.
     */
    static closePositionIx(program: Program<Yevefi>, params: ix.ClosePositionParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Perform a swap in this Yevefi
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
     *
     * ### Parameters
     * @param program - program object containing services required to generate the instruction
     * @param params - {@link SwapParams}
     * @returns - Instruction to perform the action.
     */
    static swapIx(program: Program<Yevefi>, params: ix.SwapParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Perform a two-hop-swap in this Yevefi
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
     * - `DuplicateTwoHopPool` - Swaps on the same pool are not allowed.
     * - `InvalidIntermediaryMint` - The first and second leg of the hops do not share a common token.
     *
     * ### Parameters
     * @param program - program object containing services required to generate the instruction
     * @param params - TwoHopSwapParams object
     * @returns - Instruction to perform the action.
     */
    static twoHopSwapIx(program: Program<Yevefi>, params: ix.TwoHopSwapParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Update the accrued fees and rewards for a position.
     *
     * #### Special Errors
     * `TickNotFound` - Provided tick array account does not contain the tick for this position.
     * `LiquidityZero` - Position has zero liquidity and therefore already has the most updated fees and reward values.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - UpdateFeesAndRewardsParams object
     * @returns - Instruction to perform the action.
     */
    static updateFeesAndRewardsIx(program: Program<Yevefi>, params: ix.UpdateFeesAndRewardsParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Collect fees accrued for this position.
     * Call updateFeesAndRewards before this to update the position to the newest accrued values.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - CollectFeesParams object
     * @returns - Instruction to perform the action.
     */
    static collectFeesIx(program: Program<Yevefi>, params: ix.CollectFeesParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Collect protocol fees accrued in this Yevefi.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - CollectProtocolFeesParams object
     * @returns - Instruction to perform the action.
     */
    static collectProtocolFeesIx(program: Program<Yevefi>, params: ix.CollectProtocolFeesParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Collect rewards accrued for this reward index in a position.
     * Call updateFeesAndRewards before this to update the position to the newest accrued values.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - CollectRewardParams object
     * @returns - Instruction to perform the action.
     */
    static collectRewardIx(program: Program<Yevefi>, params: ix.CollectRewardParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Sets the fee authority to collect protocol fees for a YevefisConfig.
     * Only the current collect protocol fee authority has permission to invoke this instruction.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetCollectProtocolFeesAuthorityParams object
     * @returns - Instruction to perform the action.
     */
    static setCollectProtocolFeesAuthorityIx(program: Program<Yevefi>, params: ix.SetCollectProtocolFeesAuthorityParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Updates a fee tier account with a new default fee rate. The new rate will not retroactively update
     * initialized pools.
     *
     * #### Special Errors
     * - `FeeRateMaxExceeded` - If the provided default_fee_rate exceeds MAX_FEE_RATE.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetDefaultFeeRateParams object
     * @returns - Instruction to perform the action.
     */
    static setDefaultFeeRateIx(program: Program<Yevefi>, params: ix.SetDefaultFeeRateParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Updates a YevefisConfig with a new default protocol fee rate. The new rate will not retroactively update
     * initialized pools.
     *
     * #### Special Errors
     * - `ProtocolFeeRateMaxExceeded` - If the provided default_protocol_fee_rate exceeds MAX_PROTOCOL_FEE_RATE.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetDefaultFeeRateParams object
     * @returns - Instruction to perform the action.
     */
    static setDefaultProtocolFeeRateIx(program: Program<Yevefi>, params: ix.SetDefaultProtocolFeeRateParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Sets the fee authority for a YevefisConfig.
     * The fee authority can set the fee & protocol fee rate for individual pools or set the default fee rate for newly minted pools.
     * Only the current fee authority has permission to invoke this instruction.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetFeeAuthorityParams object
     * @returns - Instruction to perform the action.
     */
    static setFeeAuthorityIx(program: Program<Yevefi>, params: ix.SetFeeAuthorityParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Sets the fee rate for a Yevefi.
     * Only the current fee authority has permission to invoke this instruction.
     *
     * #### Special Errors
     * - `FeeRateMaxExceeded` - If the provided fee_rate exceeds MAX_FEE_RATE.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetFeeRateParams object
     * @returns - Instruction to perform the action.
     */
    static setFeeRateIx(program: Program<Yevefi>, params: ix.SetFeeRateParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Sets the protocol fee rate for a Yevefi.
     * Only the current fee authority has permission to invoke this instruction.
     *
     * #### Special Errors
     * - `ProtocolFeeRateMaxExceeded` - If the provided default_protocol_fee_rate exceeds MAX_PROTOCOL_FEE_RATE.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetFeeRateParams object
     * @returns - Instruction to perform the action.
     */
    static setProtocolFeeRateIx(program: Program<Yevefi>, params: ix.SetProtocolFeeRateParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Set the yevefi reward authority at the provided `reward_index`.
     * Only the current reward super authority has permission to invoke this instruction.
     *
     * #### Special Errors
     * - `InvalidRewardIndex` - If the provided reward index doesn't match the lowest uninitialized index in this pool,
     *                          or exceeds NUM_REWARDS.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetRewardAuthorityParams object
     * @returns - Instruction to perform the action.
     */
    static setRewardAuthorityBySuperAuthorityIx(program: Program<Yevefi>, params: ix.SetRewardAuthorityBySuperAuthorityParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Set the yevefi reward authority at the provided `reward_index`.
     * Only the current reward authority for this reward index has permission to invoke this instruction.
     *
     * #### Special Errors
     * - `InvalidRewardIndex` - If the provided reward index doesn't match the lowest uninitialized index in this pool,
     *                          or exceeds NUM_REWARDS.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetRewardAuthorityParams object
     * @returns - Instruction to perform the action.
     */
    static setRewardAuthorityIx(program: Program<Yevefi>, params: ix.SetRewardAuthorityParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Set the reward emissions for a reward in a Yevefi.
     *
     * #### Special Errors
     * - `RewardVaultAmountInsufficient` - The amount of rewards in the reward vault cannot emit more than a day of desired emissions.
     * - `InvalidTimestamp` - Provided timestamp is not in order with the previous timestamp.
     * - `InvalidRewardIndex` - If the provided reward index doesn't match the lowest uninitialized index in this pool,
     *                          or exceeds NUM_REWARDS.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetRewardEmissionsParams object
     * @returns - Instruction to perform the action.
     */
    static setRewardEmissionsIx(program: Program<Yevefi>, params: ix.SetRewardEmissionsParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Set the yevefi reward super authority for a YevefisConfig
     * Only the current reward super authority has permission to invoke this instruction.
     * This instruction will not change the authority on any `YevefiRewardInfo` yevefi rewards.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - SetRewardEmissionsSuperAuthorityParams object
     * @returns - Instruction to perform the action.
     */
    static setRewardEmissionsSuperAuthorityIx(program: Program<Yevefi>, params: ix.SetRewardEmissionsSuperAuthorityParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Initializes a PositionBundle account.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - InitializePositionBundleParams object
     * @returns - Instruction to perform the action.
     */
    static initializePositionBundleIx(program: Program<Yevefi>, params: ix.InitializePositionBundleParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Initializes a PositionBundle account.
     * Additional Metaplex metadata is appended to identify the token.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - InitializePositionBundleParams object
     * @returns - Instruction to perform the action.
     */
    static initializePositionBundleWithMetadataIx(program: Program<Yevefi>, params: ix.InitializePositionBundleParams & {
        positionBundleMetadataPda: PDA;
    }): import("@orca-so/common-sdk").Instruction;
    /**
     * Deletes a PositionBundle account.
     *
     * #### Special Errors
     * `PositionBundleNotDeletable` - The provided position bundle has open positions.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - DeletePositionBundleParams object
     * @returns - Instruction to perform the action.
     */
    static deletePositionBundleIx(program: Program<Yevefi>, params: ix.DeletePositionBundleParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Open a bundled position in a Yevefi.
     * No new tokens are issued because the owner of the position bundle becomes the owner of the position.
     * The position will start off with 0 liquidity.
     *
     * #### Special Errors
     * `InvalidBundleIndex` - If the provided bundle index is out of bounds.
     * `InvalidTickIndex` - If a provided tick is out of bounds, out of order or not a multiple of the tick-spacing in this pool.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - OpenBundledPositionParams object
     * @returns - Instruction to perform the action.
     */
    static openBundledPositionIx(program: Program<Yevefi>, params: ix.OpenBundledPositionParams): import("@orca-so/common-sdk").Instruction;
    /**
     * Close a bundled position in a Yevefi.
     *
     * #### Special Errors
     * `InvalidBundleIndex` - If the provided bundle index is out of bounds.
     * `ClosePositionNotEmpty` - The provided position account is not empty.
     *
     * @param program - program object containing services required to generate the instruction
     * @param params - CloseBundledPositionParams object
     * @returns - Instruction to perform the action.
     */
    static closeBundledPositionIx(program: Program<Yevefi>, params: ix.CloseBundledPositionParams): import("@orca-so/common-sdk").Instruction;
}
