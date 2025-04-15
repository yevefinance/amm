use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::metadata::Metadata;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::state;
use crate::{state::*, util::mint_position_token_with_metadata_and_remove_authority};

use crate::constants::nft::yevefi_nft_update_auth::ID as TK_NFT_UPDATE_AUTH;

#[derive(Accounts)]
pub struct OpenPositionWithMetadata<'info> {
    #[account(mut)]
    pub funder: Signer<'info>,

    /// CHECK: safe, the account that will be the owner of the position can be arbitrary
    pub owner: UncheckedAccount<'info>,

    #[account(init,
      payer = funder,
      space = Position::LEN,
      seeds = [b"position".as_ref(), position_mint.key().as_ref()],
      bump,
    )]
    pub position: Box<Account<'info, Position>>,

    #[account(init,
        payer = funder,
        mint::authority = yevefi,
        mint::decimals = 0,
    )]
    pub position_mint: Account<'info, Mint>,

    /// CHECK: checked via the Metadata CPI call
    /// https://github.com/metaplex-foundation/metaplex-program-library/blob/master/token-metadata/program/src/utils.rs#L873
    #[account(mut)]
    pub position_metadata_account: UncheckedAccount<'info>,

    #[account(init,
      payer = funder,
      associated_token::mint = position_mint,
      associated_token::authority = owner,
    )]
    pub position_token_account: Box<Account<'info, TokenAccount>>,

    pub yevefi: Box<Account<'info, Yevefi>>,

    #[account(address = token::ID)]
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub associated_token_program: Program<'info, AssociatedToken>,

    pub metadata_program: Program<'info, Metadata>,

    /// CHECK: checked via account constraints
    #[account(address = TK_NFT_UPDATE_AUTH)]
    pub metadata_update_auth: UncheckedAccount<'info>,
}

/*
  Opens a new Yevefi Position with Metadata account.
*/
pub fn handler(
    ctx: Context<OpenPositionWithMetadata>,
    // derive(Accounts) generates OpenPositionWithMetadataBumps, so we need to clarify which one we want to use.
    _bumps: state::OpenPositionWithMetadataBumps,
    tick_lower_index: i32,
    tick_upper_index: i32,
) -> Result<()> {
    let yevefi = &ctx.accounts.yevefi;
    let position_mint = &ctx.accounts.position_mint;
    let position = &mut ctx.accounts.position;

    position.open_position(
        yevefi,
        position_mint.key(),
        tick_lower_index,
        tick_upper_index,
    )?;

    mint_position_token_with_metadata_and_remove_authority(
        yevefi,
        position_mint,
        &ctx.accounts.position_token_account,
        &ctx.accounts.position_metadata_account,
        &ctx.accounts.metadata_update_auth,
        &ctx.accounts.funder,
        &ctx.accounts.metadata_program,
        &ctx.accounts.token_program,
        &ctx.accounts.system_program,
        &ctx.accounts.rent,
    )
}
