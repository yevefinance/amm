"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionImpl = void 0;
const common_sdk_1 = require("@orca-so/common-sdk");
const spl_token_1 = require("@solana/spl-token");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const instructions_1 = require("../instructions");
const fetcher_1 = require("../network/public/fetcher");
const position_builder_util_1 = require("../utils/builder/position-builder-util");
const public_1 = require("../utils/public");
const yevefi_ata_utils_1 = require("../utils/yevefi-ata-utils");
class PositionImpl {
    constructor(ctx, address, data, yevefiData, lowerTickArrayData, upperTickArrayData) {
        this.ctx = ctx;
        this.address = address;
        this.data = data;
        this.yevefiData = yevefiData;
        this.lowerTickArrayData = lowerTickArrayData;
        this.upperTickArrayData = upperTickArrayData;
    }
    getAddress() {
        return this.address;
    }
    getData() {
        return this.data;
    }
    getYevefiData() {
        return this.yevefiData;
    }
    getLowerTickData() {
        return public_1.TickArrayUtil.getTickFromArray(this.lowerTickArrayData, this.data.tickLowerIndex, this.yevefiData.tickSpacing);
    }
    getUpperTickData() {
        return public_1.TickArrayUtil.getTickFromArray(this.upperTickArrayData, this.data.tickUpperIndex, this.yevefiData.tickSpacing);
    }
    async refreshData() {
        await this.refresh();
        return this.data;
    }
    async increaseLiquidity(liquidityInput, resolveATA = true, sourceWallet, positionWallet, ataPayer) {
        const sourceWalletKey = sourceWallet
            ? common_sdk_1.AddressUtil.toPubKey(sourceWallet)
            : this.ctx.wallet.publicKey;
        const positionWalletKey = positionWallet
            ? common_sdk_1.AddressUtil.toPubKey(positionWallet)
            : this.ctx.wallet.publicKey;
        const ataPayerKey = ataPayer
            ? common_sdk_1.AddressUtil.toPubKey(ataPayer)
            : this.ctx.wallet.publicKey;
        const yevefi = await this.ctx.fetcher.getPool(this.data.yevefi, fetcher_1.IGNORE_CACHE);
        if (!yevefi) {
            throw new Error("Unable to fetch yevefi for this position.");
        }
        const txBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        let tokenOwnerAccountA;
        let tokenOwnerAccountB;
        if (resolveATA) {
            const [ataA, ataB] = await (0, common_sdk_1.resolveOrCreateATAs)(this.ctx.connection, sourceWalletKey, [
                {
                    tokenMint: yevefi.tokenMintA,
                    wrappedSolAmountIn: liquidityInput.tokenMaxA,
                },
                {
                    tokenMint: yevefi.tokenMintB,
                    wrappedSolAmountIn: liquidityInput.tokenMaxB,
                },
            ], () => this.ctx.fetcher.getAccountRentExempt(), ataPayerKey, undefined, // use default
            this.ctx.accountResolverOpts.allowPDAOwnerAddress, this.ctx.accountResolverOpts.createWrappedSolAccountMethod);
            const { address: ataAddrA, ...tokenOwnerAccountAIx } = ataA;
            const { address: ataAddrB, ...tokenOwnerAccountBIx } = ataB;
            tokenOwnerAccountA = ataAddrA;
            tokenOwnerAccountB = ataAddrB;
            txBuilder.addInstruction(tokenOwnerAccountAIx);
            txBuilder.addInstruction(tokenOwnerAccountBIx);
        }
        else {
            tokenOwnerAccountA = (0, spl_token_1.getAssociatedTokenAddressSync)(yevefi.tokenMintA, sourceWalletKey, this.ctx.accountResolverOpts.allowPDAOwnerAddress);
            tokenOwnerAccountB = (0, spl_token_1.getAssociatedTokenAddressSync)(yevefi.tokenMintB, sourceWalletKey, this.ctx.accountResolverOpts.allowPDAOwnerAddress);
        }
        const positionTokenAccount = (0, spl_token_1.getAssociatedTokenAddressSync)(this.data.positionMint, positionWalletKey, this.ctx.accountResolverOpts.allowPDAOwnerAddress);
        const increaseIx = (0, instructions_1.increaseLiquidityIx)(this.ctx.program, {
            ...liquidityInput,
            yevefi: this.data.yevefi,
            position: this.address,
            positionTokenAccount,
            tokenOwnerAccountA,
            tokenOwnerAccountB,
            tokenVaultA: yevefi.tokenVaultA,
            tokenVaultB: yevefi.tokenVaultB,
            tickArrayLower: public_1.PDAUtil.getTickArray(this.ctx.program.programId, this.data.yevefi, public_1.TickUtil.getStartTickIndex(this.data.tickLowerIndex, yevefi.tickSpacing)).publicKey,
            tickArrayUpper: public_1.PDAUtil.getTickArray(this.ctx.program.programId, this.data.yevefi, public_1.TickUtil.getStartTickIndex(this.data.tickUpperIndex, yevefi.tickSpacing)).publicKey,
            positionAuthority: positionWalletKey,
        });
        txBuilder.addInstruction(increaseIx);
        return txBuilder;
    }
    async decreaseLiquidity(liquidityInput, resolveATA = true, sourceWallet, positionWallet, ataPayer) {
        const sourceWalletKey = sourceWallet
            ? common_sdk_1.AddressUtil.toPubKey(sourceWallet)
            : this.ctx.wallet.publicKey;
        const positionWalletKey = positionWallet
            ? common_sdk_1.AddressUtil.toPubKey(positionWallet)
            : this.ctx.wallet.publicKey;
        const ataPayerKey = ataPayer
            ? common_sdk_1.AddressUtil.toPubKey(ataPayer)
            : this.ctx.wallet.publicKey;
        const yevefi = await this.ctx.fetcher.getPool(this.data.yevefi, fetcher_1.IGNORE_CACHE);
        if (!yevefi) {
            throw new Error("Unable to fetch yevefi for this position.");
        }
        const txBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        let tokenOwnerAccountA;
        let tokenOwnerAccountB;
        if (resolveATA) {
            const [ataA, ataB] = await (0, common_sdk_1.resolveOrCreateATAs)(this.ctx.connection, sourceWalletKey, [{ tokenMint: yevefi.tokenMintA }, { tokenMint: yevefi.tokenMintB }], () => this.ctx.fetcher.getAccountRentExempt(), ataPayerKey, undefined, // use default
            this.ctx.accountResolverOpts.allowPDAOwnerAddress, this.ctx.accountResolverOpts.createWrappedSolAccountMethod);
            const { address: ataAddrA, ...tokenOwnerAccountAIx } = ataA;
            const { address: ataAddrB, ...tokenOwnerAccountBIx } = ataB;
            tokenOwnerAccountA = ataAddrA;
            tokenOwnerAccountB = ataAddrB;
            txBuilder.addInstruction(tokenOwnerAccountAIx);
            txBuilder.addInstruction(tokenOwnerAccountBIx);
        }
        else {
            tokenOwnerAccountA = (0, spl_token_1.getAssociatedTokenAddressSync)(yevefi.tokenMintA, sourceWalletKey, this.ctx.accountResolverOpts.allowPDAOwnerAddress);
            tokenOwnerAccountB = (0, spl_token_1.getAssociatedTokenAddressSync)(yevefi.tokenMintB, sourceWalletKey, this.ctx.accountResolverOpts.allowPDAOwnerAddress);
        }
        const decreaseIx = (0, instructions_1.decreaseLiquidityIx)(this.ctx.program, {
            ...liquidityInput,
            yevefi: this.data.yevefi,
            position: this.address,
            positionTokenAccount: (0, spl_token_1.getAssociatedTokenAddressSync)(this.data.positionMint, positionWalletKey, this.ctx.accountResolverOpts.allowPDAOwnerAddress),
            tokenOwnerAccountA,
            tokenOwnerAccountB,
            tokenVaultA: yevefi.tokenVaultA,
            tokenVaultB: yevefi.tokenVaultB,
            tickArrayLower: public_1.PDAUtil.getTickArray(this.ctx.program.programId, this.data.yevefi, public_1.TickUtil.getStartTickIndex(this.data.tickLowerIndex, yevefi.tickSpacing)).publicKey,
            tickArrayUpper: public_1.PDAUtil.getTickArray(this.ctx.program.programId, this.data.yevefi, public_1.TickUtil.getStartTickIndex(this.data.tickUpperIndex, yevefi.tickSpacing)).publicKey,
            positionAuthority: positionWalletKey,
        });
        txBuilder.addInstruction(decreaseIx);
        return txBuilder;
    }
    async collectFees(updateFeesAndRewards = true, ownerTokenAccountMap, destinationWallet, positionWallet, ataPayer, opts = fetcher_1.PREFER_CACHE) {
        const [destinationWalletKey, positionWalletKey, ataPayerKey] = common_sdk_1.AddressUtil.toPubKeys([
            destinationWallet ?? this.ctx.wallet.publicKey,
            positionWallet ?? this.ctx.wallet.publicKey,
            ataPayer ?? this.ctx.wallet.publicKey,
        ]);
        const yevefi = await this.ctx.fetcher.getPool(this.data.yevefi, opts);
        if (!yevefi) {
            throw new Error(`Unable to fetch yevefi (${this.data.yevefi}) for this position (${this.address}).`);
        }
        const txBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        const accountExemption = await this.ctx.fetcher.getAccountRentExempt();
        let ataMap = { ...ownerTokenAccountMap };
        if (!ownerTokenAccountMap) {
            const affliatedMints = (0, yevefi_ata_utils_1.getTokenMintsFromYevefis)([yevefi], yevefi_ata_utils_1.TokenMintTypes.POOL_ONLY);
            const { ataTokenAddresses: affliatedTokenAtaMap, resolveAtaIxs } = await (0, yevefi_ata_utils_1.resolveAtaForMints)(this.ctx, {
                mints: affliatedMints.mintMap,
                accountExemption,
                receiver: destinationWalletKey,
                payer: ataPayerKey,
            });
            txBuilder.addInstructions(resolveAtaIxs);
            if (affliatedMints.hasNativeMint) {
                const { address: wSOLAta, ...resolveWSolIx } = common_sdk_1.TokenUtil.createWrappedNativeAccountInstruction(destinationWalletKey, common_sdk_1.ZERO, accountExemption, ataPayerKey, destinationWalletKey, this.ctx.accountResolverOpts.createWrappedSolAccountMethod);
                affliatedTokenAtaMap[spl_token_1.NATIVE_MINT.toBase58()] = wSOLAta;
                txBuilder.addInstruction(resolveWSolIx);
            }
            ataMap = { ...affliatedTokenAtaMap };
        }
        const tokenOwnerAccountA = ataMap[yevefi.tokenMintA.toBase58()];
        (0, tiny_invariant_1.default)(!!tokenOwnerAccountA, `No owner token account provided for wallet ${destinationWalletKey.toBase58()} for token A ${yevefi.tokenMintA.toBase58()} `);
        const tokenOwnerAccountB = ataMap[yevefi.tokenMintB.toBase58()];
        (0, tiny_invariant_1.default)(!!tokenOwnerAccountB, `No owner token account provided for wallet ${destinationWalletKey.toBase58()} for token B ${yevefi.tokenMintB.toBase58()} `);
        const positionTokenAccount = (0, spl_token_1.getAssociatedTokenAddressSync)(this.data.positionMint, positionWalletKey, this.ctx.accountResolverOpts.allowPDAOwnerAddress);
        if (updateFeesAndRewards && !this.data.liquidity.isZero()) {
            const updateIx = await this.updateFeesAndRewards();
            txBuilder.addInstruction(updateIx);
        }
        const ix = (0, instructions_1.collectFeesIx)(this.ctx.program, {
            yevefi: this.data.yevefi,
            position: this.address,
            positionTokenAccount,
            tokenOwnerAccountA: common_sdk_1.AddressUtil.toPubKey(tokenOwnerAccountA),
            tokenOwnerAccountB: common_sdk_1.AddressUtil.toPubKey(tokenOwnerAccountB),
            tokenVaultA: yevefi.tokenVaultA,
            tokenVaultB: yevefi.tokenVaultB,
            positionAuthority: positionWalletKey,
        });
        txBuilder.addInstruction(ix);
        return txBuilder;
    }
    async collectRewards(rewardsToCollect, updateFeesAndRewards = true, ownerTokenAccountMap, destinationWallet, positionWallet, ataPayer, opts = fetcher_1.IGNORE_CACHE) {
        const [destinationWalletKey, positionWalletKey, ataPayerKey] = common_sdk_1.AddressUtil.toPubKeys([
            destinationWallet ?? this.ctx.wallet.publicKey,
            positionWallet ?? this.ctx.wallet.publicKey,
            ataPayer ?? this.ctx.wallet.publicKey,
        ]);
        const yevefi = await this.ctx.fetcher.getPool(this.data.yevefi, opts);
        if (!yevefi) {
            throw new Error(`Unable to fetch yevefi(${this.data.yevefi}) for this position(${this.address}).`);
        }
        const initializedRewards = yevefi.rewardInfos.filter((info) => public_1.PoolUtil.isRewardInitialized(info));
        const txBuilder = new common_sdk_1.TransactionBuilder(this.ctx.provider.connection, this.ctx.provider.wallet, this.ctx.txBuilderOpts);
        const accountExemption = await this.ctx.fetcher.getAccountRentExempt();
        let ataMap = { ...ownerTokenAccountMap };
        if (!ownerTokenAccountMap) {
            const rewardMints = (0, yevefi_ata_utils_1.getTokenMintsFromYevefis)([yevefi], yevefi_ata_utils_1.TokenMintTypes.REWARD_ONLY);
            const { ataTokenAddresses: affliatedTokenAtaMap, resolveAtaIxs } = await (0, yevefi_ata_utils_1.resolveAtaForMints)(this.ctx, {
                mints: rewardMints.mintMap,
                accountExemption,
                receiver: destinationWalletKey,
                payer: ataPayerKey,
            });
            if (rewardMints.hasNativeMint) {
                const { address: wSOLAta, ...resolveWSolIx } = common_sdk_1.TokenUtil.createWrappedNativeAccountInstruction(destinationWalletKey, common_sdk_1.ZERO, accountExemption, ataPayerKey, destinationWalletKey, this.ctx.accountResolverOpts.createWrappedSolAccountMethod);
                affliatedTokenAtaMap[spl_token_1.NATIVE_MINT.toBase58()] = wSOLAta;
                txBuilder.addInstruction(resolveWSolIx);
            }
            txBuilder.addInstructions(resolveAtaIxs);
            ataMap = { ...affliatedTokenAtaMap };
        }
        const positionTokenAccount = (0, spl_token_1.getAssociatedTokenAddressSync)(this.data.positionMint, positionWalletKey, this.ctx.accountResolverOpts.allowPDAOwnerAddress);
        if (updateFeesAndRewards && !this.data.liquidity.isZero()) {
            const updateIx = await this.updateFeesAndRewards();
            txBuilder.addInstruction(updateIx);
        }
        initializedRewards.forEach((info, index) => {
            if (rewardsToCollect &&
                !rewardsToCollect.some((r) => r.toString() === info.mint.toBase58())) {
                // If rewardsToCollect is specified and this reward is not in it,
                // don't include collectIX for that in TX
                return;
            }
            const rewardOwnerAccount = ataMap[info.mint.toBase58()];
            (0, tiny_invariant_1.default)(!!rewardOwnerAccount, `No owner token account provided for wallet ${destinationWalletKey.toBase58()} for reward ${index} token ${info.mint.toBase58()} `);
            const ix = (0, instructions_1.collectRewardIx)(this.ctx.program, {
                yevefi: this.data.yevefi,
                position: this.address,
                positionTokenAccount,
                rewardIndex: index,
                rewardOwnerAccount: common_sdk_1.AddressUtil.toPubKey(rewardOwnerAccount),
                rewardVault: info.vault,
                positionAuthority: positionWalletKey,
            });
            txBuilder.addInstruction(ix);
        });
        return txBuilder;
    }
    async refresh() {
        const positionAccount = await this.ctx.fetcher.getPosition(this.address, fetcher_1.IGNORE_CACHE);
        if (positionAccount) {
            this.data = positionAccount;
        }
        const yevefiAccount = await this.ctx.fetcher.getPool(this.data.yevefi, fetcher_1.IGNORE_CACHE);
        if (yevefiAccount) {
            this.yevefiData = yevefiAccount;
        }
        const [lowerTickArray, upperTickArray] = await (0, position_builder_util_1.getTickArrayDataForPosition)(this.ctx, this.data, this.yevefiData, fetcher_1.IGNORE_CACHE);
        if (lowerTickArray) {
            this.lowerTickArrayData = lowerTickArray;
        }
        if (upperTickArray) {
            this.upperTickArrayData = upperTickArray;
        }
    }
    async updateFeesAndRewards() {
        const yevefi = await this.ctx.fetcher.getPool(this.data.yevefi);
        if (!yevefi) {
            throw new Error(`Unable to fetch yevefi(${this.data.yevefi}) for this position(${this.address}).`);
        }
        const [tickArrayLowerPda, tickArrayUpperPda] = [
            this.data.tickLowerIndex,
            this.data.tickUpperIndex,
        ].map((tickIndex) => public_1.PDAUtil.getTickArrayFromTickIndex(tickIndex, yevefi.tickSpacing, this.data.yevefi, this.ctx.program.programId));
        const updateIx = (0, instructions_1.updateFeesAndRewardsIx)(this.ctx.program, {
            yevefi: this.data.yevefi,
            position: this.address,
            tickArrayLower: tickArrayLowerPda.publicKey,
            tickArrayUpper: tickArrayUpperPda.publicKey,
        });
        return updateIx;
    }
}
exports.PositionImpl = PositionImpl;
