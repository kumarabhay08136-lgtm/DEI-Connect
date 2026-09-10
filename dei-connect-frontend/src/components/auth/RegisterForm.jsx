import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../common/Input";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
import { isValidEmail } from "../../utils/helpers";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required.";
    if (!isValidEmail(form.email)) nextErrors.email = "Enter a valid college email address.";
    if (!form.password || form.password.length < 6)
      nextErrors.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      navigate("/home");
    } catch (err) {
      setFormError(err.message || "Unable to register. Please try again.");
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
        id="name"
        name="name"
        label="Full Name"
        icon="badge"
        placeholder="Ananya Sharma"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        autoComplete="name"
      />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          icon="lock"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          icon="lock_reset"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-sm">
        <label className="text-sm font-semibold text-on-surface-variant block">I am a</label>
        <div className="grid grid-cols-3 gap-sm">
          {["student", "faculty", "alumni"].map((role) => (
            <button
              type="button"
              key={role}
              onClick={() => setForm((prev) => ({ ...prev, role }))}
              className={`py-sm rounded-lg border text-label-sm font-semibold capitalize transition-all ${
                form.role === role
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-on-surface-variant border-outline-variant/30 hover:border-primary/40"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
      <div className="pt-sm space-y-md">
        <Button type="submit" fullWidth loading={submitting} className="!py-md">
          Create Account
        </Button>
        <Button
          type="button"
          variant="outline"
          fullWidth
          className="!py-md"
          onClick={() => navigate("/login")}
        >
          I already have an account
        </Button>
      </div>
    </form>
  );
}
