import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../services/Api";
import { ContainerIput } from "../../components/ContainerInput";
import SelectControl from "../../components/SelectDependiente";
import {
  AlertaError,
  AlertaWarning,
} from "../../components/Alert";
import { Buttom } from "../../components/Buttom";
import { useAuth } from "../../context/AuthContext";
import Stepper from "../../components/Stepper";
import { Create } from "../../components/Link";
import Swal from "sweetalert2"; // Importar SweetAlert2

export function HorarioCreate() {
  const [secciones, setSecciones] = useState([]);
  const [trimestres, setTrimestres] = useState([]);
  const [trimestresFiltrados, setTrimestresFiltrados] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
  const [trimestreSeleccionado, setTrimestreSeleccionado] = useState(null);
  const [lapsoSeleccionado, setLapsoSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const { lapsoActual, lapsos } = useAuth();

  useEffect(() => {
    if (seccionSeleccionada) {
      const seccion = secciones.find((s) => s.id === seccionSeleccionada.value);
      if (seccion) {
        const filtrados = trimestres.filter(
          (t) => t.trayecto_id === seccion.trayecto_id
        );
        setTrimestresFiltrados(filtrados);
        setTrimestreSeleccionado(null);
      }
    } else {
      setTrimestresFiltrados([]);
      setTrimestreSeleccionado(null);
    }
  }, [seccionSeleccionada, trimestres, secciones]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!lapsoActual?.id) return;
        const resSecciones = await Api.get(`/secciones`, {
          params: { lapso: lapsoActual?.id },
        });
        setSecciones(resSecciones.data);

        const resTrimestres = await Api.get("/get_trimestres");
        setTrimestres(resTrimestres.data);
      } catch (error) {
        AlertaError("Error al cargar datos: " + error.message);
      }
    };
    fetchData();
  }, [lapsoActual]);

  // NUEVA FUNCIÓN: Verificar si existe horario anterior
  const verificarHorarioAnterior = async (seccionId, trimestreId) => {
    try {
      const response = await Api.get(
        `/secciones/${seccionId}/horarios/anterior`,
        {
          params: { trimestre_actual: trimestreId },
        }
      );
      return response.data.existe_anterior;
    } catch (error) {
      console.error("Error al verificar horario anterior:", error);
      return false;
    }
  };

  // NUEVA FUNCIÓN: Crear horario automático
  const crearHorarioAutomatico = async (horarioId, seccionId, trimestreId) => {
    try {
      const response = await Api.post(
        `/horarios/${horarioId}/crear_automatico`,
        {
          seccion_id: seccionId,
          trimestre_id: trimestreId,
        }
      );
      return response.data;
    } catch (error) {
      AlertaError(
        error.response?.data?.message || "Error al crear horario automático"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seccionSeleccionada || !trimestreSeleccionado || !lapsoSeleccionado) {
      AlertaWarning("Debes seleccionar una sección y un trimestre");
      return;
    }

    setCargando(true);

    try {
      // 1. CREAR EL HORARIO BASE
      const payload = {
        seccion_id: seccionSeleccionada.value,
        trimestre_id: trimestreSeleccionado.value,
        lapso_academico: lapsoSeleccionado.value,
        nombre: `Horario ${seccionSeleccionada.label} - ${trimestreSeleccionado.label}`,
        estado: "BORRADOR",
      };

      const response = await Api.post(
        `/secciones/${seccionSeleccionada.value}/horarios`,
        payload
      );

      const nuevoHorarioId = response.data.id;

      // 2. VERIFICAR SI EXISTE HORARIO ANTERIOR PARA COPIAR
      const existeAnterior = await verificarHorarioAnterior(
        seccionSeleccionada.value,
        trimestreSeleccionado.value
      );

      if (existeAnterior) {
        // 3. MOSTRAR CONFIRMACIÓN AL USUARIO CON SWEETALERT2
        const confirmResult = await Swal.fire({
          title: "¿Copiar horario anterior?",
          html: "Se ha encontrado un horario correspondiente al trimestre anterior para esta sección. ¿Deseas copiar y  generar automáticamente las unidades curriculares del nuevo trimestre?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Sí, copiar automáticamente",
          cancelButtonText: "No, crear vacío",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          allowOutsideClick: true,
          showCloseButton: true,
        });

        if (confirmResult.isConfirmed) {
          // Mostrar alerta de carga
          Swal.fire({
            title: "Creando horario...",
            text: "Por favor, espera mientras se genera el horario automáticamente.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          // 4. EJECUTAR CREACIÓN AUTOMÁTICA
          const resultado = await crearHorarioAutomatico(
            nuevoHorarioId,
            seccionSeleccionada.value,
            trimestreSeleccionado.value
          );

          // Cerrar alerta de carga
          Swal.close();

          // 5. MOSTRAR REPORTE DE LO REALIZADO
          if (resultado.success) {
            // Construir el mensaje usando el reporte_detallado del backend
            const reporte = resultado.reporte_detallado;

            let mensajeHTML = `
            <div style="text-align: left; max-height: 400px; overflow-y: auto;">
              <h4 style="color: #28a745; margin-bottom: 15px;">✅ ${
                resultado.mensaje || "Horario creado automáticamente"
              }</h4>
              
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <h5 style="margin-bottom: 10px;">📊 Resumen de la Operación</h5>
                <p><strong>Sección:</strong> ${reporte.seccion}</p>
                <p><strong>Trimestre Anterior:</strong> ${
                  reporte.trimestre_anterior
                }</p>
                <p><strong>Trimestre Nuevo:</strong> ${
                  reporte.trimestre_nuevo
                }</p>
              </div>

              <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <h5 style="margin-bottom: 10px;">📈 Estadísticas de Unidades curriculares</h5>
                <p><strong>Unidades curriculares en horario anterior:</strong> ${
                  reporte.clases_en_horario_anterior
                }</p>
                <p><strong>Unidades curriculares copiadas exitosamente:</strong> ${
                  reporte.clases_copiadas_exitosamente
                }</p>
                <p><strong>Unidades curriculares eliminadas (NO pertenecen al nuevo trimestre):</strong> ${
                  reporte.clases_eliminadas_sin_uc
                }</p>
                <p><strong>Unidades curriculares finales en nuevo horario:</strong> ${
                  reporte.clases_finales_en_nuevo_horario
                }</p>
              </div>

              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <p><strong>📋 Total de Unidades curriculares creadas:</strong> ${
                  resultado.clases_creadas
                }</p>
                <p><strong>⚡ Conflictos resueltos:</strong> ${
                  resultado.conflictos_resueltos || 0
                }</p>
              </div>
          `;

            // Agregar advertencias si existen
            if (resultado.advertencias && resultado.advertencias.length > 0) {
              mensajeHTML += `
              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <h5 style="color: #856404; margin-bottom: 10px;">⚠️ Advertencias</h5>
                <ul style="margin: 0; padding-left: 20px;">
                  ${resultado.advertencias
                    .map((adv) => `<li style="margin-bottom: 5px;">${adv}</li>`)
                    .join("")}
                </ul>
              </div>
            `;
            }

            mensajeHTML += `
            <div style="margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 5px;">
              <p style="margin: 0; color: #155724;"><strong>💡 Puedes revisar y ajustar el horario en la siguiente pantalla.</strong></p>
            </div>
          </div>
          `;

            // Mostrar reporte con SweetAlert2 en un modal más grande
            await Swal.fire({
              title: "¡Horario Creado Exitosamente!",
              html: mensajeHTML,
              icon: "success",
              confirmButtonText: "Continuar al Horario",
              confirmButtonColor: "#3085d6",
              width: "700px",
              padding: "2em",
              customClass: {
                popup: "custom-swal-popup",
                title: "custom-swal-title",
              },
              allowOutsideClick: false,
              showCloseButton: true,
            });
          } else {
            await Swal.fire({
              title: "Atención",
              text:
                "El horario se creó pero hubo problemas al generar las clases automáticamente: " +
                resultado.error,
              icon: "warning",
              confirmButtonText: "Continuar",
            });
          }

          // Redirigir después de la copia automática
          navigate(`/horarios/${nuevoHorarioId}/clases`, {
            state: {
              message: "Horario creado exitosamente",
              horarioCreadoAutomaticamente: true,
            },
          });
          return; // Salir de la función
        } else if (confirmResult.dismiss) {
          // ⚠️ EL USUARIO CERRÓ LA ALERTA (botón cerrar o clic fuera)
          // NO hacer nada y evitar que continúe el flujo
          setCargando(false);
          return; // ⬅️ IMPORTANTE: Salir de la función aquí
        } else {
          // El usuario hizo clic en "No, crear vacío"
          await Swal.fire({
            title: "Horario Creado",
            text: "Horario creado vacío. Puedes agregar las clases manualmente.",
            icon: "info",
            confirmButtonText: "Continuar al Horario",
          });

          // Redirigir después de confirmar "crear vacío"
          navigate(`/horarios/${nuevoHorarioId}/clases`, {
            state: {
              message: "Horario creado exitosamente",
              horarioCreadoAutomaticamente: false,
            },
          });
          return; // Salir de la función
        }
      }

      // 6. REDIRIGIR SOLO SI NO EXISTE HORARIO ANTERIOR
      // Esta línea solo se ejecuta si NO existe horario anterior
      navigate(`/horarios/${nuevoHorarioId}/clases`, {
        state: {
          message: "Horario creado exitosamente",
          horarioCreadoAutomaticamente: false,
        },
      });
    } catch (error) {
      Swal.close();
      AlertaError(
        "Error al crear horario: " +
          (error.response?.data?.message || error.message)
      );
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (lapsoActual) {
      setLapsoSeleccionado({
        value: lapsoActual.nombre_lapso,
        label: lapsoActual.nombre_lapso,
      });
    }
  }, [lapsoActual]);

  const seccionOptions = secciones.map((s) => ({
    value: s.id,
    label: s.nombre,
  }));

  const trimestreOptions = trimestresFiltrados.map((t) => ({
    value: t.id,
    label: t.nombre,
  }));

  const lapsosOptions = lapsos.map((t) => ({
    value: t.id,
    label: t.nombre_lapso,
  }));

  return (
    <>
      <Stepper steps={["NUEVO HORARIO", "CLASES"]} currentStep={1} />
      <form onSubmit={handleSubmit}>
        <ContainerIput
          title="NUEVO HORARIO"
          link={
            <Create
              path="/horarios"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              <SelectControl
                label="SECCIÓN"
                name="seccion"
                options={seccionOptions}
                value={seccionSeleccionada}
                onChange={(option) => setSeccionSeleccionada(option)}
              />
              <SelectControl
                label="TRIMESTRE"
                name="trimestre"
                options={trimestreOptions}
                value={trimestreSeleccionado}
                onChange={(option) => setTrimestreSeleccionado(option)}
              />
              <SelectControl
                label="LAPSO ACADÉMICO"
                name="lapso"
                options={lapsosOptions}
                value={lapsoSeleccionado}
                onChange={(option) => setLapsoSeleccionado(option)}
                hidden={true}
              />
            </>
          }
          buttom={
            <>
              <Buttom
                type="submit"
                style={`btn btn-success ${cargando ? "disabled" : ""}`}
                text={cargando ? "Creando..." : "Guardar Horario"}
                disabled={cargando}
              />
              <Buttom
                text="Limpiar"
                title="Limpiar"
                type="button"
                onClick={() => {
                  setSeccionSeleccionada(null);
                  setTrimestreSeleccionado(null);
                  setLapsoSeleccionado(
                    lapsoActual
                      ? {
                          value: lapsoActual.nombre_lapso,
                          label: lapsoActual.nombre_lapso,
                        }
                      : null
                  );
                }}
                style="btn-secondary ms-1"
                disabled={cargando}
              />
            </>
          }
        />
      </form>
    </>
  );
}
