import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

/**
 * Program ID hosting Orca's Yevefi program.
 * @category Constants
 */
export const ORCA_YEVEFI_PROGRAM_ID = new PublicKey(
	"EdG4rQqC9LCY4MQWLGXerQ7h1LknKRmSiHL1upCNEdqD",
);

/**
 * Orca's YevefisConfig PublicKey.
 * @category Constants
 */
export const ORCA_YEVEFIS_CONFIG = new PublicKey(
	"4j3k61AqzTbwJvEghEtvkMz72SNs6UGSWXd9Sopakasb",
);

/**
 * Orca's supported tick spacings.
 * @category Constants
 */
export const ORCA_SUPPORTED_TICK_SPACINGS = [1, 2, 4, 8, 16, 64, 128, 256];

/**
 * The number of rewards supported by this yevefi.
 * @category Constants
 */
export const NUM_REWARDS = 3;

/**
 * The maximum tick index supported by the Yevefi program.
 * @category Constants
 */
export const MAX_TICK_INDEX = 443636;

/**
 * The minimum tick index supported by the Yevefi program.
 * @category Constants
 */
export const MIN_TICK_INDEX = -443636;

/**
 * The maximum sqrt-price supported by the Yevefi program.
 * @category Constants
 */
export const MAX_SQRT_PRICE = "79226673515401279992447579055";

/**
 * The minimum sqrt-price supported by the Yevefi program.
 * @category Constants
 */
export const MIN_SQRT_PRICE = "4295048016";

/**
 * The minimum sqrt-price supported by the Yevefi program.
 * @category Constants
 */
export const MIN_SQRT_PRICE_BN = new BN(MIN_SQRT_PRICE);

/**
 * The maximum sqrt-price supported by the Yevefi program.
 * @category Constants
 */
export const MAX_SQRT_PRICE_BN = new BN(MAX_SQRT_PRICE);

/**
 * The number of initialized ticks that a tick-array account can hold.
 * @category Constants
 */
export const TICK_ARRAY_SIZE = 88;

/**
 * The number of bundled positions that a position-bundle account can hold.
 * @category Constants
 */
export const POSITION_BUNDLE_SIZE = 256;

/**
 * @category Constants
 */
export const METADATA_PROGRAM_ADDRESS = new PublicKey(
	"metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
);

/**
 * The maximum number of tick-arrays that can traversed across in a swap.
 * @category Constants
 */
export const MAX_SWAP_TICK_ARRAYS = 3;

/**
 * The denominator which the protocol fee rate is divided on.
 * @category Constants
 */
export const PROTOCOL_FEE_RATE_MUL_VALUE = new BN(10_000);

/**
 * The denominator which the fee rate is divided on.
 * @category Constants
 */
export const FEE_RATE_MUL_VALUE = new BN(1_000_000);

/**
 * The public key that is allowed to update the metadata of Yevefi NFTs.
 * @category Constants
 */
export const YEVEFI_NFT_UPDATE_AUTH = new PublicKey(
	"DuNGiWTqprnHNpe7KVfmaN8PNmH7RgvXntm6uPLdH2F3",
);
