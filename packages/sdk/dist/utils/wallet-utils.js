"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWalletConnected = isWalletConnected;
const web3_js_1 = require("@solana/web3.js");
/**
 * Checks if a wallet is connected.
 * @category Yevefi Utils
 * @param wallet The wallet to check.
 * @returns True if the wallet is connected, false otherwise.
 */
function isWalletConnected(wallet) {
    return wallet !== null && !wallet.publicKey.equals(web3_js_1.PublicKey.default);
}
