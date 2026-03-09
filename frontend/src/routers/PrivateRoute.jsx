import { Navigate } from "react-router-dom";
import { useAuth } from "../components/sections/auth/AuthContext";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  // chưa login
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // có role nhưng không đúng role
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default PrivateRoute;
