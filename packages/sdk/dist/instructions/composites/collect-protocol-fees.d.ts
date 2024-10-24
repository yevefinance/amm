import type { Address } from "@coral-xyz/anchor";
import { TransactionBuilder } from "@orca-so/common-sdk";
import type { YevefiContext } from "../..";
export declare function collectProtocolFees(ctx: YevefiContext, poolAddresses: Address[]): Promise<TransactionBuilder>;
