use anchor_lang::prelude::*;

use crate::state::{Yevefi, YevefisConfig};

#[derive(Accounts)]
#[instruction(reward_index: u8)]
pub struct SetRewardAuthorityBySuperAuthority<'info> {
    pub yevefis_config: Account<'info, YevefisConfig>,

    #[account(mut, has_one = yevefis_config)]
    pub yevefi: Account<'info, Yevefi>,

    #[account(address = yevefis_config.reward_emissions_super_authority)]
    pub reward_emissions_super_authority: Signer<'info>,

    /// CHECK: safe, the account that will be new authority can be arbitrary
    pub new_reward_authority: UncheckedAccount<'info>,
}

/// Set the yevefi reward authority at the provided `reward_index`.
/// Only the current reward emissions super authority has permission to invoke this instruction.
pub fn handler(ctx: Context<SetRewardAuthorityBySuperAuthority>, reward_index: u8) -> Result<()> {
    ctx.accounts.yevefi.update_reward_authority(
        reward_index as usize,
        ctx.accounts.new_reward_authority.key(),
    )
}
