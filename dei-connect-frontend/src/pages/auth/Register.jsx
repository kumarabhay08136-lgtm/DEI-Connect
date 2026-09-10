import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
  return (
    <AuthLayout eyebrow="Join The Community" title="Create your account" subtitle="Register with your DEI college email to get started.">
      <RegisterForm />
    </AuthLayout>
  );
}
