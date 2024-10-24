import type { YevefiContext } from "../..";
import type { YevefiAccountFetchOptions } from "../../network/public/fetcher";
import type { PositionData, YevefiData } from "../../types/public";
export declare function getTickArrayDataForPosition(ctx: YevefiContext, position: PositionData, yevefi: YevefiData, opts?: YevefiAccountFetchOptions): Promise<readonly (import("../..").TickArrayData | null)[]>;
