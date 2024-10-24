import { TransactionBuilder, type TransactionBuilderOptions } from "@orca-so/common-sdk";
import type { YevefiContext, YevefiContextOpts as YevefiContextOptions } from "..";
export declare function convertListToMap<T>(fetchedData: T[], addresses: string[]): Record<string, T>;
export declare function filterNullObjects<T, K>(firstArray: ReadonlyArray<T | null>, secondArray: ReadonlyArray<K>): [Array<T>, Array<K>];
export declare function checkMergedTransactionSizeIsValid(ctx: YevefiContext, builders: TransactionBuilder[], latestBlockhash: Readonly<{
    blockhash: string;
    lastValidBlockHeight: number;
}>): Promise<boolean>;
export declare function contextOptionsToBuilderOptions(opts: YevefiContextOptions): TransactionBuilderOptions | undefined;
