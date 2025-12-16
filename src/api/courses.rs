use axum::{extract::{Path, State, Query}, routing::{get, post}, Json, Router};
use axum::http::HeaderMap;
use serde::Serialize;
use sqlx::PgPool;
use sqlx::Row;
use crate::utils::{config::Config, error::AppError};

#[derive(Clone)]
pub struct CoursesState { pub pool: PgPool, pub cfg: Config }

#[derive(Serialize)]
pub struct PurchaseResponse { pub stripe_session_url: String }

#[derive(Serialize)]
pub struct CourseDto {
    pub id: String,
    pub title: String,
    pub subtitle: Option<String>,
    pub description: String,
    pub thumbnail_url: Option<String>,
    pub intro_video_url: Option<String>,
    pub price: f64,
    pub version: String,
    pub level: Option<String>,
    pub category: String,
    pub prerequisites: Vec<String>,
    pub learning_objectives: Option<Vec<String>>,
    pub objectives: Vec<String>,
    pub is_featured: bool,
    pub rating_average: f64,
    pub rating_count: i64,
    pub students_count: i64,
    pub created_at: String,
    pub instructor: Option<serde_json::Value>,
}

#[derive(Debug, Default, Clone, serde::Deserialize)]
pub struct ListParams { pub version: Option<String>, pub level: Option<String> }

pub fn routes(pool: PgPool, cfg: Config) -> Router {
    Router::new()
        .route("/", get(list_courses))
        .route("/:id/purchase", post(purchase))
        .with_state(CoursesState { pool, cfg })
}

async fn purchase(Path(id): Path<String>, State(state): State<CoursesState>, headers: HeaderMap) -> Result<Json<PurchaseResponse>, AppError> {
    // Récupérer le cours pour déterminer le prix et le nom
    let row = sqlx::query(
        "SELECT title, COALESCE(price::float8, 0) AS price FROM courses WHERE id = $1"
    ).bind(&id).fetch_optional(&state.pool).await.map_err(|_| AppError::Internal)?;

    let Some(row) = row else { return Err(AppError::NotFound) };
    let title: String = row.get::<String, _>("title");
    let price_f: f64 = row.get::<f64, _>("price");
    let amount_cents: i64 = (price_f.max(0.0) * 100.0).round() as i64;

    // Extraire l'utilisateur depuis le token JWT
    let auth = headers.get(axum::http::header::AUTHORIZATION).and_then(|v| v.to_str().ok()).unwrap_or("");
    let token = auth.strip_prefix("Bearer ").unwrap_or("");
    let claims = crate::utils::jwt::validate_token(token, &state.cfg.jwt_secret).map_err(|_| AppError::Unauthorized)?;
    let user_id = claims.claims.sub;

    // Clé secrète Stripe
    let secret = state.cfg.stripe_keys.clone().ok_or(AppError::Internal)?;

    // Construire la requête Checkout via Stripe API
    // Documentation: https://stripe.com/docs/api/checkout/sessions/create
    let client = reqwest::Client::new();
    let mut form = vec![
        ("mode", "payment".to_string()),
        ("success_url", format!("{}/payment/success?session_id={{CHECKOUT_SESSION_ID}}", state.cfg.frontend_url)),
        ("cancel_url", format!("{}/payment/cancel", state.cfg.frontend_url)),
        ("line_items[0][quantity]", "1".to_string()),
        ("line_items[0][price_data][currency]", "usd".to_string()),
        ("line_items[0][price_data][unit_amount]", amount_cents.to_string()),
        ("line_items[0][price_data][product_data][name]", title.clone()),
    ];

    // Metadata pour lier session à user/course
    form.push(("client_reference_id", user_id.clone()));
    form.push(("metadata[user_id]", user_id));
    form.push(("metadata[course_id]", id.clone()));

    let resp = client
        .post("https://api.stripe.com/v1/checkout/sessions")
        .basic_auth(secret, Some(""))
        .form(&form)
        .send()
        .await
        .map_err(|_| AppError::Internal)?;

    if !resp.status().is_success() {
        return Err(AppError::Internal);
    }

    let body: serde_json::Value = resp.json().await.map_err(|_| AppError::Internal)?;
    let url = body.get("url").and_then(|v| v.as_str()).ok_or(AppError::Internal)?;

    Ok(Json(PurchaseResponse { stripe_session_url: url.to_string() }))
}

async fn list_courses(State(state): State<CoursesState>, Query(params): Query<ListParams>) -> Result<Json<Vec<CourseDto>>, AppError> {
    let mut courses: Vec<CourseDto> = Vec::new();
    let q = if let (Some(ver), Some(level)) = (params.version.clone(), params.level.clone()) {
        sqlx::query("SELECT id, title, subtitle, COALESCE(description_long, '') AS description, thumbnail_url, intro_video_url, COALESCE(price::float8, 0) AS price, level, rating_average, rating_count, students_count FROM courses WHERE (compatibility_versions ? $1) AND level::text = $2")
            .bind(ver)
            .bind(level)
    } else if let Some(ver) = params.version.clone() {
        sqlx::query("SELECT id, title, subtitle, COALESCE(description_long, '') AS description, thumbnail_url, intro_video_url, COALESCE(price::float8, 0) AS price, level, rating_average, rating_count, students_count FROM courses WHERE (compatibility_versions ? $1)")
            .bind(ver)
    } else {
        sqlx::query("SELECT id, title, subtitle, COALESCE(description_long, '') AS description, thumbnail_url, intro_video_url, COALESCE(price::float8, 0) AS price, level, rating_average, rating_count, students_count FROM courses")
    };

    match q.fetch_all(&state.pool).await {
        Ok(rows) => {
            for r in rows {
                let id: uuid::Uuid = r.get("id");
                let title: String = r.get("title");
                let subtitle: Option<String> = r.try_get("subtitle").ok();
                let description: String = r.get("description");
                let thumbnail_url: Option<String> = r.try_get("thumbnail_url").ok();
                let intro_video_url: Option<String> = r.try_get("intro_video_url").ok();
                let price: f64 = r.get("price");
                let level: Option<String> = r.try_get::<String, _>("level").ok();
                let rating_average: f64 = r.get("rating_average");
                let rating_count: i64 = r.get::<i64, _>("rating_count");
                let students_count: i64 = r.get::<i64, _>("students_count");

                let version = params.version.clone().unwrap_or_else(|| "WD25".to_string());
                let dto = CourseDto {
                    id: id.to_string(),
                    title,
                    subtitle,
                    description,
                    thumbnail_url,
                    intro_video_url,
                    price,
                    version,
                    level,
                    category: "windev".to_string(),
                    prerequisites: vec![],
                    learning_objectives: None,
                    objectives: vec![],
                    is_featured: false,
                    rating_average,
                    rating_count,
                    students_count,
                    created_at: chrono::Utc::now().to_rfc3339(),
                    instructor: None,
                };
                courses.push(dto);
            }
            Ok(Json(courses))
        }
        Err(_e) => {
            Ok(Json(Vec::new()))
        }
    }
}

