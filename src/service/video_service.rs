use anyhow::Result;

#[allow(dead_code)]
pub async fn presigned_url(_client: &(), _bucket: &str, _key: &str, _minutes: u64) -> Result<String> {
    Err(anyhow::anyhow!("S3 non configuré"))
}

