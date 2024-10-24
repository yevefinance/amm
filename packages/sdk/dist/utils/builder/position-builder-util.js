"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickArrayDataForPosition = getTickArrayDataForPosition;
const public_1 = require("../public");
async function getTickArrayDataForPosition(ctx, position, yevefi, opts) {
    const lowerTickArrayKey = public_1.PDAUtil.getTickArrayFromTickIndex(position.tickLowerIndex, yevefi.tickSpacing, position.yevefi, ctx.program.programId).publicKey;
    const upperTickArrayKey = public_1.PDAUtil.getTickArrayFromTickIndex(position.tickUpperIndex, yevefi.tickSpacing, position.yevefi, ctx.program.programId).publicKey;
    return await ctx.fetcher.getTickArrays([lowerTickArrayKey, upperTickArrayKey], opts);
}
