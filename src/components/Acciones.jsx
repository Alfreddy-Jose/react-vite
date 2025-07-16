import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../services/Api";
import { AlertaError } from "./Alert";

export default function Acciones({ url, urlDelete, navegar, editar = null, eliminar = null }) {
  const navegation = useNavigate();
  // Leer permisos del localStorage
  const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

  const AlertDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Estas seguro?",
        text: "Quieres realizar la acción solicitada",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, realizar",
        cancelButtonText: "No, cancelar",
      });

      if (result.isConfirmed) {
        // Mostrando loader mientras se procesa
        Swal.fire({
          title: "Eliminando...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        // Enviando peticion para eliminar el registro
        const response = await Api.delete(urlDelete);

        navegation({ navegar }, { state: { message: response.data.message } });
      }
    } catch (error) {
      AlertaError("Error al eliminar el registro");
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center aling-content-center">
      {permisos.includes(editar) ? (
        <Link className="btn traslation btn-primary" to={url} title="Editar">
          <i className="far fa-edit"></i>
        </Link>
      ) : null}
      {permisos.includes(eliminar) ? (
        <button
          title="Eliminar"
          className="btn traslation btn-danger ms-1"
          onClick={AlertDelete}
        >
          <i className="far fa-trash-alt"></i>
        </button>
      ) : null}
    </div>
  );
}
