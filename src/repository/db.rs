use sqlx::{postgres::PgPoolOptions, PgPool};
use anyhow::{Context, Result};
use std::env;

pub async fn init_pool(database_url: &str) -> Result<PgPool> {
    let skip = env::var("SKIP_DB").ok().map(|v| v == "1").unwrap_or(false);
    if skip {
        let pool = PgPoolOptions::new().max_connections(5).connect_lazy(database_url)?;
        return Ok(pool);
    }

    let safe_url = if let Some((_, suffix)) = database_url.split_once('@') {
        format!("postgres://*****@{}", suffix)
    } else {
        "postgres://*****".to_string()
    };
    tracing::info!("Attempting to connect to database: {}", safe_url);

    let pool = PgPoolOptions::new().max_connections(5).connect(database_url).await
        .with_context(|| format!("Failed to connect to database at {}", safe_url))?;
    Ok(pool)
}

