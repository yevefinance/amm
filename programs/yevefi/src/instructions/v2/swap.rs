use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};
use anchor_spl::memo::Memo;

use crate::util::{calculate_transfer_fee_excluded_amount, calculate_transfer_fee_included_amount, parse_remaining_accounts, AccountsType, RemainingAccountsInfo};
use crate::{
    errors::ErrorCode,
    manager::swap_manager::*,
    state::{TickArray, Yevefi},
    util::{to_timestamp_u64, v2::update_and_swap_yevefi_v2, SwapTickSequence},
    constants::transfer_memo,
};

#[derive(Accounts)]
pub struct SwapV2<'info> {
    #[account(address = token_mint_a.to_account_info().owner.clone())]
    pub token_program_a: Interface<'info, TokenInterface>,
    #[account(address = token_mint_b.to_account_info().owner.clone())]
    pub token_program_b: Interface<'info, TokenInterface>,

    pub memo_program: Program<'info, Memo>,

    pub token_authority: Signer<'info>,

    #[account(mut)]
    pub yevefi: Box<Account<'info, Yevefi>>,

    #[account(address = yevefi.token_mint_a)]
    pub token_mint_a: InterfaceAccount<'info, Mint>,
    #[account(address = yevefi.token_mint_b)]
    pub token_mint_b: InterfaceAccount<'info, Mint>,
    
    #[account(mut, constraint = token_owner_account_a.mint == yevefi.token_mint_a)]
    pub token_owner_account_a: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, address = yevefi.token_vault_a)]
    pub token_vault_a: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut, constraint = token_owner_account_b.mint == yevefi.token_mint_b)]
    pub token_owner_account_b: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(mut, address = yevefi.token_vault_b)]
    pub token_vault_b: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(mut, has_one = yevefi)]
    pub tick_array_0: AccountLoader<'info, TickArray>,

    #[account(mut, has_one = yevefi)]
    pub tick_array_1: AccountLoader<'info, TickArray>,

    #[account(mut, has_one = yevefi)]
    pub tick_array_2: AccountLoader<'info, TickArray>,

    #[account(mut, seeds = [b"oracle", yevefi.key().as_ref()], bump)]
    /// CHECK: Oracle is currently unused and will be enabled on subsequent updates
    pub oracle: UncheckedAccount<'info>,

    // remaining accounts
    // - accounts for transfer hook program of token_mint_a
    // - accounts for transfer hook program of token_mint_b
}

pub fn handler<'a, 'b, 'c, 'info>(
    ctx: Context<'a, 'b, 'c, 'info, SwapV2<'info>>,
    amount: u64,
    other_amount_threshold: u64,
    sqrt_price_limit: u128,
    amount_specified_is_input: bool,
    a_to_b: bool, // Zero for one
    remaining_accounts_info: Option<RemainingAccountsInfo>,
) -> Result<()> {
    let yevefi = &mut ctx.accounts.yevefi;
    let clock = Clock::get()?;
    // Update the global reward growth which increases as a function of time.
    let timestamp = to_timestamp_u64(clock.unix_timestamp)?;

    // Process remaining accounts
    let remaining_accounts = parse_remaining_accounts(
        &ctx.remaining_accounts,
        &remaining_accounts_info,
        &[
            AccountsType::TransferHookA,
            AccountsType::TransferHookB,
        ],
    )?;

    let mut swap_tick_sequence = SwapTickSequence::new(
        ctx.accounts.tick_array_0.load_mut().unwrap(),
        ctx.accounts.tick_array_1.load_mut().ok(),
        ctx.accounts.tick_array_2.load_mut().ok(),
    );

    let swap_update = swap_with_transfer_fee_extension(
        &yevefi,
        &ctx.accounts.token_mint_a,
        &ctx.accounts.token_mint_b,
        &mut swap_tick_sequence,
        amount,
        sqrt_price_limit,
        amount_specified_is_input,
        a_to_b,
        timestamp,
    )?;

    if amount_specified_is_input {
        let transfer_fee_excluded_output_amount = if a_to_b {
            calculate_transfer_fee_excluded_amount(
                &ctx.accounts.token_mint_b,
                swap_update.amount_b
            )?.amount
        } else {
            calculate_transfer_fee_excluded_amount(
                &ctx.accounts.token_mint_a,
                swap_update.amount_a
            )?.amount
        };
        if transfer_fee_excluded_output_amount < other_amount_threshold {
            return Err(ErrorCode::AmountOutBelowMinimum.into());
        }
    } else {
        let transfer_fee_included_input_amount = if a_to_b {
            swap_update.amount_a
        } else {
            swap_update.amount_b
        };
        if transfer_fee_included_input_amount > other_amount_threshold {
            return Err(ErrorCode::AmountInAboveMaximum.into());
        }
    }

    update_and_swap_yevefi_v2(
        yevefi,
        &ctx.accounts.token_authority,
        &ctx.accounts.token_mint_a,
        &ctx.accounts.token_mint_b,
        &ctx.accounts.token_owner_account_a,
        &ctx.accounts.token_owner_account_b,
        &ctx.accounts.token_vault_a,
        &ctx.accounts.token_vault_b,
        &remaining_accounts.transfer_hook_a,
        &remaining_accounts.transfer_hook_b,
        &ctx.accounts.token_program_a,
        &ctx.accounts.token_program_b,
        &ctx.accounts.memo_program,
        swap_update,
        a_to_b,
        timestamp,
        transfer_memo::TRANSFER_MEMO_SWAP.as_bytes(),
    )
}

pub fn swap_with_transfer_fee_extension<'info>(
    yevefi: &Yevefi,
    token_mint_a: &InterfaceAccount<'info, Mint>,
    token_mint_b: &InterfaceAccount<'info, Mint>,
    swap_tick_sequence: &mut SwapTickSequence,
    amount: u64,
    sqrt_price_limit: u128,
    amount_specified_is_input: bool,
    a_to_b: bool,
    timestamp: u64,
) -> Result<PostSwapUpdate> {
    let (input_token_mint, output_token_mint) = if a_to_b {
        (token_mint_a, token_mint_b)
    } else {
        (token_mint_b, token_mint_a)
    };

    // ExactIn
    if amount_specified_is_input {
        let transfer_fee_included_input = amount;
        let transfer_fee_excluded_input = calculate_transfer_fee_excluded_amount(
            input_token_mint,
            transfer_fee_included_input
        )?.amount;

        let swap_update = swap(
            yevefi,
            swap_tick_sequence,
            transfer_fee_excluded_input,
            sqrt_price_limit,
            amount_specified_is_input,
            a_to_b,
            timestamp,
        )?;

        let (swap_update_amount_input, swap_update_amount_output) = if a_to_b {
            (swap_update.amount_a, swap_update.amount_b)
        } else {
            (swap_update.amount_b, swap_update.amount_a)
        };

        let fullfilled = swap_update_amount_input == transfer_fee_excluded_input;

        let adjusted_transfer_fee_included_input = if fullfilled {
            transfer_fee_included_input
        } else {
            calculate_transfer_fee_included_amount(
                input_token_mint,
                swap_update_amount_input
            )?.amount
        };

        let transfer_fee_included_output = swap_update_amount_output;

        let (amount_a, amount_b) = if a_to_b {
            (adjusted_transfer_fee_included_input, transfer_fee_included_output)
        } else {
            (transfer_fee_included_output, adjusted_transfer_fee_included_input)
        };
        return Ok(PostSwapUpdate {
            amount_a, // updated (transfer fee included)
            amount_b, // updated (transfer fee included)
            next_liquidity: swap_update.next_liquidity,
            next_tick_index: swap_update.next_tick_index,
            next_sqrt_price: swap_update.next_sqrt_price,
            next_fee_growth_global: swap_update.next_fee_growth_global,
            next_reward_infos: swap_update.next_reward_infos,
            next_protocol_fee: swap_update.next_protocol_fee,
        });
    }

    // ExactOut
    let transfer_fee_excluded_output = amount;
    let transfer_fee_included_output = calculate_transfer_fee_included_amount(
        output_token_mint,
        transfer_fee_excluded_output
    )?.amount;

    let swap_update = swap(
        yevefi,
        swap_tick_sequence,
        transfer_fee_included_output,
        sqrt_price_limit,
        amount_specified_is_input,
        a_to_b,
        timestamp,
    )?;

    let (swap_update_amount_input, swap_update_amount_output) = if a_to_b {
        (swap_update.amount_a, swap_update.amount_b)
    } else {
        (swap_update.amount_b, swap_update.amount_a)
    };

    let transfer_fee_included_input = calculate_transfer_fee_included_amount(
        input_token_mint,
        swap_update_amount_input
    )?.amount;

    let adjusted_transfer_fee_included_output = swap_update_amount_output;

    let (amount_a, amount_b) = if a_to_b {
        (transfer_fee_included_input, adjusted_transfer_fee_included_output)
    } else {
        (adjusted_transfer_fee_included_output, transfer_fee_included_input)
    };
    Ok(PostSwapUpdate {
        amount_a, // updated (transfer fee included)
        amount_b, // updated (transfer fee included)
        next_liquidity: swap_update.next_liquidity,
        next_tick_index: swap_update.next_tick_index,
        next_sqrt_price: swap_update.next_sqrt_price,
        next_fee_growth_global: swap_update.next_fee_growth_global,
        next_reward_infos: swap_update.next_reward_infos,
        next_protocol_fee: swap_update.next_protocol_fee,
    })    
}
