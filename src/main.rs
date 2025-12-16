use axum::{Router};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};
use std::net::SocketAddr;
use tokio::net::TcpListener;

mod utils;
mod repository;
mod service;
mod api;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));
    tracing_subscriber::registry().with(tracing_subscriber::fmt::layer()).with(filter).init();

    let cfg = utils::config::Config::from_env()?;
    let pool = repository::db::init_pool(&cfg.database_url).await?;

    let cors = CorsLayer::new().allow_origin(utils::config::frontend_origin(&cfg.frontend_url)).allow_methods([http::Method::GET, http::Method::POST, http::Method::PUT, http::Method::DELETE]).allow_headers([http::header::CONTENT_TYPE, http::header::AUTHORIZATION]);

    let app: Router = api::build_router(pool.clone(), cfg.clone()).layer(TraceLayer::new_for_http()).layer(cors);

    let addr: SocketAddr = format!("0.0.0.0:{}", cfg.port).parse().unwrap();
    let listener = TcpListener::bind(addr).await?;
    tracing::info!(%addr, "server listening");
    axum::serve(listener, app).with_graceful_shutdown(utils::config::shutdown_signal()).await?;
    Ok(())
}

