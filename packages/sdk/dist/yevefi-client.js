"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildYevefiClient = buildYevefiClient;
const yevefi_client_impl_1 = require("./impl/yevefi-client-impl");
/**
 * Construct a YevefiClient instance to help interact with Yevefis accounts with.
 *
 * @category YevefiClient
 * @param ctx - YevefiContext object
 * @returns a YevefiClient instance to help with interacting with Yevefis accounts.
 */
function buildYevefiClient(ctx) {
    return new yevefi_client_impl_1.YevefiClientImpl(ctx);
}
