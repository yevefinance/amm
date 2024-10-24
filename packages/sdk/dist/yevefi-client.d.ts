import type { Address } from "@coral-xyz/anchor";
import type { Percentage, TransactionBuilder } from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import type { YevefiContext } from "./context";
import type { DevFeeSwapInput, SwapInput } from "./instructions";
import type { YevefiAccountFetchOptions, YevefiAccountFetcherInterface } from "./network/public/fetcher";
import type { YevefiRouter } from "./router/public";
import type { DecreaseLiquidityInput, IncreaseLiquidityInput, PositionData, TickData, YevefiData } from "./types/public";
import type { TokenAccountInfo, TokenInfo, YevefiRewardInfo } from "./types/public/client-types";
/**
 * Helper class to help interact with Yevefi Accounts with a simpler interface.
 *
 * @category YevefiClient
 */
export interface YevefiClient {
    /**
     * Get this client's YevefiContext object
     * @return a YevefiContext object
     */
    getContext: () => YevefiContext;
    /**
     * Get an YevefiAccountCacheInterface to fetch and cache Yevefi accounts
     * @return an YevefiAccountCacheInterface instance
     */
    getFetcher: () => YevefiAccountFetcherInterface;
    /**
     * Get a YevefiRouter to help generate the best prices when transacting across a set of pools.
     * @param poolAddresses the addresses of the Yevefi account addresses to route through
     * @returns a {@link YevefiRouter} instance
     */
    getRouter: (poolAddresses: Address[]) => Promise<YevefiRouter>;
    /**
     * Get a Yevefi object to interact with the Yevefi account at the given address.
     * @param poolAddress the address of the Yevefi account
     * @param opts an options object to define fetch and cache options when accessing on-chain accounts
     * @return a Yevefi object to interact with
     */
    getPool: (poolAddress: Address, opts?: YevefiAccountFetchOptions) => Promise<Yevefi>;
    /**
     * Get a list of Yevefi objects matching the provided list of addresses.
     * @param poolAddresses the addresses of the Yevefi accounts
     * @param opts an options object to define fetch and cache options when accessing on-chain accounts
     * @return a list of Yevefi objects to interact with
     */
    getPools: (poolAddresses: Address[], opts?: YevefiAccountFetchOptions) => Promise<Yevefi[]>;
    /**
     * Get a Position object to interact with the Position account at the given address.
     * @param positionAddress the address of the Position account
     * @param opts an options object to define fetch and cache options when accessing on-chain accounts
     * @return a Position object to interact with.
     * @throws error when address does not return a Position account.
     */
    getPosition: (positionAddress: Address, opts?: YevefiAccountFetchOptions) => Promise<Position>;
    /**
     * Get a list of Position objects to interact with the Position account at the given addresses.
     * @param positionAddress the addresses of the Position accounts
     * @param opts an options object to define fetch and cache options when accessing on-chain accounts
     * @return a Record object between account address and Position. If an address is not a Position account, it will be null.
     */
    getPositions: (positionAddresses: Address[], opts?: YevefiAccountFetchOptions) => Promise<Record<string, Position | null>>;
    /**
     * Collect all fees and rewards from a list of positions.
     * @experimental
     * @param positionAddress the addresses of the Position accounts to collect fee & rewards from.
     * @param opts an options object to define fetch and cache options when accessing on-chain accounts
     * @returns A set of transaction-builders to resolve ATA for affliated tokens, collect fee & rewards for all positions.
     */
    collectFeesAndRewardsForPositions: (positionAddresses: Address[], opts?: YevefiAccountFetchOptions) => Promise<TransactionBuilder[]>;
    /**
     * Create a Yevefi account for a group of token A, token B and tick spacing
     * @param yevefiConfig the address of the yevefi config
     * @param tokenMintA the address of the token A
     * @param tokenMintB the address of the token B
     * @param tickSpacing the space between two ticks in the tick array
     * @param initialTick the initial tick that the pool is set to (derived from initial price)
     * @param funder the account to debit SOL from to fund the creation of the account(s)
     * @return `poolKey`: The public key of the newly created yevefi account. `tx`: The transaction containing instructions for the on-chain operations.
     * @throws error when the tokens are not in the canonical byte-based ordering. To resolve this, invert the token order and the initialTick (see `TickUtil.invertTick()`, `PriceMath.invertSqrtPriceX64()`, or `PriceMath.invertPrice()`).
     */
    createPool: (yevefisConfig: Address, tokenMintA: Address, tokenMintB: Address, tickSpacing: number, initialTick: number, funder: Address) => Promise<{
        poolKey: PublicKey;
        tx: TransactionBuilder;
    }>;
    /**
     * Collect protocol fees from a list of pools
     * @param poolAddresses the addresses of the Yevefi accounts to collect protocol fees from
     * @returns A transaction builder to resolve ATA for tokenA and tokenB if needed, and collect protocol fees for all pools
     */
    collectProtocolFeesForPools: (poolAddresses: Address[]) => Promise<TransactionBuilder>;
}
/**
 * Construct a YevefiClient instance to help interact with Yevefis accounts with.
 *
 * @category YevefiClient
 * @param ctx - YevefiContext object
 * @returns a YevefiClient instance to help with interacting with Yevefis accounts.
 */
export declare function buildYevefiClient(ctx: YevefiContext): YevefiClient;
/**
 * Helper class to interact with a Yevefi account and build complex transactions.
 * @category YevefiClient
 */
export interface Yevefi {
    /**
     * Return the address for this Yevefi instance.
     * @return the PublicKey for this Yevefi instance.
     */
    getAddress: () => PublicKey;
    /**
     * Return the most recently fetched Yevefi account data.
     * @return most recently fetched YevefiData for this address.
     */
    getData: () => YevefiData;
    /**
     * Fetch and return the most recently fetched Yevefi account data.
     * @return the most up to date YevefiData for this address.
     */
    refreshData: () => Promise<YevefiData>;
    /**
     * Get the TokenInfo for token A of this pool.
     * @return TokenInfo for token A
     */
    getTokenAInfo: () => TokenInfo;
    /**
     * Get the TokenInfo for token B of this pool.
     * @return TokenInfo for token B
     */
    getTokenBInfo: () => TokenInfo;
    /**
     * Get the TokenAccountInfo for token vault A of this pool.
     * @return TokenAccountInfo for token vault A
     */
    getTokenVaultAInfo: () => TokenAccountInfo;
    /**
     * Get the TokenAccountInfo for token vault B of this pool.
     * @return TokenAccountInfo for token vault B
     */
    getTokenVaultBInfo: () => TokenAccountInfo;
    /**
     * Get the YevefiRewardInfos for this pool.
     * @return Array of 3 YevefiRewardInfos. However, not all of them may be initialized. Use the initialized field on YevefiRewardInfo to check if the reward is active.
     */
    getRewardInfos: () => YevefiRewardInfo[];
    /**
     * Initialize a set of tick-arrays that encompasses the provided ticks.
     *
     * If `funder` is provided, the funder wallet has to sign this transaction.
     *
     * @param ticks - A group of ticks that define the desired tick-arrays to initialize. If the tick's array has been initialized, it will be ignored.
     * @param funder - the wallet that will fund the cost needed to initialize the position. If null, the YevefiContext wallet is used.
     * @param opts an {@link YevefiAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
     * @return a transaction that will initialize the defined tick-arrays if executed. Return null if all of the tick's arrays are initialized.
     */
    initTickArrayForTicks: (ticks: number[], funder?: Address, opts?: YevefiAccountFetchOptions) => Promise<TransactionBuilder | null>;
    /**
     * Open and fund a position on this Yevefi.
     *
     * User has to ensure the TickArray for tickLower and tickUpper has been initialized prior to calling this function.
     *
     * If `wallet` or `funder` is provided, those wallets have to sign this transaction.
     *
     * @param tickLower - the tick index for the lower bound of this position
     * @param tickUpper - the tick index for the upper bound of this position
     * @param liquidityInput - an InputLiquidityInput type to define the desired liquidity amount to deposit
     * @param wallet - the wallet to withdraw tokens to deposit into the position and house the position token. If null, the YevefiContext wallet is used.
     * @param funder - the wallet that will fund the cost needed to initialize the position. If null, the YevefiContext wallet is used.
     * @param positionMint - the mint address of the position token to be created. If null, a new mint address will be created.
     * @return `positionMint` - the position to be created. `tx` - The transaction containing the instructions to perform the operation on chain.
     */
    openPosition: (tickLower: number, tickUpper: number, liquidityInput: IncreaseLiquidityInput, wallet?: Address, funder?: Address, positionMint?: PublicKey) => Promise<{
        positionMint: PublicKey;
        tx: TransactionBuilder;
    }>;
    /**
     * Open and fund a position with meta-data on this Yevefi.
     *
     * User has to ensure the TickArray for tickLower and tickUpper has been initialized prior to calling this function.
     *
     * If `wallet` or `funder` is provided, the wallet owners have to sign this transaction.
     *
     * @param tickLower - the tick index for the lower bound of this position
     * @param tickUpper - the tick index for the upper bound of this position
     * @param liquidityInput - input that defines the desired liquidity amount and maximum tokens willing to be to deposited.
     * @param wallet - the wallet to withdraw tokens to deposit into the position and house the position token. If null, the YevefiContext wallet is used.
     * @param funder - the wallet that will fund the cost needed to initialize the position. If null, the YevefiContext wallet is used.
     * @param positionMint - the mint address of the position token to be created. If null, a new mint address will be created.
     * @return `positionMint` - the position to be created. `tx` - The transaction containing the instructions to perform the operation on chain.
     */
    openPositionWithMetadata: (tickLower: number, tickUpper: number, liquidityInput: IncreaseLiquidityInput, wallet?: Address, funder?: Address, positionMint?: PublicKey) => Promise<{
        positionMint: PublicKey;
        tx: TransactionBuilder;
    }>;
    /**
     * Withdraw all tokens from a position, close the account and burn the position token.
     *
     * Users have to collect all fees and rewards from this position prior to closing the account.
     *
     * If `positionWallet`, `payer` is provided, the wallet owner has to sign this transaction.
     *
     * @param positionAddress - The address of the position account.
     * @param slippageTolerance - The amount of slippage the caller is willing to accept when withdrawing liquidity.
     * @param destinationWallet - The wallet that the tokens withdrawn and rent lamports will be sent to. If null, the YevefiContext wallet is used.
     * @param positionWallet - The wallet that houses the position token that corresponds to this position address. If null, the YevefiContext wallet is used.
     * @param payer - the wallet that will fund the cost needed to initialize the token ATA accounts. If null, the YevefiContext wallet is used.
     */
    closePosition: (positionAddress: Address, slippageTolerance: Percentage, destinationWallet?: Address, positionWallet?: Address, payer?: Address) => Promise<TransactionBuilder[]>;
    /**
     * Perform a swap between tokenA and tokenB on this pool.
     *
     * @param input - A quote on the desired tokenIn and tokenOut for this swap. Use {@link swapQuoteWithParams} or other swap quote functions to generate this object.
     * @param wallet - The wallet that tokens will be withdrawn and deposit into. If null, the YevefiContext wallet is used.
     * @return a transaction that will perform the swap once executed.
     */
    swap: (input: SwapInput, wallet?: PublicKey) => Promise<TransactionBuilder>;
    /**
     * Collect a developer fee and perform a swap between tokenA and tokenB on this pool.
     *
     * @param input - A quote on the desired tokenIn and tokenOut for this swap. Use {@link swapQuoteByInputTokenWithDevFees} to generate this object.
     * @param devFeeWallet - The wallet that developer fees will be deposited into.
     * @param wallet - The wallet that swap tokens will be withdrawn and deposit into. If null, the YevefiContext wallet is used.
     * @param payer - The wallet that will fund the cost needed to initialize the dev wallet token ATA accounts. If null, the YevefiContext wallet is used.
     * @return a transaction that will perform the swap once executed.
     */
    swapWithDevFees: (input: DevFeeSwapInput, devFeeWallet: PublicKey, wallet?: PublicKey, payer?: PublicKey) => Promise<TransactionBuilder>;
}
/**
 * Helper class to interact with a Position account and build complex transactions.
 * @category YevefiClient
 */
export interface Position {
    /**
     * Return the address for this Yevefi instance.
     * @return the PublicKey for this Yevefi instance.
     */
    getAddress: () => PublicKey;
    /**
     * Return the most recently fetched Position account data.
     * @return most recently fetched PositionData for this address.
     */
    getData: () => PositionData;
    /**
     * Return the most recently fetched Yevefi account data for this position.
     * @return most recently fetched YevefiData for this position.
     */
    getYevefiData: () => YevefiData;
    /**
     * Return the most recently fetched TickData account data for this position's lower tick.
     * @return most recently fetched TickData for this position's lower tick.
     */
    getLowerTickData: () => TickData;
    /**
     * Return the most recently fetched TickData account data for this position's upper tick.
     * @return most recently fetched TickData for this position's upper tick.
     */
    getUpperTickData: () => TickData;
    /**
     * Fetch and return the most recently fetched Position account data.
     * @return the most up to date PositionData for this address.
     */
    refreshData: () => Promise<PositionData>;
    /**
     * Deposit additional tokens into this postiion.
     * The wallet must contain the position token and the necessary token A & B to complete the deposit.
     * If  `positionWallet` and `wallet` is provided, the wallet owners have to sign this transaction.
     *
     * @param liquidityInput - input that defines the desired liquidity amount and maximum tokens willing to be to deposited.
     * @param resolveATA - if true, add instructions to create associated token accounts for tokenA,B for the destinationWallet if necessary. (RPC call required)
     * @param wallet - to withdraw tokens to deposit into the position. If null, the YevefiContext wallet is used.
     * @param positionWallet - the wallet to that houses the position token. If null, the YevefiContext wallet is used.
     * @param ataPayer - wallet that will fund the creation of the new associated token accounts
     * @return the transaction that will deposit the tokens into the position when executed.
     */
    increaseLiquidity: (liquidityInput: IncreaseLiquidityInput, resolveATA?: boolean, wallet?: Address, positionWallet?: Address, ataPayer?: Address) => Promise<TransactionBuilder>;
    /**
     * Withdraw liquidity from this position.
     *
     * If `positionWallet` is provided, the wallet owners have to sign this transaction.
     *
     * @param liquidityInput - input that defines the desired liquidity amount and minimum tokens willing to be to withdrawn from the position.
     * @param resolveATA -  if true, add instructions to create associated token accounts for tokenA,B for the destinationWallet if necessary. (RPC call required)
     * @param destinationWallet - the wallet to deposit tokens into when withdrawing from the position. If null, the YevefiContext wallet is used.
     * @param positionWallet - the wallet to that houses the position token. If null, the YevefiContext wallet is used.
     * @param ataPayer - wallet that will fund the creation of the new associated token accounts
     * @return the transaction that will deposit the tokens into the position when executed.
     */
    decreaseLiquidity: (liquidityInput: DecreaseLiquidityInput, resolveATA?: boolean, destinationWallet?: Address, positionWallet?: Address, ataPayer?: Address) => Promise<TransactionBuilder>;
    /**
     * Collect fees from this position
     *
     * If `positionWallet` is provided, the wallet owners have to sign this transaction.
     *
     * @param updateFeesAndRewards -  if true, add instructions to refresh the accumulated fees and rewards data (default to true unless you know that the collect fees quote and on-chain data match for the "feeOwedA" and "feeOwedB" fields in the Position account)
     * @param ownerTokenAccountMap - A record that maps a given mint to the owner's token account for that mint (if an entry doesn't exist, it will be automatically resolved)
     * @param destinationWallet - the wallet to deposit tokens into when withdrawing from the position. If null, the YevefiContext wallet is used.
     * @param positionWallet - the wallet to that houses the position token. If null, the YevefiContext wallet is used.
     * @param ataPayer - wallet that will fund the creation of the new associated token accounts
     * @param opts an options object to define fetch and cache options when accessing on-chain accounts
     * @return the transaction that will collect fees from the position
     */
    collectFees: (updateFeesAndRewards?: boolean, ownerTokenAccountMap?: Partial<Record<string, Address>>, destinationWallet?: Address, positionWallet?: Address, ataPayer?: Address, opts?: YevefiAccountFetchOptions) => Promise<TransactionBuilder>;
    /**
     * Collect rewards from this position
     *
     * If `positionWallet` is provided, the wallet owners have to sign this transaction.
     *
     * @param rewardsToCollect - reward mints to collect (omitting this parameter means all rewards will be collected)
     * @param updateFeesAndRewards -  if true, add instructions to refresh the accumulated fees and rewards data (default to true unless you know that the collect fees quote and on-chain data match for the "feeOwedA" and "feeOwedB" fields in the Position account)
     * @param ownerTokenAccountMap - A record that maps a given mint to the owner's token account for that mint (if an entry doesn't exist, it will be automatically resolved)
     * @param destinationWallet - the wallet to deposit tokens into when withdrawing from the position. If null, the YevefiContext wallet is used.
     * @param positionWallet - the wallet to that houses the position token. If null, the YevefiContext wallet is used.
     * @param ataPayer - wallet that will fund the creation of the new associated token accounts
     * @param opts an options object to define fetch and cache options when accessing on-chain accounts
     * @return the transaction that will collect fees from the position
     */
    collectRewards: (rewardsToCollect?: Address[], updateFeesAndRewards?: boolean, ownerTokenAccountMap?: Partial<Record<string, Address>>, destinationWallet?: Address, positionWallet?: Address, ataPayer?: Address, opts?: YevefiAccountFetchOptions) => Promise<TransactionBuilder>;
}
