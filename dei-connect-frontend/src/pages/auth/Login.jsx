import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <AuthLayout eyebrow="Welcome Back" title="Sign in to DEI Connect 👋" subtitle="Continue your journey with your college community.">
      <LoginForm />
    </AuthLayout>
  );
}
