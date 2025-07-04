import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export function LogoutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();  
    signOut(); // Limpia el estado del usuario en el contexto
    navigate("/login"); // Redirige al login
  };

  return <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>;
}
