import  axios  from 'axios';
import Swal from 'sweetalert2';

// Configuración basica de Axios
export const Api = axios.create({
  baseURL: "https://laravelapi-production-2350.up.railway.app/api", // Dirección de la Api 
  timeout: 5000, // tiempo máximo de espera
  headers: {
    "Content-Type": "application/json",
    //Aquí se pueden agregar más headers como token de autenticación
  },
  withCredentials: true, // Necesario para las cookies de Sanctum
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

// Guardar Todos los registros
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
// Actualizando Todos los datos
export const PutAll = async (values, url, navegation, id) => {
        // Mostrando loader mientras se procesa
        Swal.fire({
          title: "Actualizando...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        await Api.put(`${url}/${id}`, values).then((response) => {
          console.log(response)
          navegation(url, { state: { message: response.data.message } });
        })
}

export default Api;