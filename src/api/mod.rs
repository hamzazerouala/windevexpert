use axum::{routing::get, Router};
use sqlx::PgPool;
use crate::utils::config::Config;

pub mod health;
pub mod auth;
pub mod profile;
pub mod courses;
pub mod stripe;

pub fn build_router(pool: PgPool, cfg: Config) -> Router {
    Router::new()
        .route("/api/health", get(health::health))
        .nest("/api/auth", auth::routes(pool.clone(), cfg.clone()))
        .nest("/api/profile", profile::routes(pool.clone(), cfg.clone()))
        .nest("/api/courses", courses::routes(pool.clone(), cfg.clone()))
        .nest("/api/stripe", stripe::routes(pool.clone(), cfg.clone()))
}

