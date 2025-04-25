import React from "react";
import { Link } from "react-router-dom";
import { Buttom } from "./Buttom";
import Swal from "sweetalert2";
import Api from "../services/Api";

export default function Acciones({ url }) {
  const Delete = () => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Quieres realizar la acción solicitada",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, realizar",
      cancelButtonText: "No, cancelar",
    })
};

  return (
    <div className="d-flex justify-content-center aling-content-center">
      <Link className="btn btn-primary" to={url}>
        <i className="far fa-edit"></i>
      </Link>
      <Buttom
        title="Eliminar"
        style="btn btn-danger ms-1"
        type="buttom"
        onClick=''
        text={<i className="far fa-trash-alt"></i>}
      />
    </div>
  );
}
