use axum::{Router, routing::post, extract::State, Json};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use crate::utils::{config::Config, jwt::create_token, error::AppError};
use argon2::{Argon2, PasswordHash, PasswordVerifier};
use sqlx::Row;

#[derive(Clone)]
pub struct AuthState { pub pool: PgPool, pub cfg: Config }

#[derive(Deserialize)]
pub struct LoginRequest { pub email: String, pub password: String }

#[derive(Serialize)]
pub struct LoginResponse { pub token: String }

pub fn routes(pool: PgPool, cfg: Config) -> Router {
    Router::new().route("/login", post(login)).with_state(AuthState { pool, cfg })
}

async fn login(State(state): State<AuthState>, Json(req): Json<LoginRequest>) -> Result<Json<LoginResponse>, AppError> {
    if let Some(admin) = &state.cfg.admin_auth {
        let parts: Vec<&str> = admin.split(":").collect();
        if parts.len() == 2 && req.email == parts[0] && req.password == parts[1] {
            let token = create_token("admin", "admin", &state.cfg.jwt_secret, 60)?;
            return Ok(Json(LoginResponse { token }));
        }
    }
    let row = sqlx::query("SELECT id, password_hash, role FROM users WHERE email = $1").bind(&req.email).fetch_optional(&state.pool).await.map_err(|_| AppError::Internal)?;
    let Some(user) = row else { return Err(AppError::Unauthorized) };
    let password_hash: String = user.get("password_hash");
    let parsed = PasswordHash::new(&password_hash).map_err(|_| AppError::Internal)?;
    Argon2::default().verify_password(req.password.as_bytes(), &parsed).map_err(|_| AppError::Unauthorized)?;
    let id: uuid::Uuid = user.get("id");
    let role: Option<String> = user.get("role");
    let token = create_token(&id.to_string(), role.as_deref().unwrap_or("user"), &state.cfg.jwt_secret, 60)?;
    Ok(Json(LoginResponse { token }))
}

