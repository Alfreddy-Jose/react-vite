/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import Api from "../services/Api";
// import { useLocation } from "react-router-dom";

const isLogin = (path) => location.pathname !== path;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Estado para el lapso académico
  const [lapsoActual, setLapsoActual] = useState(() => {
    const saved = localStorage.getItem("lapsoActual");
    return saved ? JSON.parse(saved) : null;
  });

  const [lapsos, setLapsos] = useState([]);

  // Función para cargar los lapsos disponibles
  const fetchLapsos = async () => {
    try {
      const response = await Api.get("/lapsos/activos");
      setLapsos(response.data);
      if (!lapsoActual && response.data.length > 0) {
        setLapsoActual(response.data[0]);
      }
    } catch (err) {
      console.error("Error al obtener los lapsos académicos:", err);
    }
  };
  const refreshLapsos = async () => {
    try {
      const response = await Api.get("/lapsos/activos");
      setLapsos(response.data);
    } catch (err) {
      console.error("Error al obtener los lapsos académicos:", err);
    }
  };

  // Nueva función para exponer setUser de forma controlada
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  useEffect(() => {
    if (isLogin("/login") && isLogin("/")) {
      const fetchUser = async () => {
        try {
          const response = await Api.get("/user");
          setUser(response.data);
          // Cargar lapsos después de autenticar al usuario
          await fetchLapsos();
        } catch (err) {
          console.error("Error al obtener los datos del usuario:", err);
        }
      };

      if (!user) {
        fetchUser();
      } else {
        // Si ya hay usuario pero no lapsos, cargarlos
        if (lapsos.length === 0) {
          fetchLapsos();
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (lapsoActual) {
      localStorage.setItem("lapsoActual", JSON.stringify(lapsoActual));
      // Configurar el lapso en los headers de las peticiones API
      Api.defaults.headers.common["X-Lapso-Id"] = lapsoActual.id;
    }
  }, [lapsoActual]);

  const signIn = (userData) => {
    setUser(userData.user);
    // Almcenando datos del usuario en el localStorage
    localStorage.setItem("user", JSON.stringify(userData.user));
    // Almcenando token del usuario en el localStorage
    localStorage.setItem("token", userData.token);
    localStorage.setItem("permissions", JSON.stringify(userData.permissions));

    // Configurar el token en las cabeceras de las peticiones API
    Api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    // Cargar lapsos después de iniciar sesión
    fetchLapsos();
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        lapsoActual,
        setLapsoActual,
        lapsos,
        refreshLapsos,
        updateUser, // Exponer updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}