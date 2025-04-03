import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ element, role }) => {
  const { user } = useAuth();

  // Check user login ?
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
