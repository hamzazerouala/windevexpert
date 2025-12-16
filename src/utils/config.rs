use dotenvy::dotenv;
use std::env;
use anyhow::Result;
use serde::Serialize;
use hyper::header::HeaderValue;

#[derive(Clone, Serialize)]
pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub port: u16,
    pub stripe_keys: Option<String>,
    pub stripe_webhook_secret: Option<String>,
    pub admin_auth: Option<String>,
    pub smtp_config: Option<String>,
    pub s3_config: Option<String>,
    pub frontend_url: String,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        let _ = dotenv();
        let database_url = env::var("DATABASE_URL")?;
        let jwt_secret = env::var("JWT_SECRET")?;
        let port = env::var("PORT").ok().and_then(|v| v.parse().ok()).unwrap_or(8080);
        let stripe_keys = env::var("STRIPE_KEYS").ok();
        let stripe_webhook_secret = env::var("STRIPE_WEBHOOK_SECRET").ok();
        let admin_auth = env::var("ADMIN_AUTH").ok();
        let smtp_config = env::var("SMTP_CONFIG").ok();
        let s3_config = env::var("S3_CONFIG").ok();
        let frontend_url = env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:5173".to_string());
        Ok(Self { database_url, jwt_secret, port, stripe_keys, stripe_webhook_secret, admin_auth, smtp_config, s3_config, frontend_url })
    }
}

pub fn frontend_origin(origin: &str) -> HeaderValue {
    HeaderValue::from_str(origin).unwrap_or(HeaderValue::from_static("*"))
}

pub async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c().await.ok();
    };
    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate()).unwrap().recv().await;
    };
    #[cfg(not(unix))]
    let terminate = async { std::future::pending::<()>().await };
    tokio::select! { _ = ctrl_c => {}, _ = terminate => {} }
}

