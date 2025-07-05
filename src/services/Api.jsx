import axios from "axios";
import Swal from "sweetalert2";
import { AlertaError } from "../components/Alert";

// Configuración basica de Axios
export const Api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Dirección de la Api
  timeout: 5000, // tiempo máximo de espera
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // Aquí se pueden agregar más headers como token de autenticación
  },
  withCredentials: true, // Necesario para las cookies de Sanctum
  withXSRFToken: true,
});

// configuracion para enviar token
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // O donde guardes tu token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Traer todos los registros
export const GetAll = async (setAll, setLoading, url) => {
  try {
    const response = await Api.get(url);
    setAll(response.data);
  } catch (error) {
    // Manejo de errores
    AlertaError("Error al cargar los datos");
    console.log(error);
  } finally {
    setLoading(false);
  }
};

// Guardar Todos los registros
export const PostAll = async (values, url, navegation) => {
  let cerrar = true; // Variable local

  // Mostrando loader mientras se procesa
  Swal.fire({
    title: "Guardando...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    await Api.post(url, values).then((response) => {
      console.log({ state: { message: response.data.message } });
      navegation(url, { state: { message: response.data.message } });
    });

  } catch (error) {
    console.log(error);
    if (!error.response || error.response.status !== 422) {
      AlertaError("Error al guardar los datos");
      cerrar = false; // Cambia a false si hay error
    }
    throw error; // <-- ¡Agrega esta línea!
  } finally {
    // cerrar loader en caso de exito
    if (cerrar) {
      Swal.close();
    }
  }
};
// Actualizando Todos los datos
export const PutAll = async (values, url, navegation, id, urlNavegar) => {
  let cerrar = true; // Variable local

  // Mostrando loader mientras se procesa
  Swal.fire({
    title: "Actualizando...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
    const response = await Api.put(`${url}/${id}`, values);
    console.log(response);
    navegation(urlNavegar, { state: { message: response.data.message } });
  } catch (error) {
    console.log(error);
    if (!error.response || error.response.status !== 422) {
      AlertaError("Error al guardar los datos");
      cerrar = false; // Cambia a false si hay error
    }
    throw error; // <-- ¡Agrega esta línea!
  } finally {
    // cerrar loader en caso de exito
    if (cerrar) {
      Swal.close();
    }
  }
};

export default Api;
