use anchor_lang::prelude::*;

use crate::state::{Yevefi, YevefisConfig};

#[derive(Accounts)]
pub struct SetFeeRate<'info> {
    pub yevefis_config: Account<'info, YevefisConfig>,

    #[account(mut, has_one = yevefis_config)]
    pub yevefi: Account<'info, Yevefi>,

    #[account(address = yevefis_config.fee_authority)]
    pub fee_authority: Signer<'info>,
}

pub fn handler(ctx: Context<SetFeeRate>, fee_rate: u16) -> Result<()> {
    ctx.accounts.yevefi.update_fee_rate(fee_rate)
}
