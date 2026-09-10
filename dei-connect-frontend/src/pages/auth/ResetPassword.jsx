import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { resetPassword } from "../../services/authService";

// Landing page for the link inside the password-reset email:
// /reset-password?token=<...>
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its token — please request a new one.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ token, newPassword });
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message || "This reset link is invalid or has expired. Please request a new one.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account Recovery"
      title="Set a new password"
      subtitle="Choose a new password for your account."
    >
      {done ? (
        <div className="text-center space-y-md">
          <span className="material-symbols-outlined text-5xl text-secondary icon-fill">check_circle</span>
          <h3 className="font-heading text-headline-md text-primary">Password updated</h3>
          <p className="text-on-surface-variant text-body-md">
            Redirecting you to login...
          </p>
        </div>
      ) : (
        <form className="space-y-lg" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
              {error}
            </div>
          )}
          {!token && (
            <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
              No reset token found in this link. Please use the link from your email, or{" "}
              <Link to="/forgot-password" className="underline font-semibold">
                request a new one
              </Link>
              .
            </div>
          )}
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            label="New Password"
            icon="lock"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm New Password"
            icon="lock"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" fullWidth loading={submitting} className="!py-md">
            Reset Password
          </Button>
          <Link
            to="/login"
            className="flex items-center justify-center gap-xs text-sm font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Login
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
