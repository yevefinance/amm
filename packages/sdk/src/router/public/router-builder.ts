import type { Address } from "@coral-xyz/anchor";
import type { YevefiRouter } from ".";
import type { YevefiContext } from "../..";
import { type PoolGraph, PoolGraphBuilder } from "../../utils/public";
import { YevefiRouterImpl } from "../router-impl";

/**
 * Builder to build instances of the {@link YevefiRouter}
 * @category Router
 */
export class YevefiRouterBuilder {
	/**
	 * Builds a {@link YevefiRouter} with a prebuilt {@link PoolGraph}
	 *
	 * @param ctx A {@link YevefiContext} for the current execution environment
	 * @param graph A {@link PoolGraph} that represents the connections between all pools.
	 * @returns A {@link YevefiRouter} that can be used to find routes and execute swaps
	 */
	static buildWithPoolGraph(
		ctx: YevefiContext,
		graph: PoolGraph,
	): YevefiRouter {
		return new YevefiRouterImpl(ctx, graph);
	}

	/**
	 * Fetch and builds a {@link YevefiRouter} with a list of pool addresses.
	 * @param ctx A {@link YevefiContext} for the current execution environment
	 * @param pools A list of {@link Address}es that the router will find routes through.
	 * @returns A {@link YevefiRouter} that can be used to find routes and execute swaps
	 */
	static async buildWithPools(
		ctx: YevefiContext,
		pools: Address[],
	): Promise<YevefiRouter> {
		const poolGraph = await PoolGraphBuilder.buildPoolGraphWithFetch(
			pools,
			ctx.fetcher,
		);
		return new YevefiRouterImpl(ctx, poolGraph);
	}
}
