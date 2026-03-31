import { Navigate } from "react-router-dom";
import { useAuth } from "../components/sections/auth/AuthContext";

function PrivateRoute({ children, roles }) {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const allowedRoles = roles?.map((item) => item.toUpperCase());

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorize" replace />;
  }

  return children;
}

export default PrivateRoute;
