use axum::{Router, routing::put, extract::State, Json};
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use crate::utils::{config::Config, error::AppError};

#[derive(Clone)]
pub struct ProfileState { pub pool: PgPool, pub _cfg: Config }

#[derive(Deserialize)]
pub struct ProfileUpdate {
    pub full_name: Option<String>,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub job_title: Option<String>,
    pub company: Option<String>,
    pub city: Option<String>,
    pub country: Option<String>,
    pub linkedin_url: Option<String>,
    pub website_url: Option<String>,
    pub pcsoft_experience: Option<String>,
    pub phone_number: Option<String>,
}

#[derive(Serialize)]
pub struct ProfileResult { pub ok: bool }

pub fn routes(pool: PgPool, cfg: Config) -> Router { Router::new().route("/", put(update)).with_state(ProfileState { pool, _cfg: cfg }) }

async fn update(State(state): State<ProfileState>, Json(body): Json<ProfileUpdate>) -> Result<Json<ProfileResult>, AppError> {
    let _ = sqlx::query(
        "UPDATE users SET full_name = COALESCE($1, full_name), bio = COALESCE($2, bio), avatar_url = COALESCE($3, avatar_url), job_title = COALESCE($4, job_title), company = COALESCE($5, company), city = COALESCE($6, city), country = COALESCE($7, country), linkedin_url = COALESCE($8, linkedin_url), website_url = COALESCE($9, website_url), pcsoft_experience = COALESCE($10, pcsoft_experience), phone_number = COALESCE($11, phone_number) WHERE id = $12"
    )
    .bind(&body.full_name)
    .bind(&body.bio)
    .bind(&body.avatar_url)
    .bind(&body.job_title)
    .bind(&body.company)
    .bind(&body.city)
    .bind(&body.country)
    .bind(&body.linkedin_url)
    .bind(&body.website_url)
    .bind(&body.pcsoft_experience)
    .bind(&body.phone_number)
    .bind(uuid::Uuid::nil())
    .execute(&state.pool)
    .await
    .map_err(|_| AppError::Internal)?;
    Ok(Json(ProfileResult { ok: true }))
}

