import {
	type Instruction,
	TokenUtil,
	type TransactionBuilder,
	type WrappedSolAccountCreateMethod,
	ZERO,
	resolveOrCreateATAs,
} from "@orca-so/common-sdk";
import { NATIVE_MINT } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { PoolUtil, type YevefiContext } from "..";
import type { YevefiData } from "../types/public";
import { convertListToMap } from "./txn-utils";

export enum TokenMintTypes {
	ALL = "ALL",
	POOL_ONLY = "POOL_ONLY",
	REWARD_ONLY = "REWARDS_ONLY",
}

export type YevefisTokenMints = {
	mintMap: PublicKey[];
	hasNativeMint: boolean;
};

/**
 * Fetch a list of affliated tokens from a list of yevefis
 *
 * SOL tokens does not use the ATA program and therefore not handled.
 * @param yevefiDatas An array of yevefiData (from fetcher.listPools)
 * @param mintTypes The set of mints to collect from these yevefis
 * @returns All the yevefi, reward token mints in the given set of yevefis
 */
export function getTokenMintsFromYevefis(
	yevefiDatas: (YevefiData | null)[],
	mintTypes = TokenMintTypes.ALL,
): YevefisTokenMints {
	let hasNativeMint = false;
	const mints = Array.from(
		yevefiDatas.reduce<Set<string>>((accu, yevefiData) => {
			if (yevefiData) {
				if (
					mintTypes === TokenMintTypes.ALL ||
					mintTypes === TokenMintTypes.POOL_ONLY
				) {
					const { tokenMintA, tokenMintB } = yevefiData;
					// TODO: Once we move to sync-native for wSOL wrapping, we can simplify and use wSOL ATA instead of a custom token account.
					if (!TokenUtil.isNativeMint(tokenMintA)) {
						accu.add(tokenMintA.toBase58());
					} else {
						hasNativeMint = true;
					}

					if (!TokenUtil.isNativeMint(tokenMintB)) {
						accu.add(tokenMintB.toBase58());
					} else {
						hasNativeMint = true;
					}
				}

				if (
					mintTypes === TokenMintTypes.ALL ||
					mintTypes === TokenMintTypes.REWARD_ONLY
				) {
					const rewardInfos = yevefiData.rewardInfos;
					rewardInfos.forEach((reward) => {
						if (TokenUtil.isNativeMint(reward.mint)) {
							hasNativeMint = true;
						}
						if (PoolUtil.isRewardInitialized(reward)) {
							accu.add(reward.mint.toBase58());
						}
					});
				}
			}
			return accu;
		}, new Set<string>()),
	).map((mint) => new PublicKey(mint));

	return {
		mintMap: mints,
		hasNativeMint,
	};
}

/**
 * Parameters to resolve ATAs for affliated tokens in a list of Yevefis
 *
 * @category Instruction Types
 * @param mints - The list of mints to generate affliated tokens for.
 * @param accountExemption - The value from the most recent getMinimumBalanceForRentExemption().
 * @param destinationWallet - the wallet to generate ATAs against
 * @param payer - The payer address that would pay for the creation of ATA addresses
 */
export type ResolveAtaInstructionParams = {
	mints: PublicKey[];
	accountExemption: number;
	receiver?: PublicKey;
	payer?: PublicKey;
};

/**
 * An interface of mapping between tokenMint & ATA & the instruction set to initialize them.
 *
 * @category Instruction Types
 * @param ataTokenAddresses - A record between the token mint & generated ATA addresses
 * @param resolveAtaIxs - An array of instructions to initialize all uninitialized ATA token accounts for the list above.
 */
export type ResolvedATAInstructionSet = {
	ataTokenAddresses: Record<string, PublicKey>;
	resolveAtaIxs: Instruction[];
};

/**
 * Build instructions to resolve ATAs (Associated Tokens Addresses) for affliated tokens in a list of Yevefis.
 * Affliated tokens are tokens that are part of the trade pair or reward in a Yevefi.
 *
 * @param ctx - YevefiContext object for the current environment.
 * @param params - ResolveAtaInstructionParams
 * @returns a ResolvedTokenAddressesIxSet containing the derived ATA addresses & ix set to initialize the accounts.
 */
export async function resolveAtaForMints(
	ctx: YevefiContext,
	params: ResolveAtaInstructionParams,
): Promise<ResolvedATAInstructionSet> {
	const { mints, receiver, payer, accountExemption } = params;
	const receiverKey = receiver ?? ctx.wallet.publicKey;
	const payerKey = payer ?? ctx.wallet.publicKey;

	const resolvedAtaResults = await resolveOrCreateATAs(
		ctx.connection,
		receiverKey,
		mints.map((tokenMint) => {
			return { tokenMint };
		}),
		async () => accountExemption,
		payerKey,
		undefined, // use default
		ctx.accountResolverOpts.allowPDAOwnerAddress,
		ctx.accountResolverOpts.createWrappedSolAccountMethod,
	);

	// Convert the results back into the specified format
	const { resolveAtaIxs, resolvedAtas } = resolvedAtaResults.reduce<{
		resolvedAtas: PublicKey[];
		resolveAtaIxs: Instruction[];
	}>(
		(accu, curr) => {
			const { address, ...ix } = curr;
			accu.resolvedAtas.push(address);

			// TODO: common-sdk needs to have an easier way to check for empty instruction
			if (ix.instructions.length) {
				accu.resolveAtaIxs.push(ix);
			}
			return accu;
		},
		{ resolvedAtas: [], resolveAtaIxs: [] },
	);

	const affliatedTokenAtaMap = convertListToMap(
		resolvedAtas,
		mints.map((mint) => mint.toBase58()),
	);
	return {
		ataTokenAddresses: affliatedTokenAtaMap,
		resolveAtaIxs,
	};
}

/**
 * Add native WSOL mint handling to a transaction builder.
 */
export function addNativeMintHandlingIx(
	txBuilder: TransactionBuilder,
	affliatedTokenAtaMap: Record<string, PublicKey>,
	destinationWallet: PublicKey,
	accountExemption: number,
	createAccountMethod: WrappedSolAccountCreateMethod,
) {
	const { address: wSOLAta, ...resolveWSolIx } =
		TokenUtil.createWrappedNativeAccountInstruction(
			destinationWallet,
			ZERO,
			accountExemption,
			undefined, // use default
			undefined, // use default
			createAccountMethod,
		);
	affliatedTokenAtaMap[NATIVE_MINT.toBase58()] = wSOLAta;
	txBuilder.prependInstruction(resolveWSolIx);
}
