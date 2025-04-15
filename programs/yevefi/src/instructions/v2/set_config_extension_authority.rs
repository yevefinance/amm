use anchor_lang::prelude::*;

use crate::state::{YevefisConfig, YevefisConfigExtension};

#[derive(Accounts)]
pub struct SetConfigExtensionAuthority<'info> {
    pub yevefis_config: Box<Account<'info, YevefisConfig>>,

    #[account(mut, has_one = yevefis_config)]
    pub yevefis_config_extension: Account<'info, YevefisConfigExtension>,

    #[account(address = yevefis_config_extension.config_extension_authority)]
    pub config_extension_authority: Signer<'info>,

    /// CHECK: safe, the account that will be new authority can be arbitrary
    pub new_config_extension_authority: UncheckedAccount<'info>,
}

/// Set the config extension authority. Only the current config extension authority has permission to invoke this instruction.
pub fn handler(ctx: Context<SetConfigExtensionAuthority>) -> Result<()> {
    ctx.accounts
        .yevefis_config_extension
        .update_config_extension_authority(ctx.accounts.new_config_extension_authority.key());
    Ok(())
}
