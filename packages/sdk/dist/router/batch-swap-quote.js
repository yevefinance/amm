"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchBuildSwapQuoteParams = batchBuildSwapQuoteParams;
const common_sdk_1 = require("@orca-so/common-sdk");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const public_1 = require("../utils/public");
async function batchBuildSwapQuoteParams(quoteRequests, programId, fetcher, opts) {
    const yevefis = await fetcher.getPools(quoteRequests.map((req) => req.yevefi), opts);
    const program = common_sdk_1.AddressUtil.toPubKey(programId);
    const tickArrayRequests = quoteRequests.map((quoteReq) => {
        const { yevefi, tokenAmount, tradeTokenMint, amountSpecifiedIsInput } = quoteReq;
        const yevefiData = yevefis.get(common_sdk_1.AddressUtil.toString(yevefi));
        const swapMintKey = common_sdk_1.AddressUtil.toPubKey(tradeTokenMint);
        const swapTokenType = public_1.PoolUtil.getTokenType(yevefiData, swapMintKey);
        (0, tiny_invariant_1.default)(!!swapTokenType, "swapTokenMint does not match any tokens on this pool");
        const aToB = public_1.SwapUtils.getSwapDirection(yevefiData, swapMintKey, amountSpecifiedIsInput) === public_1.SwapDirection.AtoB;
        return {
            yevefiData,
            tokenAmount,
            aToB,
            tickCurrentIndex: yevefiData.tickCurrentIndex,
            tickSpacing: yevefiData.tickSpacing,
            yevefiAddress: common_sdk_1.AddressUtil.toPubKey(yevefi),
            amountSpecifiedIsInput,
        };
    });
    const tickArrays = await public_1.SwapUtils.getBatchTickArrays(program, fetcher, tickArrayRequests, opts);
    return tickArrayRequests.map((req, index) => {
        const { yevefiData, tokenAmount, aToB, amountSpecifiedIsInput } = req;
        return {
            yevefiData,
            tokenAmount,
            aToB,
            amountSpecifiedIsInput,
            sqrtPriceLimit: public_1.SwapUtils.getDefaultSqrtPriceLimit(aToB),
            otherAmountThreshold: public_1.SwapUtils.getDefaultOtherAmountThreshold(amountSpecifiedIsInput),
            tickArrays: tickArrays[index],
        };
    });
}
