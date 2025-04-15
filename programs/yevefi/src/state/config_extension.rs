use anchor_lang::prelude::*;

#[account]
pub struct YevefisConfigExtension {
    pub yevefis_config: Pubkey,             // 32
    pub config_extension_authority: Pubkey, // 32
    pub token_badge_authority: Pubkey,      // 32
                                            // 512 RESERVE
}

impl YevefisConfigExtension {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 512;

    pub fn initialize(&mut self, yevefis_config: Pubkey, default_authority: Pubkey) -> Result<()> {
        self.yevefis_config = yevefis_config;
        self.config_extension_authority = default_authority;
        self.token_badge_authority = default_authority;
        Ok(())
    }

    pub fn update_config_extension_authority(&mut self, config_extension_authority: Pubkey) {
        self.config_extension_authority = config_extension_authority;
    }

    pub fn update_token_badge_authority(&mut self, token_badge_authority: Pubkey) {
        self.token_badge_authority = token_badge_authority;
    }
}

#[cfg(test)]
mod yevefis_config_extension_initialize_tests {
    use super::*;
    use std::str::FromStr;

    #[test]
    fn test_initialize() {
        let mut config_extension = YevefisConfigExtension {
            yevefis_config: Pubkey::default(),
            config_extension_authority: Pubkey::default(),
            token_badge_authority: Pubkey::default(),
        };

        let yevefis_config =
            Pubkey::from_str("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ").unwrap();
        let default_authority =
            Pubkey::from_str("orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE").unwrap();

        let result = config_extension.initialize(yevefis_config, default_authority);
        assert!(result.is_ok());

        assert_eq!(yevefis_config, config_extension.yevefis_config);
        assert_eq!(
            default_authority,
            config_extension.config_extension_authority
        );
        assert_eq!(default_authority, config_extension.token_badge_authority);
    }
}

#[cfg(test)]
mod yevefis_config_extension_update_tests {
    use super::*;
    use std::str::FromStr;

    #[test]
    fn test_update_config_extension_authority() {
        let mut config_extension = YevefisConfigExtension {
            yevefis_config: Pubkey::default(),
            config_extension_authority: Pubkey::default(),
            token_badge_authority: Pubkey::default(),
        };

        let config_extension_authority =
            Pubkey::from_str("orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE").unwrap();

        config_extension.update_config_extension_authority(config_extension_authority);

        assert_eq!(
            config_extension_authority,
            config_extension.config_extension_authority
        );
        assert_eq!(Pubkey::default(), config_extension.token_badge_authority);
    }

    #[test]
    fn test_update_token_badge_authority() {
        let mut config_extension = YevefisConfigExtension {
            yevefis_config: Pubkey::default(),
            config_extension_authority: Pubkey::default(),
            token_badge_authority: Pubkey::default(),
        };

        let token_badge_authority =
            Pubkey::from_str("orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE").unwrap();

        config_extension.update_token_badge_authority(token_badge_authority);

        assert_eq!(
            token_badge_authority,
            config_extension.token_badge_authority
        );
        assert_eq!(
            Pubkey::default(),
            config_extension.config_extension_authority
        );
    }
}

#[cfg(test)]
mod data_layout_tests {
    use anchor_lang::Discriminator;

    use super::*;

    #[test]
    fn test_yevefis_config_extension_data_layout() {
        let config_extension_yevefis_config = Pubkey::new_unique();
        let config_extension_config_extension_authority = Pubkey::new_unique();
        let config_extension_token_badge_authority = Pubkey::new_unique();
        let config_extension_reserved = [0u8; 512];

        let mut config_extension_data = [0u8; YevefisConfigExtension::LEN];
        let mut offset = 0;
        config_extension_data[offset..offset + 8]
            .copy_from_slice(&YevefisConfigExtension::discriminator());
        offset += 8;
        config_extension_data[offset..offset + 32]
            .copy_from_slice(&config_extension_yevefis_config.to_bytes());
        offset += 32;
        config_extension_data[offset..offset + 32]
            .copy_from_slice(&config_extension_config_extension_authority.to_bytes());
        offset += 32;
        config_extension_data[offset..offset + 32]
            .copy_from_slice(&config_extension_token_badge_authority.to_bytes());
        offset += 32;
        config_extension_data[offset..offset + config_extension_reserved.len()]
            .copy_from_slice(&config_extension_reserved);
        offset += config_extension_reserved.len();
        assert_eq!(offset, YevefisConfigExtension::LEN);

        // deserialize
        let deserialized =
            YevefisConfigExtension::try_deserialize(&mut config_extension_data.as_ref()).unwrap();

        assert_eq!(config_extension_yevefis_config, deserialized.yevefis_config);
        assert_eq!(
            config_extension_config_extension_authority,
            deserialized.config_extension_authority
        );
        assert_eq!(
            config_extension_token_badge_authority,
            deserialized.token_badge_authority
        );

        // serialize
        let mut serialized = Vec::new();
        deserialized.try_serialize(&mut serialized).unwrap();
        serialized.extend_from_slice(&config_extension_reserved);

        assert_eq!(serialized.as_slice(), config_extension_data.as_ref());
    }
}
