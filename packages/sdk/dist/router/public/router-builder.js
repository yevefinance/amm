"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YevefiRouterBuilder = void 0;
const public_1 = require("../../utils/public");
const router_impl_1 = require("../router-impl");
/**
 * Builder to build instances of the {@link YevefiRouter}
 * @category Router
 */
class YevefiRouterBuilder {
    /**
     * Builds a {@link YevefiRouter} with a prebuilt {@link PoolGraph}
     *
     * @param ctx A {@link YevefiContext} for the current execution environment
     * @param graph A {@link PoolGraph} that represents the connections between all pools.
     * @returns A {@link YevefiRouter} that can be used to find routes and execute swaps
     */
    static buildWithPoolGraph(ctx, graph) {
        return new router_impl_1.YevefiRouterImpl(ctx, graph);
    }
    /**
     * Fetch and builds a {@link YevefiRouter} with a list of pool addresses.
     * @param ctx A {@link YevefiContext} for the current execution environment
     * @param pools A list of {@link Address}es that the router will find routes through.
     * @returns A {@link YevefiRouter} that can be used to find routes and execute swaps
     */
    static async buildWithPools(ctx, pools) {
        const poolGraph = await public_1.PoolGraphBuilder.buildPoolGraphWithFetch(pools, ctx.fetcher);
        return new router_impl_1.YevefiRouterImpl(ctx, poolGraph);
    }
}
exports.YevefiRouterBuilder = YevefiRouterBuilder;
