import { Navigate } from "react-router-dom";
import { useAuth } from "../components/sections/auth/AuthContext";
import { canAccessAdminSection } from "./adminAccess";

function AdminRouteGuard({ section, children }) {
  const { role } = useAuth();

  if (!canAccessAdminSection(role, section)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default AdminRouteGuard;
