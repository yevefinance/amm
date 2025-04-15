use anchor_lang::prelude::*;

use crate::state::YevefisConfig;

#[derive(Accounts)]
pub struct SetRewardEmissionsSuperAuthority<'info> {
    #[account(mut)]
    pub yevefis_config: Account<'info, YevefisConfig>,

    #[account(address = yevefis_config.reward_emissions_super_authority)]
    pub reward_emissions_super_authority: Signer<'info>,

    /// CHECK: safe, the account that will be new authority can be arbitrary
    pub new_reward_emissions_super_authority: UncheckedAccount<'info>,
}

pub fn handler(ctx: Context<SetRewardEmissionsSuperAuthority>) -> Result<()> {
    ctx.accounts
        .yevefis_config
        .update_reward_emissions_super_authority(
            ctx.accounts.new_reward_emissions_super_authority.key(),
        );
    Ok(())
}
