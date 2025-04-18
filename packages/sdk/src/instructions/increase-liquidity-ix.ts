import type { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { PublicKey } from "@solana/web3.js";
import type BN from "bn.js";
import type { Yevefi } from "../artifacts/yevefi";

import type { Instruction } from "@orca-so/common-sdk";

/**
 * Parameters to increase liquidity for a position.
 *
 * @category Instruction Types
 * @param liquidityAmount - The total amount of Liquidity the user is willing to deposit.
 * @param tokenMaxA - The maximum amount of token A to add to the position.
 * @param tokenMaxB - The maximum amount of token B to add to the position.
 * @param yevefi - PublicKey for the yevefi that the position will be opened for.
 * @param position - PublicKey for the  position will be opened for.
 * @param positionTokenAccount - PublicKey for the position token's associated token address.
 * @param tokenOwnerAccountA - PublicKey for the token A account that will be withdrawed from.
 * @param tokenOwnerAccountB - PublicKey for the token B account that will be withdrawed from.
 * @param tokenVaultA - PublicKey for the tokenA vault for this yevefi.
 * @param tokenVaultB - PublicKey for the tokenB vault for this yevefi.
 * @param tickArrayLower - PublicKey for the tick-array account that hosts the tick at the lower tick index.
 * @param tickArrayUpper - PublicKey for the tick-array account that hosts the tick at the upper tick index.
 * @param positionAuthority - authority that owns the token corresponding to this desired position.
 */
export type IncreaseLiquidityParams = {
	yevefi: PublicKey;
	position: PublicKey;
	positionTokenAccount: PublicKey;
	tokenOwnerAccountA: PublicKey;
	tokenOwnerAccountB: PublicKey;
	tokenVaultA: PublicKey;
	tokenVaultB: PublicKey;
	tickArrayLower: PublicKey;
	tickArrayUpper: PublicKey;
	positionAuthority: PublicKey;
} & IncreaseLiquidityInput;

/**
 * Input parameters to deposit liquidity into a position.
 *
 * This type is usually generated by a quote class to estimate the amount of tokens required to
 * deposit a certain amount of liquidity into a position.
 *
 * @category Instruction Types
 * @param tokenMaxA - the maximum amount of tokenA allowed to withdraw from the source wallet.
 * @param tokenMaxB - the maximum amount of tokenB allowed to withdraw from the source wallet.
 * @param liquidityAmount - the desired amount of liquidity to deposit into the position/
 */
export type IncreaseLiquidityInput = {
	tokenMaxA: BN;
	tokenMaxB: BN;
	liquidityAmount: BN;
};

/**
 * Add liquidity to a position in the Yevefi.
 *
 * #### Special Errors
 * `LiquidityZero` - Provided liquidity amount is zero.
 * `LiquidityTooHigh` - Provided liquidity exceeds u128::max.
 * `TokenMaxExceeded` - The required token to perform this operation exceeds the user defined amount.
 *
 * @category Instructions
 * @param context - Context object containing services required to generate the instruction
 * @param params - IncreaseLiquidityParams object
 * @returns - Instruction to perform the action.
 */
export function increaseLiquidityIx(
	program: Program<Yevefi>,
	params: IncreaseLiquidityParams,
): Instruction {
	const {
		liquidityAmount,
		tokenMaxA,
		tokenMaxB,
		yevefi,
		positionAuthority,
		position,
		positionTokenAccount,
		tokenOwnerAccountA,
		tokenOwnerAccountB,
		tokenVaultA,
		tokenVaultB,
		tickArrayLower,
		tickArrayUpper,
	} = params;

	const ix = program.instruction.increaseLiquidity(
		liquidityAmount,
		tokenMaxA,
		tokenMaxB,
		{
			accounts: {
				yevefi,
				tokenProgram: TOKEN_PROGRAM_ID,
				positionAuthority,
				position,
				positionTokenAccount,
				tokenOwnerAccountA,
				tokenOwnerAccountB,
				tokenVaultA,
				tokenVaultB,
				tickArrayLower,
				tickArrayUpper,
			},
		},
	);

	return {
		instructions: [ix],
		cleanupInstructions: [],
		signers: [],
	};
}
