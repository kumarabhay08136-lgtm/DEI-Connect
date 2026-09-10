import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { requestPasswordReset } from "../../services/authService";
import { isValidEmail } from "../../utils/helpers";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("Enter a valid college email address.");
      return;
    }
    setSubmitting(true);
    try {
      await requestPasswordReset({ email });
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-md">
        <span className="material-symbols-outlined text-5xl text-secondary icon-fill">
          mark_email_read
        </span>
        <h3 className="font-heading text-headline-md text-primary">Check your inbox</h3>
        <p className="text-on-surface-variant text-body-md">
          We've sent password reset instructions to <strong>{email}</strong>.
        </p>
        <Link to="/login" className="inline-block text-primary font-semibold hover:underline">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-lg" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
          {error}
        </div>
      )}
      <Input
        id="email"
        name="email"
        type="email"
        label="College Email Address"
        icon="alternate_email"
        placeholder="example@dei.ac.in"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" fullWidth loading={submitting} className="!py-md">
        Send Reset Link
      </Button>
      <Link
        to="/login"
        className="flex items-center justify-center gap-xs text-sm font-semibold text-primary hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Login
      </Link>
    </form>
  );
}
