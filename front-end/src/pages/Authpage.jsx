import AuthLayout from "../components/sections/auth/AuthLayout";
import AuthForm from "../components/sections/auth/AuthForm";
import "../styles/auth.css";

function AuthPage() {
  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
}

export default AuthPage;
