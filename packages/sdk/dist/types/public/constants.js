"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YEVEFI_NFT_UPDATE_AUTH = exports.FEE_RATE_MUL_VALUE = exports.PROTOCOL_FEE_RATE_MUL_VALUE = exports.MAX_SWAP_TICK_ARRAYS = exports.METADATA_PROGRAM_ADDRESS = exports.POSITION_BUNDLE_SIZE = exports.TICK_ARRAY_SIZE = exports.MAX_SQRT_PRICE_BN = exports.MIN_SQRT_PRICE_BN = exports.MIN_SQRT_PRICE = exports.MAX_SQRT_PRICE = exports.MIN_TICK_INDEX = exports.MAX_TICK_INDEX = exports.NUM_REWARDS = exports.ORCA_SUPPORTED_TICK_SPACINGS = exports.ORCA_YEVEFIS_CONFIG = exports.ORCA_YEVEFI_PROGRAM_ID = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
/**
 * Program ID hosting Orca's Yevefi program.
 * @category Constants
 */
exports.ORCA_YEVEFI_PROGRAM_ID = new web3_js_1.PublicKey("EdG4rQqC9LCY4MQWLGXerQ7h1LknKRmSiHL1upCNEdqD");
/**
 * Orca's YevefisConfig PublicKey.
 * @category Constants
 */
exports.ORCA_YEVEFIS_CONFIG = new web3_js_1.PublicKey("4j3k61AqzTbwJvEghEtvkMz72SNs6UGSWXd9Sopakasb");
/**
 * Orca's supported tick spacings.
 * @category Constants
 */
exports.ORCA_SUPPORTED_TICK_SPACINGS = [1, 2, 4, 8, 16, 64, 128, 256];
/**
 * The number of rewards supported by this yevefi.
 * @category Constants
 */
exports.NUM_REWARDS = 3;
/**
 * The maximum tick index supported by the Yevefi program.
 * @category Constants
 */
exports.MAX_TICK_INDEX = 443636;
/**
 * The minimum tick index supported by the Yevefi program.
 * @category Constants
 */
exports.MIN_TICK_INDEX = -443636;
/**
 * The maximum sqrt-price supported by the Yevefi program.
 * @category Constants
 */
exports.MAX_SQRT_PRICE = "79226673515401279992447579055";
/**
 * The minimum sqrt-price supported by the Yevefi program.
 * @category Constants
 */
exports.MIN_SQRT_PRICE = "4295048016";
/**
 * The minimum sqrt-price supported by the Yevefi program.
 * @category Constants
 */
exports.MIN_SQRT_PRICE_BN = new anchor_1.BN(exports.MIN_SQRT_PRICE);
/**
 * The maximum sqrt-price supported by the Yevefi program.
 * @category Constants
 */
exports.MAX_SQRT_PRICE_BN = new anchor_1.BN(exports.MAX_SQRT_PRICE);
/**
 * The number of initialized ticks that a tick-array account can hold.
 * @category Constants
 */
exports.TICK_ARRAY_SIZE = 88;
/**
 * The number of bundled positions that a position-bundle account can hold.
 * @category Constants
 */
exports.POSITION_BUNDLE_SIZE = 256;
/**
 * @category Constants
 */
exports.METADATA_PROGRAM_ADDRESS = new web3_js_1.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
/**
 * The maximum number of tick-arrays that can traversed across in a swap.
 * @category Constants
 */
exports.MAX_SWAP_TICK_ARRAYS = 3;
/**
 * The denominator which the protocol fee rate is divided on.
 * @category Constants
 */
exports.PROTOCOL_FEE_RATE_MUL_VALUE = new anchor_1.BN(10000);
/**
 * The denominator which the fee rate is divided on.
 * @category Constants
 */
exports.FEE_RATE_MUL_VALUE = new anchor_1.BN(1000000);
/**
 * The public key that is allowed to update the metadata of Yevefi NFTs.
 * @category Constants
 */
exports.YEVEFI_NFT_UPDATE_AUTH = new web3_js_1.PublicKey("DuNGiWTqprnHNpe7KVfmaN8PNmH7RgvXntm6uPLdH2F3");
