use axum::{http::StatusCode, response::{IntoResponse, Response}};
use thiserror::Error;
#[allow(dead_code)]
#[derive(Error, Debug)]
pub enum AppError {
    #[error("Not found")]
    NotFound,
    #[error("Unauthorized")]
    Unauthorized,
    #[error("Forbidden")]
    Forbidden,
    #[error("Bad request")]
    BadRequest,
    #[error("Conflict")]
    Conflict,
    #[error("Internal server error")]
    Internal,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let code = match self { AppError::NotFound => StatusCode::NOT_FOUND, AppError::Unauthorized => StatusCode::UNAUTHORIZED, AppError::Forbidden => StatusCode::FORBIDDEN, AppError::BadRequest => StatusCode::BAD_REQUEST, AppError::Conflict => StatusCode::CONFLICT, AppError::Internal => StatusCode::INTERNAL_SERVER_ERROR };
        (code, self.to_string()).into_response()
    }
}

