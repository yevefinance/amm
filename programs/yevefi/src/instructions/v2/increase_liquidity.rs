use anchor_lang::prelude::*;
use anchor_spl::memo::Memo;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::errors::ErrorCode;
use crate::manager::liquidity_manager::{
    calculate_liquidity_token_deltas, calculate_modify_liquidity, sync_modify_liquidity_values,
};
use crate::math::convert_to_liquidity_delta;
use crate::state::*;
use crate::util::{
    calculate_transfer_fee_included_amount, parse_remaining_accounts, AccountsType,
    RemainingAccountsInfo,
};
use crate::util::{
    to_timestamp_u64, v2::transfer_from_owner_to_vault_v2, verify_position_authority_interface,
};

#[derive(Accounts)]
pub struct ModifyLiquidityV2<'info> {
    #[account(mut)]
    pub yevefi: Account<'info, Yevefi>,

    #[account(address = *token_mint_a.to_account_info().owner)]
    pub token_program_a: Interface<'info, TokenInterface>,
    #[account(address = *token_mint_b.to_account_info().owner)]
    pub token_program_b: Interface<'info, TokenInterface>,

    pub memo_program: Program<'info, Memo>,

    pub position_authority: Signer<'info>,

    #[account(mut, has_one = yevefi)]
    pub position: Account<'info, Position>,
    #[account(
        constraint = position_token_account.mint == position.position_mint,
        constraint = position_token_account.amount == 1
    )]
    pub position_token_account: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(address = yevefi.token_mint_a)]
    pub token_mint_a: InterfaceAccount<'info, Mint>,
    #[account(address = yevefi.token_mint_b)]
    pub token_mint_b: InterfaceAccount<'info, Mint>,

    #[account(mut, constraint = token_owner_account_a.mint == yevefi.token_mint_a)]
    pub token_owner_account_a: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, constraint = token_owner_account_b.mint == yevefi.token_mint_b)]
    pub token_owner_account_b: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut, constraint = token_vault_a.key() == yevefi.token_vault_a)]
    pub token_vault_a: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, constraint = token_vault_b.key() == yevefi.token_vault_b)]
    pub token_vault_b: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut, has_one = yevefi)]
    pub tick_array_lower: AccountLoader<'info, TickArray>,
    #[account(mut, has_one = yevefi)]
    pub tick_array_upper: AccountLoader<'info, TickArray>,
    // remaining accounts
    // - accounts for transfer hook program of token_mint_a
    // - accounts for transfer hook program of token_mint_b
}

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, ModifyLiquidityV2<'info>>,
    liquidity_amount: u128,
    token_max_a: u64,
    token_max_b: u64,
    remaining_accounts_info: Option<RemainingAccountsInfo>,
) -> Result<()> {
    verify_position_authority_interface(
        &ctx.accounts.position_token_account,
        &ctx.accounts.position_authority,
    )?;

    let clock = Clock::get()?;

    if liquidity_amount == 0 {
        return Err(ErrorCode::LiquidityZero.into());
    }

    // Process remaining accounts
    let remaining_accounts = parse_remaining_accounts(
        ctx.remaining_accounts,
        &remaining_accounts_info,
        &[AccountsType::TransferHookA, AccountsType::TransferHookB],
    )?;

    let liquidity_delta = convert_to_liquidity_delta(liquidity_amount, true)?;
    let timestamp = to_timestamp_u64(clock.unix_timestamp)?;

    let update = calculate_modify_liquidity(
        &ctx.accounts.yevefi,
        &ctx.accounts.position,
        &ctx.accounts.tick_array_lower,
        &ctx.accounts.tick_array_upper,
        liquidity_delta,
        timestamp,
    )?;

    sync_modify_liquidity_values(
        &mut ctx.accounts.yevefi,
        &mut ctx.accounts.position,
        &ctx.accounts.tick_array_lower,
        &ctx.accounts.tick_array_upper,
        update,
        timestamp,
    )?;

    let (delta_a, delta_b) = calculate_liquidity_token_deltas(
        ctx.accounts.yevefi.tick_current_index,
        ctx.accounts.yevefi.sqrt_price,
        &ctx.accounts.position,
        liquidity_delta,
    )?;

    let transfer_fee_included_delta_a =
        calculate_transfer_fee_included_amount(&ctx.accounts.token_mint_a, delta_a)?;
    let transfer_fee_included_delta_b =
        calculate_transfer_fee_included_amount(&ctx.accounts.token_mint_b, delta_b)?;

    // token_max_a and token_max_b should be applied to the transfer fee included amount
    if transfer_fee_included_delta_a.amount > token_max_a {
        return Err(ErrorCode::TokenMaxExceeded.into());
    }
    if transfer_fee_included_delta_b.amount > token_max_b {
        return Err(ErrorCode::TokenMaxExceeded.into());
    }

    transfer_from_owner_to_vault_v2(
        &ctx.accounts.position_authority,
        &ctx.accounts.token_mint_a,
        &ctx.accounts.token_owner_account_a,
        &ctx.accounts.token_vault_a,
        &ctx.accounts.token_program_a,
        &ctx.accounts.memo_program,
        &remaining_accounts.transfer_hook_a,
        transfer_fee_included_delta_a.amount,
    )?;

    transfer_from_owner_to_vault_v2(
        &ctx.accounts.position_authority,
        &ctx.accounts.token_mint_b,
        &ctx.accounts.token_owner_account_b,
        &ctx.accounts.token_vault_b,
        &ctx.accounts.token_program_b,
        &ctx.accounts.memo_program,
        &remaining_accounts.transfer_hook_b,
        transfer_fee_included_delta_b.amount,
    )?;

    Ok(())
}
