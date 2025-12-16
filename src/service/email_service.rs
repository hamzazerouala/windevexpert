use lettre::{Message, SmtpTransport, Transport};
use anyhow::Result;

#[allow(dead_code)]
pub async fn send_plain(to: &str, subject: &str, body: &str, smtp_config: &str) -> Result<()> {
    let mail = Message::builder().from("WindevExpert <no-reply@windevexpert>".parse().unwrap()).to(to.parse().unwrap()).subject(subject).body(body.to_string()).unwrap();
    let mailer = SmtpTransport::relay(smtp_config).unwrap().build();
    mailer.send(&mail).map(|_| ())?;
    Ok(())
}

