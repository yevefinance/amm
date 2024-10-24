import type { AccountInfo, PublicKey } from "@solana/web3.js";
import { type FeeTierData, type PositionBundleData, type PositionData, type TickArrayData, type YevefiData, type YevefisConfigData } from "../../types/public";
/**
 * @category Network
 */
export declare class ParsableYevefisConfig {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): YevefisConfigData | null;
}
/**
 * @category Network
 */
export declare class ParsableYevefi {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): YevefiData | null;
}
/**
 * @category Network
 */
export declare class ParsablePosition {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): PositionData | null;
}
/**
 * @category Network
 */
export declare class ParsableTickArray {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): TickArrayData | null;
}
/**
 * @category Network
 */
export declare class ParsableFeeTier {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): FeeTierData | null;
}
/**
 * @category Network
 */
export declare class ParsablePositionBundle {
    private constructor();
    static parse(address: PublicKey, accountData: AccountInfo<Buffer> | undefined | null): PositionBundleData | null;
}
