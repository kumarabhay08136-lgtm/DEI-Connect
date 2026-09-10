import nodemailer from "nodemailer";

// -----------------------------------------------------------------------
// Real outgoing email (password reset, etc), configured entirely through
// environment variables so no credentials ever live in code:
//
//   SMTP_HOST      e.g. smtp.gmail.com  /  smtp-relay.brevo.com
//   SMTP_PORT      e.g. 587 (STARTTLS) or 465 (SSL)
//   SMTP_SECURE    "true" for port 465, otherwise omit/"false"
//   SMTP_USER      SMTP login (often the sending email address)
//   SMTP_PASS      SMTP password / app password / API key
//   EMAIL_FROM     e.g. "DEI Connect <no-reply@dei.edu>" (defaults to SMTP_USER)
//
// If these aren't set, we don't crash the app — we just log a clear
// warning and skip sending, so local dev without SMTP still works. Real
// email requires real SMTP credentials in .env; there is no way around
// that for actually landing in someone's inbox.
// -----------------------------------------------------------------------

let transporter = null;
let attemptedInit = false;

function getTransporter() {
  if (attemptedInit) return transporter;
  attemptedInit = true;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      "\n⚠️  Email is not configured — SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS are missing from .env.\n" +
        "   Password-reset links (and any other outgoing email) will only be printed to this console instead of actually being sent.\n" +
        "   Set those four variables to a real SMTP provider (Gmail app password, Brevo, Resend, Mailgun, SES, etc.) to send real emails.\n"
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true" || Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

/**
 * Sends an email. Returns true if it was actually handed off to an SMTP
 * server, false if email isn't configured (caller can decide how to
 * degrade — e.g. surface a dev-only fallback link).
 */
export async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) return false;

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  try {
    await t.sendMail({ from, to, subject, html, text });
    return true;
  } catch (err) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    return false;
  }
}
