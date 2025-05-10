import { createContext, useContext, useState, useEffect } from "react";
import { login, getUser, logout } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await getUser();
        setUser(data);
      } catch (err) {
        console.log(err);        
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (credentials) => {
    const { data } = await login(credentials);
    setUser(data.user);
    return data;
  };

  const signOut = async () => {
    await logout();
    setUser(null);
  }

  return (
    <AuthProvider.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthProvider.Provider>
  )
};

export const useAuth = () => useContext(AuthContext);
