import { BN } from "@coral-xyz/anchor";
import { MathUtil } from "@orca-so/common-sdk";
import invariant from "tiny-invariant";
import {
	NUM_REWARDS,
	type PositionData,
	type TickData,
	type YevefiData,
} from "../../types/public";
import { BitMath } from "../../utils/math/bit-math";
import { PoolUtil } from "../../utils/public/pool-utils";

/**
 * Parameters needed to generate a quote on collectible rewards on a position.
 * @category Quotes
 * @param yevefi - the account data for the yevefi this position belongs to
 * @param position - the account data for the position
 * @param tickLower - the TickData account for the lower bound of this position
 * @param tickUpper - the TickData account for the upper bound of this position
 * @param timeStampInSeconds - optional parameter to generate this quote to a unix time stamp.
 */
export type CollectRewardsQuoteParam = {
	yevefi: YevefiData;
	position: PositionData;
	tickLower: TickData;
	tickUpper: TickData;
	timeStampInSeconds?: BN;
};

/**
 * An array of reward amounts that is collectible on a position.
 * @category Quotes
 */
export type CollectRewardsQuote = [
	BN | undefined,
	BN | undefined,
	BN | undefined,
];

/**
 * Get a quote on the outstanding rewards owed to a position.
 *
 * @category Quotes
 * @param param A collection of fetched Yevefi accounts to faciliate the quote.
 * @returns A quote object containing the rewards owed for each reward in the pool.
 */
export function collectRewardsQuote(
	param: CollectRewardsQuoteParam,
): CollectRewardsQuote {
	const { yevefi, position, tickLower, tickUpper, timeStampInSeconds } = param;

	const {
		tickCurrentIndex,
		rewardInfos: yevefiRewardsInfos,
		rewardLastUpdatedTimestamp,
	} = yevefi;
	const {
		tickLowerIndex,
		tickUpperIndex,
		liquidity,
		rewardInfos: positionRewardInfos,
	} = position;

	const currTimestampInSeconds =
		timeStampInSeconds ?? new BN(Date.now()).div(new BN(1000));
	const timestampDelta = currTimestampInSeconds.sub(
		new BN(rewardLastUpdatedTimestamp),
	);
	const rewardOwed: CollectRewardsQuote = [undefined, undefined, undefined];

	for (let i = 0; i < NUM_REWARDS; i++) {
		// Calculate the reward growth on the outside of the position (growth_above, growth_below)
		const rewardInfo = yevefiRewardsInfos[i];
		const positionRewardInfo = positionRewardInfos[i];
		invariant(!!rewardInfo, "yevefiRewardsInfos cannot be undefined");

		const isRewardInitialized = PoolUtil.isRewardInitialized(rewardInfo);
		if (!isRewardInitialized) {
			continue;
		}

		// Increment the global reward growth tracker based on time elasped since the last yevefi update.
		let adjustedRewardGrowthGlobalX64 = rewardInfo.growthGlobalX64;
		if (!yevefi.liquidity.isZero()) {
			const rewardGrowthDelta = BitMath.mulDiv(
				timestampDelta,
				rewardInfo.emissionsPerSecondX64,
				yevefi.liquidity,
				128,
			);
			adjustedRewardGrowthGlobalX64 =
				rewardInfo.growthGlobalX64.add(rewardGrowthDelta);
		}

		// Calculate the reward growth outside of the position
		const tickLowerRewardGrowthsOutsideX64 = tickLower.rewardGrowthsOutside[i];
		const tickUpperRewardGrowthsOutsideX64 = tickUpper.rewardGrowthsOutside[i];

		let rewardGrowthsBelowX64: BN = adjustedRewardGrowthGlobalX64;
		if (tickLower.initialized) {
			rewardGrowthsBelowX64 =
				tickCurrentIndex < tickLowerIndex
					? MathUtil.subUnderflowU128(
							adjustedRewardGrowthGlobalX64,
							tickLowerRewardGrowthsOutsideX64,
						)
					: tickLowerRewardGrowthsOutsideX64;
		}

		let rewardGrowthsAboveX64: BN = new BN(0);
		if (tickUpper.initialized) {
			rewardGrowthsAboveX64 =
				tickCurrentIndex < tickUpperIndex
					? tickUpperRewardGrowthsOutsideX64
					: MathUtil.subUnderflowU128(
							adjustedRewardGrowthGlobalX64,
							tickUpperRewardGrowthsOutsideX64,
						);
		}

		const rewardGrowthInsideX64 = MathUtil.subUnderflowU128(
			MathUtil.subUnderflowU128(
				adjustedRewardGrowthGlobalX64,
				rewardGrowthsBelowX64,
			),
			rewardGrowthsAboveX64,
		);

		// Knowing the growth of the reward checkpoint for the position, calculate and increment the amount owed for each reward.
		const amountOwedX64 = positionRewardInfo.amountOwed.shln(64);
		rewardOwed[i] = amountOwedX64
			.add(
				MathUtil.subUnderflowU128(
					rewardGrowthInsideX64,
					positionRewardInfo.growthInsideCheckpoint,
				).mul(liquidity),
			)
			.shrn(64);
	}

	return rewardOwed;
}
