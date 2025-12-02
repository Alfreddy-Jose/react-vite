// components/ConfirmarHorasExtras.jsx
import Swal from "sweetalert2";

/**
 * Componente para confirmar asignación de horas extras a docentes
 * @param {Object} docenteInfo - Información del docente
 * @param {string} docenteInfo.nombre - Nombre del docente
 * @param {number} docenteInfo.horasBase - Horas base contratadas
 * @param {number} docenteInfo.horasAsignadas - Horas ya asignadas
 * @param {number} docenteInfo.horasNuevas - Nuevas horas a asignar (opcional para redimensión)
 * @param {number} docenteInfo.duracionNueva - Nueva duración (solo para redimensión)
 * @param {number} docenteInfo.duracionOriginal - Duración original (solo para redimensión)
 * @param {number} horasExtras - Horas extras necesarias
 * @param {string} tipoOperacion - Tipo de operación: "redimensión", "nueva", "edición"
 * @returns {Promise} - Promise con el resultado de la confirmación
 */
const confirmarHorasExtras = async (
  docenteInfo,
  horasExtras,
  tipoOperacion = "redimensión"
) => {
  const {
    nombre,
    horasBase,
    horasAsignadas,
    horasNuevas,
    duracionNueva,
    duracionOriginal,
  } = docenteInfo;

  let mensaje = "";
  let titulo = "⚠️ HORAS EXTRAS REQUERIDAS";

  if (tipoOperacion === "redimensión") {
    const ampliacion = duracionNueva - duracionOriginal;
    const totalConRedimension = horasAsignadas + duracionNueva;

    mensaje = `
      <div style="text-align: left; line-height: 1.6; font-size: 14px;">
        <p><strong>Docente:</strong> ${nombre}</p>
        <p><strong>Horas base:</strong> ${horasBase} hrs</p>
        <p><strong>Horas ya asignadas:</strong> ${horasAsignadas} hrs</p>
        <p><strong>Ampliación solicitada:</strong> +${ampliacion} hrs</p>
        <p><strong>Total con redimensión:</strong> ${totalConRedimension} hrs</p>
        <p style="color: #dc3545; font-weight: bold;">Horas extras necesarias: ${horasExtras} hr(s)</p>
        <br>
        <p>¿Desea asignar <strong>${horasExtras} hora(s) extra</strong> a este docente?</p>
      </div>
    `;
  } else if (tipoOperacion === "nueva") {
    const totalConNuevaClase = horasAsignadas + horasNuevas;

    mensaje = `
      <div style="text-align: left; line-height: 1.6; font-size: 14px;">
        <p><strong>Docente:</strong> ${nombre}</p>
        <p><strong>Horas base:</strong> ${horasBase} hrs</p>
        <p><strong>Horas ya asignadas:</strong> ${horasAsignadas} hrs</p>
        <p><strong>Nueva clase:</strong> ${horasNuevas} hrs</p>
        <p><strong>Total con nueva clase:</strong> ${totalConNuevaClase} hrs</p>
        <p style="color: #dc3545; font-weight: bold;">Horas extras necesarias: ${horasExtras} hr(s)</p>
        <br>
        <p>¿Desea asignar <strong>${horasExtras} hora(s) extra</strong> a este docente?</p>
      </div>
    `;
  } else if (tipoOperacion === "edición") {
    const totalConEdicion = horasAsignadas + horasNuevas;

    mensaje = `
      <div style="text-align: left; line-height: 1.6; font-size: 14px;">
        <p><strong>Docente:</strong> ${nombre}</p>
        <p><strong>Horas base:</strong> ${horasBase} hrs</p>
        <p><strong>Horas ya asignadas:</strong> ${horasAsignadas} hrs</p>
        <p><strong>Esta clase:</strong> ${horasNuevas} hrs</p>
        <p><strong>Total con esta clase:</strong> ${totalConEdicion} hrs</p>
        <p style="color: #dc3545; font-weight: bold;">Horas extras necesarias: ${horasExtras} hr(s)</p>
        <br>
        <p>¿Desea asignar <strong>${horasExtras} hora(s) extra</strong> a este docente?</p>
      </div>
    `;
  }

  const resultado = await Swal.fire({
    title: titulo,
    html: mensaje,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, asignar horas extras",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    customClass: {
      confirmButton: "btn btn-primary me-2",
      cancelButton: "btn btn-secondary",
    },
    buttonsStyling: false,
    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });

  return resultado;
};

export default confirmarHorasExtras;
