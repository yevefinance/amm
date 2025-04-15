use anchor_lang::prelude::*;

use crate::state::{YevefisConfig, YevefisConfigExtension};

#[derive(Accounts)]
pub struct SetTokenBadgeAuthority<'info> {
    pub yevefis_config: Box<Account<'info, YevefisConfig>>,

    #[account(mut, has_one = yevefis_config)]
    pub yevefis_config_extension: Account<'info, YevefisConfigExtension>,

    #[account(address = yevefis_config_extension.config_extension_authority)]
    pub config_extension_authority: Signer<'info>,

    /// CHECK: safe, the account that will be new authority can be arbitrary
    pub new_token_badge_authority: UncheckedAccount<'info>,
}

/// Set the token badge authority. Only the config extension authority has permission to invoke this instruction.
pub fn handler(ctx: Context<SetTokenBadgeAuthority>) -> Result<()> {
    ctx.accounts
        .yevefis_config_extension
        .update_token_badge_authority(ctx.accounts.new_token_badge_authority.key());
    Ok(())
}
