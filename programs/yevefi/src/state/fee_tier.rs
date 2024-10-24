use crate::state::YevefisConfig;
use crate::{errors::ErrorCode, math::MAX_FEE_RATE};
use anchor_lang::prelude::*;

#[account]
pub struct FeeTier {
    pub yevefis_config: Pubkey,
    pub tick_spacing: u16,
    pub default_fee_rate: u16,
}

impl FeeTier {
    pub const LEN: usize = 8 + 32 + 4;

    pub fn initialize(
        &mut self,
        yevefis_config: &Account<YevefisConfig>,
        tick_spacing: u16,
        default_fee_rate: u16,
    ) -> Result<()> {
        self.yevefis_config = yevefis_config.key();
        self.tick_spacing = tick_spacing;
        self.update_default_fee_rate(default_fee_rate)?;
        Ok(())
    }

    pub fn update_default_fee_rate(&mut self, default_fee_rate: u16) -> Result<()> {
        if default_fee_rate > MAX_FEE_RATE {
            return Err(ErrorCode::FeeRateMaxExceeded.into());
        }
        self.default_fee_rate = default_fee_rate;

        Ok(())
    }
}
