import AuthLayout from "../../components/layout/AuthLayout";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <AuthLayout eyebrow="Account Recovery" title="Forgot your password?" subtitle="Enter your email and we'll send you reset instructions.">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
