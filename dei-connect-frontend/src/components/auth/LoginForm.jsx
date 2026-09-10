import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/helpers";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid college email address.";
    if (!form.password || form.password.length < 4)
      nextErrors.password = "Password must be at least 4 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate("/home");
    } catch (err) {
      setFormError(err.message || "Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-lg" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="bg-error-container/60 text-on-error-container text-body-sm px-md py-sm rounded-lg">
          {formError}
        </div>
      )}
      <Input
        id="email"
        name="email"
        type="email"
        label="College Email Address"
        icon="alternate_email"
        placeholder="example@dei.ac.in"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />
      <div>
        <div className="flex justify-between items-center mb-sm">
          <label htmlFor="password" className="text-sm font-semibold text-on-surface-variant">
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          icon="lock"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />
      </div>
      <div className="flex items-center gap-sm">
        <input
          id="remember"
          name="remember"
          type="checkbox"
          checked={form.remember}
          onChange={handleChange}
          className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
        />
        <label htmlFor="remember" className="text-sm text-on-surface-variant cursor-pointer select-none">
          Keep me logged in for 30 days
        </label>
      </div>
      <div className="pt-sm space-y-md">
        <Button type="submit" fullWidth loading={submitting} className="!py-md">
          Login
        </Button>
        <Button
          type="button"
          variant="outline"
          fullWidth
          className="!py-md"
          onClick={() => navigate("/register")}
        >
          Create New Account
        </Button>
      </div>
    </form>
  );
}
