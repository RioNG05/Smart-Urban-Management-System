import AuthLayout from "../components/sections/auth/AuthLayout";
import AuthForm from "../components/sections/auth/AuthForm";
import { useAuth } from "../components/sections/auth/AuthContext";
import { Navigate } from "react-router-dom";
import "../styles/auth.css";

function AuthPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
}

export default AuthPage;
