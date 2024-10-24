use anchor_lang::prelude::*;

pub mod yevefi_nft_update_auth {
    use super::*;
    declare_id!("DuNGiWTqprnHNpe7KVfmaN8PNmH7RgvXntm6uPLdH2F3");
}

// METADATA_NAME   : max  32 bytes
// METADATA_SYMBOL : max  10 bytes
// METADATA_URI    : max 200 bytes
pub const WP_METADATA_NAME: &str = "YEVE Position";
pub const WP_METADATA_SYMBOL: &str = "YEVEP";
pub const WP_METADATA_URI: &str = "https://bafybeibvr5txrogm43k7gtb52zmda7qikhtrzqyfrjvqz3jpu2ibzteydm.ipfs.w3s.link/position.json";

pub const WPB_METADATA_NAME_PREFIX: &str = "Yeve Position Bundle";
pub const WPB_METADATA_SYMBOL: &str = "YEVEB";
pub const WPB_METADATA_URI: &str =
    "https://bafybeih3uu4lbytpzittsrs5lpcumuqzsfr5lwkl3bj5sr7zrepymvsjhy.ipfs.w3s.link/position-bundle.json";
