use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

use crate::{
    errors::ErrorCode,
    state::Yevefi,
    util::{is_token_badge_initialized, v2::is_supported_token_mint},
};

#[derive(Accounts)]
#[instruction(reward_index: u8)]
pub struct InitializeRewardV2<'info> {
    #[account(address = yevefi.reward_infos[reward_index as usize].authority)]
    pub reward_authority: Signer<'info>,

    #[account(mut)]
    pub funder: Signer<'info>,

    #[account(mut)]
    pub yevefi: Box<Account<'info, Yevefi>>,

    pub reward_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(seeds = [b"token_badge", yevefi.yevefis_config.as_ref(), reward_mint.key().as_ref()], bump)]
    /// CHECK: checked in the handler
    pub reward_token_badge: UncheckedAccount<'info>,

    #[account(
        init,
        payer = funder,
        token::token_program = reward_token_program,
        token::mint = reward_mint,
        token::authority = yevefi
    )]
    pub reward_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(address = *reward_mint.to_account_info().owner)]
    pub reward_token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(ctx: Context<InitializeRewardV2>, reward_index: u8) -> Result<()> {
    let yevefi = &mut ctx.accounts.yevefi;

    // Don't allow initializing a reward with an unsupported token mint
    let is_token_badge_initialized = is_token_badge_initialized(
        yevefi.yevefis_config,
        ctx.accounts.reward_mint.key(),
        &ctx.accounts.reward_token_badge,
    )?;

    if !is_supported_token_mint(&ctx.accounts.reward_mint, is_token_badge_initialized).unwrap() {
        return Err(ErrorCode::UnsupportedTokenMint.into());
    }

    yevefi.initialize_reward(
        reward_index as usize,
        ctx.accounts.reward_mint.key(),
        ctx.accounts.reward_vault.key(),
    )
}
