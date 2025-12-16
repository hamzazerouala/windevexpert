use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, Algorithm, TokenData};
use serde::{Deserialize, Serialize};
use chrono::{Utc, Duration};
use crate::utils::error::AppError;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub role: String,
    pub exp: usize,
}

pub fn create_token(subject: &str, role: &str, secret: &str, ttl_minutes: i64) -> Result<String, AppError> {
    let exp = (Utc::now() + Duration::minutes(ttl_minutes)).timestamp() as usize;
    let claims = Claims { sub: subject.to_string(), role: role.to_string(), exp };
    let token = jsonwebtoken::encode(&Header::new(Algorithm::HS256), &claims, &EncodingKey::from_secret(secret.as_bytes())).map_err(|_| AppError::Internal)?;
    Ok(token)
}

#[allow(dead_code)]
pub fn validate_token(token: &str, secret: &str) -> Result<TokenData<Claims>, AppError> {
    let data = jsonwebtoken::decode::<Claims>(token, &DecodingKey::from_secret(secret.as_bytes()), &Validation::new(Algorithm::HS256)).map_err(|_| AppError::Unauthorized)?;
    Ok(data)
}

