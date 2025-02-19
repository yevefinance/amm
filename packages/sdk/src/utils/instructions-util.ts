import * as anchor from "@coral-xyz/anchor";
import {
	ASSOCIATED_TOKEN_PROGRAM_ID,
	TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { SystemProgram } from "@solana/web3.js";
import type { OpenPositionParams } from "../instructions";

export function openPositionAccounts(params: OpenPositionParams) {
	const {
		funder,
		owner,
		positionPda,
		positionMintAddress,
		positionTokenAccount: positionTokenAccountAddress,
		yevefi: yevefiKey,
	} = params;
	return {
		funder: funder,
		owner,
		position: positionPda.publicKey,
		positionMint: positionMintAddress,
		positionTokenAccount: positionTokenAccountAddress,
		yevefi: yevefiKey,
		tokenProgram: TOKEN_PROGRAM_ID,
		systemProgram: SystemProgram.programId,
		rent: anchor.web3.SYSVAR_RENT_PUBKEY,
		associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
	};
}
