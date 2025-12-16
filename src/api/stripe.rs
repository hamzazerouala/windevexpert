use axum::{Router, routing::post, extract::{State}, body::Bytes};
use axum::http::HeaderMap;
use hmac::{Hmac, Mac};
use sha2::Sha256;
use serde_json::Value;
use sqlx::PgPool;
use crate::utils::{config::Config, error::AppError};

#[derive(Clone)]
pub struct StripeState { pub pool: PgPool, pub cfg: Config }

pub fn routes(pool: PgPool, cfg: Config) -> Router {
    Router::new().route("/webhook", post(webhook)).with_state(StripeState { pool, cfg })
}

fn verify_signature(headers: &HeaderMap, payload: &Bytes, secret: &str) -> bool {
    let sig = headers.get("Stripe-Signature").and_then(|v| v.to_str().ok());
    let Some(sig) = sig else { return false };
    // Parse "t=timestamp, v1=signature"
    let mut timestamp: Option<&str> = None;
    let mut v1: Option<&str> = None;
    for part in sig.split(',') {
        let mut kv = part.splitn(2, '=');
        let k = kv.next().unwrap_or("");
        let v = kv.next().unwrap_or("");
        if k == "t" { timestamp = Some(v) } else if k == "v1" { v1 = Some(v) }
    }
    let (Some(ts), Some(signature)) = (timestamp, v1) else { return false };
    let signed_payload = format!("{}.{}", ts, std::str::from_utf8(payload).unwrap_or(""));
    let mut mac = match Hmac::<Sha256>::new_from_slice(secret.as_bytes()) {
        Ok(m) => m,
        Err(_) => return false,
    };
    mac.update(signed_payload.as_bytes());
    let expected = mac.finalize().into_bytes();
    let expected_hex = hex::encode(expected);
    subtle_equals(&expected_hex, signature)
}

fn subtle_equals(a: &str, b: &str) -> bool {
    if a.len() != b.len() { return false }
    let mut acc = 0u8;
    for (x, y) in a.as_bytes().iter().zip(b.as_bytes().iter()) {
        acc |= x ^ y;
    }
    acc == 0
}

async fn webhook(State(state): State<StripeState>, headers: HeaderMap, body: Bytes) -> Result<(), AppError> {
    let secret = state.cfg.stripe_webhook_secret.clone().ok_or(AppError::Internal)?;
    if !verify_signature(&headers, &body, &secret) { return Err(AppError::Unauthorized) }

    let payload: Value = serde_json::from_slice(&body).map_err(|_| AppError::BadRequest)?;
    let event_type = payload.get("type").and_then(|v| v.as_str()).unwrap_or("");

    if event_type == "checkout.session.completed" {
        if let Some(data) = payload.get("data").and_then(|d| d.get("object")) {
            let session_id = data.get("id").and_then(|v| v.as_str()).unwrap_or("");
            let amount_total = data.get("amount_total").and_then(|v| v.as_i64()).unwrap_or(0);
            let currency = data.get("currency").and_then(|v| v.as_str()).unwrap_or("usd");
            let metadata = data.get("metadata").and_then(|v| v.as_object());
            let (user_id, course_id) = if let Some(meta) = metadata {
                let u = meta.get("user_id").and_then(|v| v.as_str()).unwrap_or("");
                let c = meta.get("course_id").and_then(|v| v.as_str()).unwrap_or("");
                (u.to_string(), c.to_string())
            } else { (String::new(), String::new()) };

            if !user_id.is_empty() && !course_id.is_empty() {
                let uid = uuid::Uuid::parse_str(&user_id).map_err(|_| AppError::BadRequest)?;
                let cid = uuid::Uuid::parse_str(&course_id).map_err(|_| AppError::BadRequest)?;
                let _ = sqlx::query("INSERT INTO enrollments (user_id, course_id, stripe_checkout_session_id, amount_cents, currency) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (user_id, course_id) DO NOTHING")
                    .bind(uid)
                    .bind(cid)
                    .bind(session_id)
                    .bind(amount_total)
                    .bind(currency)
                    .execute(&state.pool)
                    .await
                    .map_err(|_| AppError::Internal)?;
                let _ = sqlx::query("UPDATE courses SET students_count = students_count + 1 WHERE id = $1")
                    .bind(cid)
                    .execute(&state.pool)
                    .await
                    .map_err(|_| AppError::Internal)?;
            }
        }
    }
    Ok(())
}

