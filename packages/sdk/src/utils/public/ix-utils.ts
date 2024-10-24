import { type Instruction, TransactionBuilder } from "@orca-so/common-sdk";
import type { YevefiContext } from "../../context";

export function toTx(ctx: YevefiContext, ix: Instruction): TransactionBuilder {
	return new TransactionBuilder(
		ctx.provider.connection,
		ctx.provider.wallet,
		ctx.txBuilderOpts,
	).addInstruction(ix);
}
