use sqlx::{postgres::PgPoolOptions, PgPool};
use anyhow::Result;
use std::env;

pub async fn init_pool(database_url: &str) -> Result<PgPool> {
    let skip = env::var("SKIP_DB").ok().map(|v| v == "1").unwrap_or(false);
    if skip {
        let pool = PgPoolOptions::new().max_connections(5).connect_lazy(database_url)?;
        return Ok(pool);
    }
    let pool = PgPoolOptions::new().max_connections(5).connect(database_url).await?;
    Ok(pool)
}

