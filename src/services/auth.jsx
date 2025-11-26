import axios from "axios";
import Api from "./Api";
import Swal from "sweetalert2";
import { AlertaError } from "../components/Alert";

export const getCsrfToken = async () => {
  return await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie"); // Cambia la URL según tu configuración "https://laravelapi-1-2cah.onrender.com/sanctum/csrf-cookie";
};

export const login = async (credentials) => {
  return await Api.post("/login", credentials);
};

export const getUser = async () => {
  return await Api.get("/user");
};

export const logout = async () => {
  let cerrar = true; // Variable local
  try {

      // Mostrando loader mientras se procesa
      Swal.fire({
        title: "Cerrando Sesión...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await Api.post("/logout");
      return response.data;
    
  } catch (error) {
    console.error(
      "Error al cerrar sesión:",
      error.response?.data || error.message
    );
    AlertaError("Ocurrió un error inesperado. Inténtalo de nuevo.");
    cerrar = false; // Cambia a false si hay error
    throw error;
  } finally {
    if (cerrar) {
      // Ocultar el loader
      Swal.close();
    }
  }
};
