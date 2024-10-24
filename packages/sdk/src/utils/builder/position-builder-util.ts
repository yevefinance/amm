import type { YevefiContext } from "../..";
import type { YevefiAccountFetchOptions } from "../../network/public/fetcher";
import type { PositionData, YevefiData } from "../../types/public";
import { PDAUtil } from "../public";

export async function getTickArrayDataForPosition(
	ctx: YevefiContext,
	position: PositionData,
	yevefi: YevefiData,
	opts?: YevefiAccountFetchOptions,
) {
	const lowerTickArrayKey = PDAUtil.getTickArrayFromTickIndex(
		position.tickLowerIndex,
		yevefi.tickSpacing,
		position.yevefi,
		ctx.program.programId,
	).publicKey;
	const upperTickArrayKey = PDAUtil.getTickArrayFromTickIndex(
		position.tickUpperIndex,
		yevefi.tickSpacing,
		position.yevefi,
		ctx.program.programId,
	).publicKey;

	return await ctx.fetcher.getTickArrays(
		[lowerTickArrayKey, upperTickArrayKey],
		opts,
	);
}
