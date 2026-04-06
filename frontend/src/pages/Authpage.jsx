import AuthLayout from "../components/sections/auth/AuthLayout";
import AuthForm from "../components/sections/auth/AuthForm";
import { useAuth } from "../components/sections/auth/AuthContext";
import { Navigate } from "react-router-dom";
import { getDefaultAdminPath } from "../admin/adminAccess";
import "../styles/auth.css";

function AuthPage() {
  const { user, role } = useAuth();

  const roleDashboard = {
    ADMIN: "/admin",
    MANAGER: getDefaultAdminPath("MANAGER"),
    RESIDENT: "/",
    STAFF_APARTMENT: getDefaultAdminPath("STAFF_APARTMENT"),
    STAFF_SERVICE: getDefaultAdminPath("STAFF_SERVICE"),
    STAFF_SECURITY: getDefaultAdminPath("STAFF_SECURITY"),
    STAFF: getDefaultAdminPath("STAFF"),
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
