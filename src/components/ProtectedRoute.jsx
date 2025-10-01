import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user && location.pathname !== "/login" && location.pathname !== "/") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Si se requiere un permiso específico, verificarlo
  if (requiredPermission) {
    const userPermissions =
      JSON.parse(localStorage.getItem("permissions")) || [];

    // Si el usuario no tiene el permiso requerido
    if (!userPermissions.includes(requiredPermission)) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
