import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../services/Api";
import { AlertaError } from "./Alert";

export default function Acciones({ url, urlDelete, navegar, editar = null, eliminar = null}) {
  const navegation = useNavigate();
  // Leer permisos del localStorage
  const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

  const AlertDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Quieres realizar la acción solicitada",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, realizar",
        cancelButtonText: "No, cancelar",
        customClass: {
        confirmButton: "btn btn-primary me-2",
        cancelButton: "btn btn-secondary",
        popup: 'custom-swal-popup',
      },
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
      // Cerrar loader
      Swal.close();

      console.log("Error detallado:", error);
      console.log("Datos del error:", error.response?.data);

      // Manejar error de restricción de llave foránea
      if (error.response?.data?.error_type === "foreign_key_constraint") {
        AlertaError(error.response.data.message || "No se puede eliminar, este registro está siendo utilizado en otras partes del sistema");
        return;
      }

      // Manejar error 500 u otros
      if (error.response?.status === 500) {
        AlertaError("Error del servidor: " + (error.response.data.message || "Intente más tarde"));
        return;
      }

      // Error genérico
      AlertaError(error.response?.data?.message || "Ocurrió un error inesperado");
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
