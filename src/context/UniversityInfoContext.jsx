// contexts/UniversityInfoContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import Api from "../services/Api";

// Estado inicial
const initialState = {
  id: "",
  nombre_univ: "",
  abreviado_univ: "",
  rif_univ: "",
  direccion: "",
  logo: "",
  loading: true,
  error: null,
};

// Crear contexto
const UniversityInfoContext = createContext();

// Proveedor del contexto
export const UniversityProvider = ({ children }) => {
  const [universityInfo, setUniversityInfo] = useState(initialState);

  // Función para cargar la información de la universidad
  const fetchUniversityInfo = async () => {
    try {
      setUniversityInfo((prev) => ({ ...prev, loading: true, error: null }));
      const response = await Api.get("/universidades");
      const data = response.data[0] || initialState; // Toma el primer registro o el estado inicial
      setUniversityInfo({
        ...data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setUniversityInfo((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  // Cargar información al inicializar
  useEffect(() => {
    fetchUniversityInfo();
  }, []);

  // Función para recargar la información
  const refreshUniversityInfo = () => {
    fetchUniversityInfo();
  };

  const value = {
    ...universityInfo,
    refreshUniversityInfo,
  };

  return (
    <UniversityInfoContext.Provider value={value}>
      {children}
    </UniversityInfoContext.Provider>
  );
};

// Hook personalizado
export const useUniversityInfo = () => {
  const context = useContext(UniversityInfoContext);
  if (!context) {
    throw new Error(
      "useUniversityInfo debe usarse dentro de UniversityProvider"
    );
  }
  return context;
};
