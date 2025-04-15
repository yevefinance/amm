use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

#[derive(Accounts)]
pub struct DeleteTokenBadge<'info> {
    pub yevefis_config: Box<Account<'info, YevefisConfig>>,

    #[account(has_one = yevefis_config)]
    pub yevefis_config_extension: Box<Account<'info, YevefisConfigExtension>>,

    #[account(address = yevefis_config_extension.token_badge_authority)]
    pub token_badge_authority: Signer<'info>,

    pub token_mint: InterfaceAccount<'info, Mint>,

    #[account(
      mut,
      seeds = [
        b"token_badge",
        yevefis_config.key().as_ref(),
        token_mint.key().as_ref(),
      ],
      bump,
      has_one = yevefis_config,
      close = receiver
    )]
    pub token_badge: Account<'info, TokenBadge>,

    /// CHECK: safe, for receiving rent only
    #[account(mut)]
    pub receiver: UncheckedAccount<'info>,
}

pub fn handler(_ctx: Context<DeleteTokenBadge>) -> Result<()> {
    Ok(())
}
