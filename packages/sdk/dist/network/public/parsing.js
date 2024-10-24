"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsablePositionBundle = exports.ParsableFeeTier = exports.ParsableTickArray = exports.ParsablePosition = exports.ParsableYevefi = exports.ParsableYevefisConfig = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const common_sdk_1 = require("@orca-so/common-sdk");
const YevefiIDL = __importStar(require("../../artifacts/yevefi.json"));
const public_1 = require("../../types/public");
/**
 * @category Network
 */
let ParsableYevefisConfig = class ParsableYevefisConfig {
    constructor() { }
    static parse(address, accountData) {
        if (!accountData?.data) {
            return null;
        }
        try {
            return parseAnchorAccount(public_1.AccountName.YevefisConfig, accountData);
        }
        catch (e) {
            console.error(`error while parsing YevefisConfig: ${e}`);
            return null;
        }
    }
};
exports.ParsableYevefisConfig = ParsableYevefisConfig;
exports.ParsableYevefisConfig = ParsableYevefisConfig = __decorate([
    (0, common_sdk_1.staticImplements)()
], ParsableYevefisConfig);
/**
 * @category Network
 */
let ParsableYevefi = class ParsableYevefi {
    constructor() { }
    static parse(address, accountData) {
        if (!accountData?.data) {
            return null;
        }
        try {
            return parseAnchorAccount(public_1.AccountName.Yevefi, accountData);
        }
        catch (e) {
            console.error(`error while parsing Yevefi: ${e}`);
            return null;
        }
    }
};
exports.ParsableYevefi = ParsableYevefi;
exports.ParsableYevefi = ParsableYevefi = __decorate([
    (0, common_sdk_1.staticImplements)()
], ParsableYevefi);
/**
 * @category Network
 */
let ParsablePosition = class ParsablePosition {
    constructor() { }
    static parse(address, accountData) {
        if (!accountData?.data) {
            return null;
        }
        try {
            return parseAnchorAccount(public_1.AccountName.Position, accountData);
        }
        catch (e) {
            console.error(`error while parsing Position: ${e}`);
            return null;
        }
    }
};
exports.ParsablePosition = ParsablePosition;
exports.ParsablePosition = ParsablePosition = __decorate([
    (0, common_sdk_1.staticImplements)()
], ParsablePosition);
/**
 * @category Network
 */
let ParsableTickArray = class ParsableTickArray {
    constructor() { }
    static parse(address, accountData) {
        if (!accountData?.data) {
            return null;
        }
        try {
            return parseAnchorAccount(public_1.AccountName.TickArray, accountData);
        }
        catch (e) {
            console.error(`error while parsing TickArray: ${e}`);
            return null;
        }
    }
};
exports.ParsableTickArray = ParsableTickArray;
exports.ParsableTickArray = ParsableTickArray = __decorate([
    (0, common_sdk_1.staticImplements)()
], ParsableTickArray);
/**
 * @category Network
 */
let ParsableFeeTier = class ParsableFeeTier {
    constructor() { }
    static parse(address, accountData) {
        if (!accountData?.data) {
            return null;
        }
        try {
            return parseAnchorAccount(public_1.AccountName.FeeTier, accountData);
        }
        catch (e) {
            console.error(`error while parsing FeeTier: ${e}`);
            return null;
        }
    }
};
exports.ParsableFeeTier = ParsableFeeTier;
exports.ParsableFeeTier = ParsableFeeTier = __decorate([
    (0, common_sdk_1.staticImplements)()
], ParsableFeeTier);
/**
 * @category Network
 */
let ParsablePositionBundle = class ParsablePositionBundle {
    constructor() { }
    static parse(address, accountData) {
        if (!accountData?.data) {
            return null;
        }
        try {
            return parseAnchorAccount(public_1.AccountName.PositionBundle, accountData);
        }
        catch (e) {
            console.error(`error while parsing PositionBundle: ${e}`);
            return null;
        }
    }
};
exports.ParsablePositionBundle = ParsablePositionBundle;
exports.ParsablePositionBundle = ParsablePositionBundle = __decorate([
    (0, common_sdk_1.staticImplements)()
], ParsablePositionBundle);
const YevefiCoder = new anchor_1.BorshAccountsCoder(YevefiIDL);
function parseAnchorAccount(accountName, accountData) {
    const data = accountData.data;
    const discriminator = anchor_1.BorshAccountsCoder.accountDiscriminator(accountName);
    if (discriminator.compare(data.slice(0, 8))) {
        console.error("incorrect account name during parsing");
        return null;
    }
    try {
        return YevefiCoder.decode(accountName, data);
    }
    catch (_e) {
        console.error("unknown account name during parsing");
        return null;
    }
}
