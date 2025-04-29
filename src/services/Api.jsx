import  axios  from 'axios';
import Swal from 'sweetalert2';

// Configuración basica de Axios
export const Api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Dirección de la Api 
  timeout: 5000, // tiempo máximo de espera
  headers: {
    "Content-Type": "application/json",
    //Aquí se pueden agregar más headers como token de autenticación
  }
}) 

// Traer todos los registros
export const GetAll = async (setPnf, setLoading, url) => {
  try {
    const response = await Api.get(url);
    setPnf(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};


export const PostAll = async (values, url, navegation) => {
      // Mostrando loader mientras se procesa
      Swal.fire({
        title: "Guardando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      await Api.post(url, values).then((response) => {
        console.log({state:{message:response.data.message}});
        navegation(url, { state: { message: response.data.message } });
      });
} 

export default Api;