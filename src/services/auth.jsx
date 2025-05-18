import axios from "axios";
import Api from "./Api";


export const getCsrfToken = async () => {
  return await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");
};

export const login = async (credentials) => {
    return await Api.post("/login", credentials);
};

export const getUser = async () => {
  return await Api.get("/user");
};

export const logout = async () => {
  try {
    const response = await Api.post("/logout");
    return response.data;
  } catch (error) {
    console.error(
      "Error al cerrar sesión:",
      error.response?.data || error.message
    );
    throw error;
  }
};
