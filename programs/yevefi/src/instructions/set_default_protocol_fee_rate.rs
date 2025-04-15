use anchor_lang::prelude::*;

use crate::state::YevefisConfig;

#[derive(Accounts)]
pub struct SetDefaultProtocolFeeRate<'info> {
    #[account(mut)]
    pub yevefis_config: Account<'info, YevefisConfig>,

    #[account(address = yevefis_config.fee_authority)]
    pub fee_authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<SetDefaultProtocolFeeRate>,
    default_protocol_fee_rate: u16,
) -> Result<()> {
    ctx.accounts
        .yevefis_config
        .update_default_protocol_fee_rate(default_protocol_fee_rate)
}
