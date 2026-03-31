import AuthLayout from "../components/sections/auth/AuthLayout";
import AuthForm from "../components/sections/auth/AuthForm";
import { useAuth } from "../components/sections/auth/AuthContext";
import { Navigate } from "react-router-dom";
import "../styles/auth.css";

function AuthPage() {
  const { user, role } = useAuth();

  const roleDashboard = {
    ADMIN: "/admin",
    MANAGER: "/admin",
    RESIDENT: "/",
    STAFF_APARTMENT: "/staff/apartment",
    STAFF_SERVICE: "/staff/service",
    STAFF_SECURITY: "/staff/security",
    STAFF: "/staff/apartment",
  };

  if (user) {
    const redirectPath = roleDashboard[role] || "/";

    return <Navigate to={redirectPath} replace />;
  }

  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
}

export default AuthPage;
