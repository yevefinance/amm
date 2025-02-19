use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct TokenBadge {
    pub yevefis_config: Pubkey, // 32
    pub token_mint: Pubkey, // 32
    // 128 RESERVE
}

impl TokenBadge {
    pub const LEN: usize = 8 + 32 + 32 + 128;

    pub fn initialize(
        &mut self,
        yevefis_config: Pubkey,
        token_mint: Pubkey,
    ) -> Result<()> {
        self.yevefis_config = yevefis_config;
        self.token_mint = token_mint;
        Ok(())
    }
}

#[cfg(test)]
mod token_badge_initialize_tests {
    use super::*;
    use std::str::FromStr;

    #[test]
    fn test_default() {
        let token_badge = TokenBadge {
            ..Default::default()
        };
        assert_eq!(token_badge.yevefis_config, Pubkey::default());
        assert_eq!(token_badge.token_mint, Pubkey::default());
    }

    #[test]
    fn test_initialize() {
        let mut token_badge = TokenBadge {
            ..Default::default()
        };
        let yevefis_config = 
            Pubkey::from_str("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ").unwrap();
        let token_mint =
            Pubkey::from_str("orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE").unwrap();

        let result = token_badge.initialize(
            yevefis_config,
            token_mint,
        );
        assert!(result.is_ok());

        assert_eq!(yevefis_config, token_badge.yevefis_config);
        assert_eq!(token_mint, token_badge.token_mint);
    }
}
