import Swal from "sweetalert2";
import Api from "../services/Api";

// Configuración global de SweetAlert2
const swalConfig = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  customClass: {
    popup: "custom-swal-popup",
    title: "custom-swal-title",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
};

// Alerta de éxito (toast)
export function Alerta(mensaje) {
  const Toast = Swal.mixin(swalConfig);

  Toast.fire({
    icon: "success",
    title: mensaje,
    background: "#f0f9f0",
    color: "#155724",
    iconColor: "#28a745",
  });
}
// Alerta de error
export function AlertaError(mensaje, title = "Error") {
  return Swal.fire({
    icon: "error",
    title: title,
    text: mensaje,
    confirmButtonText: "Cerrar",
    customClass: {
      confirmButton: "btn btn-danger",
    },
    buttonsStyling: false,
    background: '#fdf2f2',
    color: '#721c24',
    iconColor: '#dc3545'
  });
}

// Alerta de éxito mejorada (modal)
export function AlertaSuccess(mensaje, title = "¡Éxito!") {
  return Swal.fire({
    icon: "success",
    title: title,
    text: mensaje,
    confirmButtonText: "Aceptar",
    customClass: {
      confirmButton: "btn btn-success",
      popup: 'custom-swal-popup',
    },
    buttonsStyling: false,
    background: '#fff',
    color: '#333'
  });
}

// Alerta de carga
export function AlertaLoading(mensaje = "Procesando...") {
  return Swal.fire({
    title: mensaje,
    allowEscapeKey: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      popup: 'custom-swal-popup',
    },
    background: '#fff',
    color: '#333'
  });
}

// Alerta de confirmación (mejorada)
export function AlertaConfirm(mensaje, title = "¿Estás seguro?", confirmarText = "Sí, confirmar", cancelarText = "Cancelar") {
  return Swal.fire({
    title: title,
    text: mensaje,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmarText,
    cancelButtonText: cancelarText,
    customClass: {
      confirmButton: "btn btn-primary me-2",
      cancelButton: "btn btn-secondary",
      popup: 'custom-swal-popup',
    },
    buttonsStyling: false,

    focusCancel: true,
    background: '#fff',
    color: '#333',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  });
}

// Alerta de advertencia
export function AlertaWarning(mensaje, title = "Advertencia") {
  return Swal.fire({
    icon: "warning",
    title: title,
    html: mensaje,
    confirmButtonText: "Entendido",
    customClass: {
      confirmButton: "btn btn-warning",
    },
    buttonsStyling: false,
    background: '#fff9eb',
    color: '#856404',
    iconColor: '#ffc107'
  });
}

export default Alerta;
