use solana_security_txt::security_txt;

#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    name: "Solve3 Dex program",
    project_url: "https://solve3.fi/",
    contacts: "discord:https://discord.gg/ZDyXeyjGc7,twitter:https://x.com/solve3fi",
    policy: "https://solve3.fi/policy",
    source_code: "https://github.com/solve3fi"
}
