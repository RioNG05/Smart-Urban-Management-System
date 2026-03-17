import AuthLayout from "../components/sections/auth/AuthLayout";
import AuthForm from "../components/sections/auth/AuthForm";
import { useAuth } from "../components/sections/auth/AuthContext";
import { Navigate } from "react-router-dom";
import "../styles/auth.css";

function AuthPage() {
  const { user } = useAuth();

  const roleDashboard = {
    ADMIN: "/admin/dashboard",
    RESIDENT: "/resident/dashboard",
    STAFF_APARTMENT: "/staff/apartment/dashboard",
    STAFF_SERVICE: "/staff/service/dashboard",
    STAFF_SECURITY: "/staff/security/dashboard"
  };

  //Check role
  if (user) {
    const role = user.role;

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
