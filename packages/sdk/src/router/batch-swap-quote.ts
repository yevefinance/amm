import type { Address } from "@coral-xyz/anchor";
import { AddressUtil } from "@orca-so/common-sdk";
import type BN from "bn.js";
import invariant from "tiny-invariant";
import type {
	YevefiAccountFetchOptions,
	YevefiAccountFetcherInterface,
} from "../network/public/fetcher";
import type { SwapQuoteParam } from "../quotes/public";
import { PoolUtil, SwapDirection, SwapUtils } from "../utils/public";

export interface SwapQuoteRequest {
	yevefi: Address;
	tradeTokenMint: Address;
	tokenAmount: BN;
	amountSpecifiedIsInput: boolean;
}

export async function batchBuildSwapQuoteParams(
	quoteRequests: SwapQuoteRequest[],
	programId: Address,
	fetcher: YevefiAccountFetcherInterface,
	opts?: YevefiAccountFetchOptions,
): Promise<SwapQuoteParam[]> {
	const yevefis = await fetcher.getPools(
		quoteRequests.map((req) => req.yevefi),
		opts,
	);
	const program = AddressUtil.toPubKey(programId);

	const tickArrayRequests = quoteRequests.map((quoteReq) => {
		const { yevefi, tokenAmount, tradeTokenMint, amountSpecifiedIsInput } =
			quoteReq;
		const yevefiData = yevefis.get(AddressUtil.toString(yevefi))!;
		const swapMintKey = AddressUtil.toPubKey(tradeTokenMint);
		const swapTokenType = PoolUtil.getTokenType(yevefiData, swapMintKey);
		invariant(
			!!swapTokenType,
			"swapTokenMint does not match any tokens on this pool",
		);
		const aToB =
			SwapUtils.getSwapDirection(
				yevefiData,
				swapMintKey,
				amountSpecifiedIsInput,
			) === SwapDirection.AtoB;
		return {
			yevefiData,
			tokenAmount,
			aToB,
			tickCurrentIndex: yevefiData.tickCurrentIndex,
			tickSpacing: yevefiData.tickSpacing,
			yevefiAddress: AddressUtil.toPubKey(yevefi),
			amountSpecifiedIsInput,
		};
	});

	const tickArrays = await SwapUtils.getBatchTickArrays(
		program,
		fetcher,
		tickArrayRequests,
		opts,
	);

	return tickArrayRequests.map((req, index) => {
		const { yevefiData, tokenAmount, aToB, amountSpecifiedIsInput } = req;
		return {
			yevefiData,
			tokenAmount,
			aToB,
			amountSpecifiedIsInput,
			sqrtPriceLimit: SwapUtils.getDefaultSqrtPriceLimit(aToB),
			otherAmountThreshold: SwapUtils.getDefaultOtherAmountThreshold(
				amountSpecifiedIsInput,
			),
			tickArrays: tickArrays[index],
		};
	});
}
