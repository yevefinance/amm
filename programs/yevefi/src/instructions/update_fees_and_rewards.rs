use anchor_lang::prelude::*;

use crate::{
    manager::liquidity_manager::calculate_fee_and_reward_growths, state::*, util::to_timestamp_u64,
};

#[derive(Accounts)]
pub struct UpdateFeesAndRewards<'info> {
    #[account(mut)]
    pub yevefi: Account<'info, Yevefi>,

    #[account(mut, has_one = yevefi)]
    pub position: Account<'info, Position>,

    #[account(has_one = yevefi)]
    pub tick_array_lower: AccountLoader<'info, TickArray>,
    #[account(has_one = yevefi)]
    pub tick_array_upper: AccountLoader<'info, TickArray>,
}

pub fn handler(ctx: Context<UpdateFeesAndRewards>) -> Result<()> {
    let yevefi = &mut ctx.accounts.yevefi;
    let position = &mut ctx.accounts.position;
    let clock = Clock::get()?;
    let timestamp = to_timestamp_u64(clock.unix_timestamp)?;

    let (position_update, reward_infos) = calculate_fee_and_reward_growths(
        yevefi,
        position,
        &ctx.accounts.tick_array_lower,
        &ctx.accounts.tick_array_upper,
        timestamp,
    )?;

    yevefi.update_rewards(reward_infos, timestamp);
    position.update(&position_update);

    Ok(())
}
