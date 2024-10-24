import { type Instruction, TransactionBuilder } from "@orca-so/common-sdk";
import type { YevefiContext } from "../../context";
export declare function toTx(ctx: YevefiContext, ix: Instruction): TransactionBuilder;
