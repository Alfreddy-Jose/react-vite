import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return children;
}; */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user && location.pathname !== '/login' && location.pathname !== '/') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;