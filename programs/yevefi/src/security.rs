use solana_security_txt::security_txt;

#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    name: "Yeve Finance",
    project_url: "https://yeve.fi",
    contacts: "email:jcaster199@gmail.com",
    policy: "https://yeve.fi/security",
    source_code: "https://github.com/yevefi/dex"
}
