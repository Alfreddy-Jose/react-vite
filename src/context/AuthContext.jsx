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

  useEffect(() => {
    if (isLogin('/login')) {
      
    const fetchUser = async () => {
      try {
        const response = await Api.get("/user");
        setUser(response.data);
      } catch (err) {
        console.error("Error al obtener los datos del usuario:", err);
      }
    };

    if (!user) {
      fetchUser();
    }
  }
  }, [user]);

  const signIn = (userData) => {
    setUser(userData.user);
     // Almcenando datos del usuario en el localStorage
    localStorage.setItem("user", JSON.stringify(userData.user));
     // Almcenando token del usuario en el localStorage
    localStorage.setItem("token", userData.token);
  };
  
  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
