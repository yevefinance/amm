import type { Address } from "@coral-xyz/anchor";
import {
	AddressUtil,
	type Percentage,
	U64_MAX,
	ZERO,
} from "@orca-so/common-sdk";
import type { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import type { YevefiContext } from "../..";
import type {
	YevefiAccountFetchOptions,
	YevefiAccountFetcherInterface,
} from "../../network/public/fetcher";
import {
	MAX_SQRT_PRICE,
	MAX_SWAP_TICK_ARRAYS,
	MIN_SQRT_PRICE,
	type SwapInput,
	type SwapParams,
	type TickArray,
	type YevefiData,
} from "../../types/public";
import type { Yevefi } from "../../yevefi-client";
import { adjustForSlippage } from "../math/token-math";
import { PDAUtil } from "./pda-utils";
import { PoolUtil } from "./pool-utils";
import { TickUtil } from "./tick-utils";
import { SwapDirection, TokenType } from "./types";

/**
 * A request to fetch the tick-arrays that a swap may traverse across.
 * @category Yevefi Utils
 */
export interface TickArrayRequest {
	yevefiAddress: PublicKey;
	aToB: boolean;
	tickCurrentIndex: number;
	tickSpacing: number;
}

/**
 * @category Yevefi Utils
 */
export class SwapUtils {
	/**
	 * Get the default values for the sqrtPriceLimit parameter in a swap.
	 * @param aToB - The direction of a swap
	 * @returns The default values for the sqrtPriceLimit parameter in a swap.
	 */
	public static getDefaultSqrtPriceLimit(aToB: boolean) {
		return new BN(aToB ? MIN_SQRT_PRICE : MAX_SQRT_PRICE);
	}

	/**
	 * Get the default values for the otherAmountThreshold parameter in a swap.
	 * @param amountSpecifiedIsInput - The direction of a swap
	 * @returns The default values for the otherAmountThreshold parameter in a swap.
	 */
	public static getDefaultOtherAmountThreshold(
		amountSpecifiedIsInput: boolean,
	) {
		return amountSpecifiedIsInput ? ZERO : U64_MAX;
	}

	/**
	 * Given the intended token mint to swap, return the swap direction of a swap for a Yevefi
	 * @param pool The Yevefi to evaluate the mint against
	 * @param swapTokenMint The token mint PublicKey the user bases their swap against
	 * @param swapTokenIsInput Whether the swap token is the input token. (similar to amountSpecifiedIsInput from swap Ix)
	 * @returns The direction of the swap given the swapTokenMint. undefined if the token mint is not part of the trade pair of the pool.
	 */
	public static getSwapDirection(
		pool: YevefiData,
		swapTokenMint: PublicKey,
		swapTokenIsInput: boolean,
	): SwapDirection | undefined {
		const tokenType = PoolUtil.getTokenType(pool, swapTokenMint);
		if (!tokenType) {
			return undefined;
		}

		return (tokenType === TokenType.TokenA) === swapTokenIsInput
			? SwapDirection.AtoB
			: SwapDirection.BtoA;
	}

	/**
	 * Given the current tick-index, returns the dervied PDA and fetched data
	 * for the tick-arrays that this swap may traverse across.
	 *
	 * @category Yevefi Utils
	 * @param tickCurrentIndex - The current tickIndex for the Yevefi to swap on.
	 * @param tickSpacing - The tickSpacing for the Yevefi.
	 * @param aToB - The direction of the trade.
	 * @param programId - The Yevefi programId which the Yevefi lives on.
	 * @param yevefiAddress - PublicKey of the yevefi to swap on.
	 * @returns An array of PublicKey[] for the tickArray accounts that this swap may traverse across.
	 */
	public static getTickArrayPublicKeys(
		tickCurrentIndex: number,
		tickSpacing: number,
		aToB: boolean,
		programId: PublicKey,
		yevefiAddress: PublicKey,
	) {
		const shift = aToB ? 0 : tickSpacing;

		let offset = 0;
		const tickArrayAddresses: PublicKey[] = [];
		for (let i = 0; i < MAX_SWAP_TICK_ARRAYS; i++) {
			let startIndex: number;
			try {
				startIndex = TickUtil.getStartTickIndex(
					tickCurrentIndex + shift,
					tickSpacing,
					offset,
				);
			} catch {
				return tickArrayAddresses;
			}

			const pda = PDAUtil.getTickArray(programId, yevefiAddress, startIndex);
			tickArrayAddresses.push(pda.publicKey);
			offset = aToB ? offset - 1 : offset + 1;
		}

		return tickArrayAddresses;
	}

	/**
	 * Given the current tick-index, returns TickArray objects that this swap may traverse across.
	 *
	 * @category Yevefi Utils
	 * @param tickCurrentIndex - The current tickIndex for the Yevefi to swap on.
	 * @param tickSpacing - The tickSpacing for the Yevefi.
	 * @param aToB - The direction of the trade.
	 * @param programId - The Yevefi programId which the Yevefi lives on.
	 * @param yevefiAddress - PublicKey of the yevefi to swap on.
	 * @param cache - YevefiAccountCacheInterface object to fetch solana accounts
	 * @param opts an {@link YevefiAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
	 * @returns An array of PublicKey[] for the tickArray accounts that this swap may traverse across.
	 */
	public static async getTickArrays(
		tickCurrentIndex: number,
		tickSpacing: number,
		aToB: boolean,
		programId: PublicKey,
		yevefiAddress: PublicKey,
		fetcher: YevefiAccountFetcherInterface,
		opts?: YevefiAccountFetchOptions,
	): Promise<TickArray[]> {
		const data = await SwapUtils.getBatchTickArrays(
			programId,
			fetcher,
			[{ tickCurrentIndex, tickSpacing, aToB, yevefiAddress }],
			opts,
		);
		return data[0];
	}

	/**
	 * Fetch a batch of tick-arrays for a set of TA requests.
	 * @param programId - The Yevefi programId which the Yevefi lives on.
	 * @param cache - YevefiAccountCacheInterface instance to fetch solana accounts
	 * @param tickArrayRequests - An array of {@link TickArrayRequest} of tick-arrays to request for.
	 * @param opts an {@link YevefiAccountFetchOptions} object to define fetch and cache options when accessing on-chain accounts
	 * @returns A array of request indicies mapped to an array of resulting PublicKeys.
	 */
	public static async getBatchTickArrays(
		programId: PublicKey,
		fetcher: YevefiAccountFetcherInterface,
		tickArrayRequests: TickArrayRequest[],
		opts?: YevefiAccountFetchOptions,
	): Promise<TickArray[][]> {
		const addresses: PublicKey[] = [];
		const requestToIndices = [];

		// Each individual tick array request may correspond to more than one tick array
		// so we map each request to a slice of the batch request
		for (let i = 0; i < tickArrayRequests.length; i++) {
			const { tickCurrentIndex, tickSpacing, aToB, yevefiAddress } =
				tickArrayRequests[i];
			const requestAddresses = SwapUtils.getTickArrayPublicKeys(
				tickCurrentIndex,
				tickSpacing,
				aToB,
				programId,
				yevefiAddress,
			);
			requestToIndices.push([
				addresses.length,
				addresses.length + requestAddresses.length,
			]);
			addresses.push(...requestAddresses);
		}
		const data = await fetcher.getTickArrays(addresses, opts);

		// Re-map from flattened batch data to TickArray[] for request
		return requestToIndices.map((indices) => {
			const [start, end] = indices;
			const addressSlice = addresses.slice(start, end);
			const dataSlice = data.slice(start, end);
			return addressSlice.map((addr, index) => ({
				address: addr,
				data: dataSlice[index],
			}));
		});
	}

	/**
	 * Calculate the SwapInput parameters `amount` & `otherAmountThreshold` based on the amountIn & amountOut estimates from a quote.
	 * @param amount - The amount of tokens the user wanted to swap from.
	 * @param estAmountIn - The estimated amount of input tokens expected in a `SwapQuote`
	 * @param estAmountOut - The estimated amount of output tokens expected from a `SwapQuote`
	 * @param slippageTolerance - The amount of slippage to adjust for.
	 * @param amountSpecifiedIsInput - Specifies the token the parameter `amount`represents in the swap quote. If true, the amount represents
	 *                                 the input token of the swap.
	 * @returns A Partial `SwapInput` object containing the slippage adjusted 'amount' & 'otherAmountThreshold' parameters.
	 */
	public static calculateSwapAmountsFromQuote(
		amount: BN,
		estAmountIn: BN,
		estAmountOut: BN,
		slippageTolerance: Percentage,
		amountSpecifiedIsInput: boolean,
	): Pick<SwapInput, "amount" | "otherAmountThreshold"> {
		if (amountSpecifiedIsInput) {
			return {
				amount,
				otherAmountThreshold: adjustForSlippage(
					estAmountOut,
					slippageTolerance,
					false,
				),
			};
		}
		return {
			amount,
			otherAmountThreshold: adjustForSlippage(
				estAmountIn,
				slippageTolerance,
				true,
			),
		};
	}

	/**
	 * Convert a quote object and YevefiClient's {@link Yevefi} object into a {@link SwapParams} type
	 * to be plugged into {@link YevefiIx.swapIx}.
	 *
	 * @param quote - A {@link SwapQuote} type generated from {@link swapQuoteWithParams}
	 * @param ctx - {@link YevefiContext}
	 * @param yevefi - A {@link Yevefi} object from YevefiClient
	 * @param inputTokenAssociatedAddress - The public key for the ATA of the input token in the swap
	 * @param outputTokenAssociatedAddress - The public key for the ATA of the input token in the swap
	 * @param wallet - The token authority for this swap
	 * @returns A converted {@link SwapParams} generated from the input
	 */
	public static getSwapParamsFromQuote(
		quote: SwapInput,
		ctx: YevefiContext,
		yevefi: Yevefi,
		inputTokenAssociatedAddress: Address,
		outputTokenAssociatedAddress: Address,
		wallet: PublicKey,
	) {
		const data = yevefi.getData();
		return SwapUtils.getSwapParamsFromQuoteKeys(
			quote,
			ctx,
			yevefi.getAddress(),
			data.tokenVaultA,
			data.tokenVaultB,
			inputTokenAssociatedAddress,
			outputTokenAssociatedAddress,
			wallet,
		);
	}

	public static getSwapParamsFromQuoteKeys(
		quote: SwapInput,
		ctx: YevefiContext,
		yevefi: PublicKey,
		tokenVaultA: PublicKey,
		tokenVaultB: PublicKey,
		inputTokenAssociatedAddress: Address,
		outputTokenAssociatedAddress: Address,
		wallet: PublicKey,
	) {
		const aToB = quote.aToB;
		const [inputTokenATA, outputTokenATA] = AddressUtil.toPubKeys([
			inputTokenAssociatedAddress,
			outputTokenAssociatedAddress,
		]);
		const oraclePda = PDAUtil.getOracle(ctx.program.programId, yevefi);
		const params: SwapParams = {
			yevefi,
			tokenOwnerAccountA: aToB ? inputTokenATA : outputTokenATA,
			tokenOwnerAccountB: aToB ? outputTokenATA : inputTokenATA,
			tokenVaultA,
			tokenVaultB,
			oracle: oraclePda.publicKey,
			tokenAuthority: wallet,
			...quote,
		};
		return params;
	}
}
