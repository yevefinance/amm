use anchor_lang::prelude::*;

pub mod yevefi_nft_update_auth {
    use super::*;
    declare_id!("UrZ9FRPZhcKMXUANfQxLNPwZHpQKaKumaxXvdjEP9MH");
}

// Based on Metaplex TokenMetadata
//
// METADATA_NAME   : max  32 bytes
// METADATA_SYMBOL : max  10 bytes
// METADATA_URI    : max 200 bytes
pub const TK_METADATA_NAME: &str = "SOLV3 Position";
pub const TK_METADATA_SYMBOL: &str = "SOLV3P";
pub const TK_METADATA_URI: &str = "https://ipfs.io/ipfs/QmWDxYzCEe3zoabwqNXCxv6NtLwzZLtPy6e94NAUg3q95z";

pub const WPB_METADATA_NAME_PREFIX: &str = "Yeve Position Bundle";
pub const WPB_METADATA_SYMBOL: &str = "SOLV3B";
pub const WPB_METADATA_URI: &str = "https://ipfs.io/ipfs/QmW5Q1RCsGTyWXdYaiJydzh6Yyj5AmDEGPqwRUi5StbMWk";

// Based on Token-2022 TokenMetadata extension
//
// There is no clear upper limit on the length of name, symbol, and uri,
// but it is safe for wallet apps to limit the uri to 128 bytes.
//
// see also: TokenMetadata struct
// https://github.com/solana-labs/solana-program-library/blob/cd6ce4b7709d2420bca60b4656bbd3d15d2e1485/token-metadata/interface/src/state.rs#L25
pub const TK_2022_METADATA_NAME_PREFIX: &str = "SOLV3P";
pub const TK_2022_METADATA_SYMBOL: &str = "SOLV3P";
pub const TK_2022_METADATA_URI_BASE: &str = "https://solve3.fi/meta";
