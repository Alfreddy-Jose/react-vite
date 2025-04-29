import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../services/Api";

export default function Acciones({ url, urlDelete, navegar }) {
  const navegation = useNavigate();

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
          title: 'Eliminando...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        // Enviando peticion para eliminar el registro
        const response = await Api.delete(urlDelete);

        navegation({ navegar }, { state: { message: response.data.message } });
      }
    } catch (error) {
      console.log("Ocurrio un error: "+error);
    }
  }

  return (
    <div className="d-flex justify-content-center aling-content-center">
      <Link className="btn btn-primary" to={url}>
        <i className="far fa-edit"></i>
      </Link>
      <button
      title="Eliminar"
      className="btn btn-danger ms-1"
      onClick={AlertDelete}
      ><i className="far fa-trash-alt"></i></button>
    </div>
  );
}
