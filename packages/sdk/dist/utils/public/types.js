"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = exports.SwapDirection = void 0;
/**
 * An enum for the direction of a swap.
 * @category Yevefi Utils
 */
var SwapDirection;
(function (SwapDirection) {
    SwapDirection["AtoB"] = "aToB";
    SwapDirection["BtoA"] = "bToA";
})(SwapDirection || (exports.SwapDirection = SwapDirection = {}));
/**
 * An enum for the token type in a Yevefi.
 * @category Yevefi Utils
 */
var TokenType;
(function (TokenType) {
    TokenType[TokenType["TokenA"] = 1] = "TokenA";
    TokenType[TokenType["TokenB"] = 2] = "TokenB";
})(TokenType || (exports.TokenType = TokenType = {}));
