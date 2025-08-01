import Swal from "sweetalert2";
import Api from "../services/Api";

export function Alerta(mensaje) {
  let message = mensaje;
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "success",
    title: message,
  });
}
export function AlertaError(mensaje) {
          Swal.fire({
            icon: "warning",
            title: "ERROR...",
            text: mensaje,
            confirmButtonText: "Cerrar", // Cambia el texto del botón
            customClass: {
              confirmButton: "btn btn-danger", // Aplica clases personalizadas al botón
            },
            buttonsStyling: false, // Desactiva los estilos predeterminados de SweetAlert2
          });
}

export default Alerta;
