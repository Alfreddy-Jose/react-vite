import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import "./style.css";
import Alerta, { AlertaConfirm, AlertaError } from "../../components/Alert";
import Api from "../../services/Api";
import SelectControl from "../../components/SelectDependiente";
import { ContainerIput } from "../../components/ContainerInput";
import { Link } from "react-router-dom";

function Evento({
  id,
  evento,
  onResizeStart,
  isResizing,
  onEditar,
  onEliminar,
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: evento.id,
    data: { evento },
  });

  const [menuAbierto, setMenuAbierto] = React.useState(false);

  // Cierra el menú si se hace click fuera
  React.useEffect(() => {
    if (!menuAbierto) return;
    const handleClick = () => setMenuAbierto(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuAbierto]);

  const estilo = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: evento.color,
    height: `${evento.duracion * 60 - 4}px`,
  };

  return (
    <div
      id={id}
      ref={(node) => {
        setNodeRef(node);
      }}
      style={estilo}
      className={`evento ${isResizing ? "evento-resizing" : ""}`}
      data-event-id={evento.id}
      {...attributes}
      {...listeners}
    >
      {/* Menú de tres puntitos */}
      <div
        style={{
          position: "absolute",
          top: 4,
          right: 6,
          zIndex: 2,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span
          onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onClick={(e) => {
            e.stopPropagation();
            setMenuAbierto((v) => !v);
          }}
          style={{
            fontSize: 18,
            padding: "2px 6px",
            borderRadius: 4,
            background: menuAbierto ? "#eee" : "transparent",
          }}
        >
          &#8942;
        </span>
        {menuAbierto && (
          <div
            style={{
              position: "fixed",
              top: 4,
              left: 22,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 4,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 10,
              minWidth: 120,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dropdown-item"
              style={{
                width: "100%",
                border: "none",
                background: "none",
                textAlign: "left",
                padding: "6px 12px",
                cursor: "pointer",
              }}
              onClick={() => {
                setMenuAbierto(false);
                onEditar(evento);
              }}
            >
              Modificar
            </button>
            <button
              className="dropdown-item text-danger"
              style={{
                width: "100%",
                border: "none",
                background: "none",
                textAlign: "left",
                padding: "6px 12px",
                cursor: "pointer",
              }}
              onClick={() => {
                setMenuAbierto(false);
                onEliminar(evento);
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
      {/* Contenido del evento */}
      {evento.texto}
      <div
        className="event-resizer"
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeStart(evento.id, e.clientY, e.currentTarget.parentElement);
        }}
      />
    </div>
  );
}

function Celda({
  id,
  bloqueId,
  eventosDia,
  onResizeStart,
  onEditar,
  onEliminar,
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const bloqueActual = parseInt(id.split("-")[1]);

  // Memoizar el cálculo de eventos para mejorar rendimiento
  const eventosEnCelda = React.useMemo(() => {
    return eventosDia.filter((e) => {
      const bloqueInicio = e.bloque;
      const bloqueFin = e.bloque + e.duracion - 1;
      return bloqueId >= bloqueInicio && bloqueId <= bloqueFin;
    });
  }, [eventosDia, bloqueId]);

  // Función para verificar si el evento comienza en esta celda
  const eventoComienzaAqui = (evento) => evento.bloque === bloqueId;

  return (
    <td
      ref={setNodeRef}
      style={{
        minWidth: "100px",
        height: "60px",
        position: "relative",
        padding: 0,
        border: "1px solid #ddd",
        backgroundColor: isOver ? "#f0f8ff" : "transparent", // Feedback visual al arrastrar
      }}
    >
      {eventosEnCelda.map(
        (evento) =>
          eventoComienzaAqui(evento) && (
            <Evento
              key={`${evento.id}-${bloqueActual}`} // Key más específica
              evento={evento}
              id={`evento-${evento.id}`}
              onResizeStart={onResizeStart}
              onEditar={onEditar}
              onEliminar={onEliminar}
            />
          )
      )}
    </td>
  );
}

export default function Calendar(horarioId) {
  const [bloques, setBloques] = useState([]);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoRecienAgregado, setEventoRecienAgregado] = useState(null);
  const [todosLosEventos, setTodosLosEventos] = useState([]);
  const [eventos, setEventos] = useState([]);

  // cargar todas las clases
  const todasLasClases = async () => {
    try {
      const response = await Api.get(`/clases`);
      const eventoTodos = response.data;
      // Formatear clases para usar luego
      const clasesFormateados = eventoTodos.map((clase) => ({
        id: clase.id.toString(),
        dia: clase.dia,
        bloque: clase.bloque_id,
        duracion: clase.duracion,
        materias: {
          value: clase.unidad_curricular_id,
          label: clase.unidad_curricular.nombre,
        },
        aula: { value: clase.espacio_id, label: clase.espacio.nombre_aula },
        docente: {
          value: clase.docente_id,
          label:
            clase.docente.persona.nombre + " " + clase.docente.persona.apellido,
        },
      }));
      setTodosLosEventos(clasesFormateados);
    } catch (error) {
      AlertaError("Error al cargar todas las Clases en general " + " " + error);
      console.error(error);
    }
  };

  // Al cargar el componente
  const cargarClases = async () => {
    try {
      const response = await Api.get(`/horarios/${horarioId.horarioId}/clases`);
      const evento = response.data;

      const eventosFormateados = evento.map((evento) => ({
        id: evento.id.toString(),
        dia: evento.dia,
        bloque: evento.bloque_id,
        duracion: evento.duracion,
        texto: `${evento.unidad_curricular.nombre}\n${
          evento.docente.persona.nombre + " " + evento.docente.persona.apellido
        }\n${evento.espacio.nombre_aula}`,
        color: "#e3f2fd",
        // Mantener referencias para edición
        sede: { value: evento.sede_id, label: evento.sede.nombre_sede },
        pnf: { value: evento.pnf_id, label: evento.pnf.nombre },
        materias: {
          value: evento.unidad_curricular_id,
          label: evento.unidad_curricular.nombre,
        },
        aula: { value: evento.aula_id, label: evento.espacio.nombre_aula },
        trimestre: {
          value: evento.trimestre_id,
          label: evento.trimestre.nombre,
        },
        trayecto: { value: evento.trayecto_id, label: evento.trayecto.nombre },
        docente: {
          value: evento.docente_id,
          label:
            evento.docente.persona.nombre +
            " " +
            evento.docente.persona.apellido,
        },
      }));
      setEventos(eventosFormateados);
    } catch (error) {
      AlertaError("Error al cargar los eventos" + " " + error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (horarioId) {
      obtenerBloques();
      cargarClases();
      todasLasClases();
    }
  }, [horarioId]);

  const exportarPDF = async () => {
    try {
      // Preparar datos para el encabezado - asegurar nombres correctos
      const datosParaPDF = {
        encabezado: {
          // Nombre exacto
          sede: "SEDE CENTRAL (UPTYAB)",
          trayecto: "III",
          trimestre: "II",
          seccion: "753501",
          lapso: "2025-4",
          laboratorios: [
            "LABORATORIO SIMON BOLIVAR: ELECTIVA III",
            "LABORATORIO HUGO CHAVEZ: ING SW II",
            "LABORATORIO HUGO CHAVEZ: MODELADO BD",
          ],
        },
        bloques: bloques.map((b) => ({
          id: b.id,
          rango: b.rango,
        })),
        eventos: eventos.map((e) => ({
          id: e.id,
          dia: e.dia,
          bloque: e.bloque,
          duracion: e.duracion,
          texto: e.texto,
          color: e.color,
        })),
        dias: dias,
      };

      console.log(
        "Datos enviados a Laravel:",
        JSON.stringify(datosParaPDF, null, 2)
      );
      // Enviar datos al backend
      const response = await Api.post("/generar_horario_pdf", datosParaPDF, {
        responseType: "blob",
      });

      // Crear y descargar el PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "horario.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error detallado:", error.response.data);
        if (error.response.data.errors) {
          AlertaError(
            "Errores de validación: " +
              JSON.stringify(error.response.data.errors)
          );
        }
      } else {
        AlertaError("Error al exportar PDF: " + error.message);
        console.log(error.message);
      }
      console.error(error);
    }
  };
  const obtenerBloques = async () => {
    try {
      const response = await Api.get("/bloques");
      setBloques(response.data);
    } catch (error) {
      AlertaError("Error al cargar las sedes");
      console.error(error);
    }
  };

  const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

  // Datos para selects
  const [sedes, setSedes] = useState([]);
  const [sedeSelecionada, setSedeSeleccionada] = useState([]);

  useEffect(() => {
    const obtenerSedes = async () => {
      try {
        const response = await Api.get("/horarios/sedes");
        setSedes(response.data);
        setSedeSeleccionada(response.data[0]); // Selecciona la primera sede por defecto
      } catch (error) {
        AlertaError("Error al cargar las sedes");
        console.error(error);
      }
    };
    obtenerSedes();
  }, []);

  const [pnfs, setPnfs] = useState([]);
  const [pnfSeleccionado, setPnfSeleccionado] = useState([]);

  const [aulas, setAulas] = useState([]);
  const [aulaSeleccionada, setAulaSeleccionada] = useState([]);

  const [trimestres, setTrimestres] = useState([]);
  const [trimestreSeleccionada, setTrimestreSeleccionada] = useState([]);

  const [trayectos, setTrayecto] = useState([]);
  const [trayectoSeleccionado, setTrayectoSeleccionado] = useState([]);

  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState([]);

  const [docentes, setDocentes] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState([]);

  useEffect(() => {
    const obtenerTrayectos = async () => {
      try {
        const response = await Api.get(`/horarios/trayectos`);
        setTrayecto(response.data);
        setTrayectoSeleccionado(response.data[0]); // Selecciona el primer trayecto por defecto
      } catch (error) {
        AlertaError("Error al cargar los trayectos");
        console.error(error);
      }
    };
    obtenerTrayectos();
  }, []);

  useEffect(() => {
    if (eventoRecienAgregado) {
      const elemento = document.getElementById(
        `evento-${eventoRecienAgregado}`
      );
      if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth", block: "center" });
        elemento.classList.add("highlight");

        setTimeout(() => {
          elemento.classList.remove("highlight");
        }, 2500);
      }
    }
  }, [eventoRecienAgregado]);

  const obtenerValor = (prop) => {
    if (prop === null || prop === undefined) {
      return prop;
    }

    if (typeof prop === "object") {
      if ("value" in prop) {
        return prop.value;
      }
      if ("id" in prop) {
        return prop.id;
      }
      if (prop instanceof Date) {
        return prop.toISOString();
      }
      return JSON.stringify(prop);
    }

    return prop;
  };

  // Función para actualizar el evento en la base de datos
  const actualizarEventoEnBD = useCallback(async (eventoActualizado) => {
    try {
      if (!eventoActualizado || !eventoActualizado.id) {
        console.error("Evento inválido para actualizar:", eventoActualizado);
        return;
      }

      let eventoId = eventoActualizado.id;
      if (typeof eventoId === "object" && eventoId !== null) {
        // Si el ID es un objeto, intentar extraer el valor real
        if (eventoId.value !== undefined) {
          eventoId = eventoId.value;
        } else if (eventoId.id !== undefined) {
          eventoId = eventoId.id;
        } else {
          console.error(
            "ID de evento en formato de objeto no reconocido:",
            eventoId
          );
          return;
        }
      }

      eventoId = eventoId.toString();

      // Asegurarse de extraer correctamente los valores numéricos
      const bloqueValue = obtenerValor(eventoActualizado.bloque);
      const bloqueId =
        typeof bloqueValue === "object"
          ? parseInt(obtenerValor(bloqueValue))
          : parseInt(bloqueValue);

      const payload = {
        dia: eventoActualizado.dia,
        bloque_id: bloqueId,
        duracion: eventoActualizado.duracion,
      };

      await Api.put(`/clase/${eventoId}`, payload);
    } catch (error) {
      if (error.response) {
        console.error(
          "Error del servidor:",
          error.response.status,
          error.response.data
        );
        AlertaError(
          `Error ${error.response.status}: ${
            error.response.data.message || "Error al actualizar el evento"
          }`
        );
      } else {
        console.error("Error al actualizar evento:", error.message);
        AlertaError("Error al actualizar el evento: " + error.message);
      }
    }
  }, []);

  // Adaptar datos para react-select
  const sedesOptions = sedes.map((s) => ({
    value: s.value || s.id,
    label: s.label || s.nombre_sede,
  }));
  const docentesOptions = docentes.map((d) => ({
    value: d.value || d.id,
    label: d.label || d.persona.nombre_completo,
    horas: d.horas_dedicacion,
  }));
  const pnfOptions = pnfs.map((p) => ({
    value: p.id,
    label: p.nombre,
  }));
  const aulaOptions = aulas.map((a) => ({ value: a.id, label: a.nombre_aula }));
  const diaOptions = dias.map((d) => ({ value: d, label: d }));
  const bloqueOptions = bloques.map((b) => ({
    value: b.id,
    label: `${b.rango}`,
  }));
  const trayectoOptions = trayectos.map((t) => ({
    value: t.id,
    label: t.nombre,
  }));
  const trimestreOptions = trimestres.map((t) => ({
    value: t.id,
    label: t.nombre,
  }));
  const materiasOptions = materias.map((m) => ({
    value: m.id,
    label: m.text,
  }));

  // Nuevo evento con valores compatibles con react-select
  const [nuevoEvento, setNuevoEvento] = useState({
    sede: null,
    pnf: null,
    trayecto: null,
    trimestre: null,
    materia: null,
    docente: null,
    aula: null,
    dia: null,
    bloque: null,
    duracion: 1,
  });

  const resizeData = useRef({
    initialY: null,
    initialDuracion: null,
    tempDuracion: null,
    elemento: null,
  });

  const [activeEvent, setActiveEvent] = useState(null);
  const [resizingEventId, setResizingEventId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = useCallback(
    ({ active }) => {
      if (!resizingEventId) {
        // Solo permite arrastrar si no estamos redimensionando
        const evento = eventos.find((e) => e.id === active.id);
        if (evento) {
          setActiveEvent(evento);
        }
      }
    },
    [eventos, resizingEventId]
  );

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      if (!over || !activeEvent) {
        setActiveEvent(null);
        return;
      }

      const [newDia, newBloque] = over.id.split("-");
      const bloqueNum = parseInt(newBloque);
      const duracionEvento = activeEvent.duracion;

      setEventos((prevEventos) => {
        const eventoActivo = prevEventos.find((e) => e.id === active.id);
        if (!eventoActivo) return prevEventos;

        // Validación robusta de solapamiento
        const haySolapamiento = prevEventos.some(
          (e) =>
            e.id !== active.id &&
            e.dia === newDia &&
            bloqueNum < e.bloque + e.duracion &&
            bloqueNum + duracionEvento > e.bloque
        );

        if (!haySolapamiento) {
          const nuevosEventos = prevEventos.map((e) =>
            e.id === active.id ? { ...e, dia: newDia, bloque: bloqueNum } : e
          );

          // Actualizar en la base de datos
          const eventoActualizado = nuevosEventos.find(
            (e) => e.id === active.id
          );

          if (eventoActualizado) {
            setTimeout(() => {
              actualizarEventoEnBD(eventoActualizado);
            }, 0);
          }

          return nuevosEventos;
        }
        AlertaError("¡Ya existe un evento en ese rango de bloques!");
        return prevEventos;
      });

      setActiveEvent(null);
    },
    [activeEvent, actualizarEventoEnBD]
  );

  useEffect(() => {
    if (!isResizing) return;

    let isMounted = true;
    const controller = new AbortController();

    const handleMouseMove = (e) => {
      if (!resizingEventId || !resizeData.current.initialY) return;

      const deltaY = e.clientY - resizeData.current.initialY;
      const nuevaDuracion = Math.max(
        1,
        Math.round(resizeData.current.initialDuracion + deltaY / 60)
      );

      resizeData.current.tempDuracion = nuevaDuracion;
      if (resizeData.current.elemento) {
        resizeData.current.elemento.style.height = `${
          nuevaDuracion * 60 - 4
        }px`;
      }
    };

    const handleMouseUp = async () => {
      if (!isMounted) return;

      if (resizingEventId && resizeData.current.tempDuracion) {
        // Encontrar el evento original
        const eventoOriginal = eventos.find((e) => e.id === resizingEventId);
        const duracionOriginal = eventoOriginal
          ? eventoOriginal.duracion
          : null;
        const duracionNueva = resizeData.current.tempDuracion;
        const bloqueActual = eventoOriginal.bloque;
        const diaActual = eventoOriginal.dia;
        // Validación robusta de solapamiento para resize
        const haySolapamiento = eventos.some(
          (e) =>
            e.id !== resizingEventId &&
            e.dia === diaActual &&
            bloqueActual < e.bloque + e.duracion &&
            bloqueActual + duracionNueva > e.bloque
        );
        if (haySolapamiento) {
          AlertaError("¡Ya existe un evento en ese rango de bloques!");
          // Restaurar tamaño anterior SOLO si el valor en el estado ya cambió
          setEventos((prev) =>
            prev.map((ev) =>
              ev.id === resizingEventId && ev.duracion !== duracionOriginal
                ? { ...ev, duracion: duracionOriginal }
                : ev
            )
          );
          // También restaurar visualmente el alto del elemento si existe
          if (resizeData.current.elemento) {
            resizeData.current.elemento.style.height = `${
              duracionOriginal * 60 - 4
            }px`;
          }
          setIsResizing(false);
          setResizingEventId(null);
          return;
        }

        const materiaId =
          eventoOriginal.materias?.value ||
          eventoOriginal.materia ||
          eventoOriginal.materia_id;

        // traer horas semanales desde la base de datos
        const response = await Api.get(`/unidad_curricular/${materiaId}/horas`);
        const horasMateria = response.data.hora_total_est || 0;
        console.log("horas de la materia " + horasMateria);

        const horasUsadasMateria = eventos
          .filter(
            (e) =>
              e.id !== resizingEventId &&
              ((e.materias && e.materias.value === materiaId) ||
                e.materia === materiaId ||
                e.materia_id === materiaId)
          )
          .reduce((acc, e) => acc + (e.duracion || 1), 0);
        console.log("Horas usadas de la materia " + horasUsadasMateria);

        if (horasUsadasMateria + duracionNueva > horasMateria) {
          AlertaError("¡Las horas semanales de la materia se agotaron!");
          setEventos((prev) =>
            prev.map((ev) =>
              ev.id === resizingEventId && ev.duracion !== duracionOriginal
                ? { ...ev, duracion: duracionOriginal }
                : ev
            )
          );
          if (resizeData.current.elemento) {
            resizeData.current.elemento.style.height = `${
              duracionOriginal * 60 - 4
            }px`;
          }
          setIsResizing(false);
          setResizingEventId(null);
          return;
        }

        // Crear una copia con la duración actualizada
        if (eventoOriginal) {
          const diferencia = duracionNueva - duracionOriginal;
          const docenteId =
            eventoOriginal.docente?.value || eventoOriginal.docente_id;
          const respuesta = await Api.get(`/docente/${docenteId}`);
          const horasActuales = respuesta.data.horas_dedicacion;
          const horasRestantes = horasActuales - diferencia;

          // Si las horas quedan en 0 o menos, preguntar antes de continuar
          if (diferencia > 0 && horasRestantes <= 0) {
            const confirmacion = await AlertaConfirm(
              "La cantidad de horas dedicadas del docente se ha excedido",
              "¿Deseas continuar?",
              "Continuar"
            );
            if (!confirmacion.isConfirmed) {
              // Restaurar tamaño anterior SOLO si el valor en el estado ya cambió
              setEventos((prev) =>
                prev.map((ev) =>
                  ev.id === resizingEventId && ev.duracion !== duracionOriginal
                    ? { ...ev, duracion: duracionOriginal }
                    : ev
                )
              );
              if (resizeData.current.elemento) {
                resizeData.current.elemento.style.height = `${
                  duracionOriginal * 60 - 4
                }px`;
              }
              setIsResizing(false);
              setResizingEventId(null);
              return;
            }
          }

          if (diferencia !== 0 && docenteId) {
            await Api.put(
              `/docente_horas/${docenteId}?horas_dedicacion=${-diferencia}`
            );
          }

          const eventoConDuracionActualizada = {
            ...eventoOriginal,
            duracion: duracionNueva,
          };
          setTimeout(() => {
            actualizarEventoEnBD(eventoConDuracionActualizada);
          }, 0);
        }

        // Actualizamos el estado con el valor final
        setEventos((prev) =>
          prev.map((ev) =>
            ev.id === resizingEventId ? { ...ev, duracion: duracionNueva } : ev
          )
        );
      }

      // Limpiamos después de la actualización
      setIsResizing(false);
      setResizingEventId(null);

      // Restauramos el control a React
      setTimeout(() => {
        resizeData.current = {
          initialY: null,
          initialDuracion: null,
          tempDuracion: null,
          elemento: null,
        };
      }, 100);
    };

    // Agregar event listeners con la opción once
    document.addEventListener("mousemove", handleMouseMove, {
      signal: controller.signal,
    });
    document.addEventListener("mouseup", handleMouseUp, {
      once: true,
      signal: controller.signal,
    });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    isResizing,
    resizingEventId,
    eventos,
    actualizarEventoEnBD,
    materiaSeleccionada,
  ]);

  const handleResizeStart = useCallback(
    (eventoId, startY, element) => {
      const evento = eventos.find((e) => e.id === eventoId);
      if (!evento) return;

      resizeData.current = {
        initialY: startY,
        initialDuracion: evento.duracion,
        tempDuracion: evento.duracion,
        elemento: element,
      };

      setResizingEventId(eventoId);
      setIsResizing(true);
    },
    [eventos]
  );

  // Formulario para agregar eventos

  const handleInputChange = (e) => {
    setNuevoEvento((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAgregarEvento = async (e) => {
    e.preventDefault();
    if (
      !sedeSelecionada ||
      !pnfSeleccionado ||
      !trayectoSeleccionado ||
      !docenteSeleccionado ||
      !trimestreSeleccionada ||
      !materiaSeleccionada ||
      !nuevoEvento.dia ||
      nuevoEvento.bloque === null
    ) {
      AlertaError("Completa todos los campos");
      return;
    }

    const bloqueNum = parseInt(nuevoEvento.bloque.value);
    const duracionNum = parseInt(nuevoEvento.duracion);

    // Evitar solapamientos (validación robusta)
    const haySolapamiento = eventos.some(
      (e) =>
        e.dia === nuevoEvento.dia.value &&
        bloqueNum < e.bloque + e.duracion &&
        bloqueNum + duracionNum > e.bloque
    );
    if (haySolapamiento) {
      AlertaError("¡Ya existe una clase en ese rango de bloques!");
      return;
    }

    // evitar solapamiento de docentes
    const haySolaplamientoDocente = todosLosEventos.some(
      (e) =>
        e.docente.value === nuevoEvento.docente.value &&
        e.dia === nuevoEvento.dia.value &&
        bloqueNum < e.bloque + e.duracion &&
        bloqueNum + duracionNum > e.bloque
    );
    if (haySolaplamientoDocente) {
      AlertaError(
        "¡El docente ya tiene una clase en ese rango de bloques en otro horario!"
      );
      return;
    }

    //evitar solapamiento de aulas
    const haySolapamientoAula = todosLosEventos.some(
      (e) =>
        e.aula.value === nuevoEvento.aula.value &&
        e.dia === nuevoEvento.dia.value &&
        bloqueNum < e.bloque + e.duracion &&
        bloqueNum + duracionNum > e.bloque
    );
    if (haySolapamientoAula) {
      AlertaError(
        "¡El aula ya tiene una clase en ese rango de bloques en otro horario!"
      );
      return;
    }

    console.log("Docente seleccionado " + docenteSeleccionado.id);
    console.log("Materia seleccionada " + nuevoEvento.materia);
    console.log(
      "Horas de la materia seleccionada " + materiaSeleccionada?.horas
    );
    console.log("Duracion " + duracionNum);
    console.log("Docente seleccionado " + nuevoEvento?.docente.value);

    console.log(materiaSeleccionada?.horas);
    const hyCoincidencia = eventos.some(
      (e) => e.materias?.value === nuevoEvento.materia.value
    );
    console.log(hyCoincidencia);

    console.log(nuevoEvento.materia.value);

    // Calcular la suma de horas ya usadas para la materia
    console.log("Filtrando eventos...");
    console.log(
      "Valor de nuevoEvento.materia.value:",
      nuevoEvento.materia.value
    );
    console.log("Valores de e.materias?.value en eventos:");
    eventos.forEach((e) => {
      console.log(e.materias?.value);
    });
    console.log("Valores de e.duracion en eventos:");
    eventos.forEach((e) => {
      console.log(e.duracion);
    });
    console.log(
      "valor de materiaSeleccionada?.horas:",
      materiaSeleccionada?.horas
    );

    const horasUsadasMateria = eventos
      .filter((e) => {
        e.materias?.value &&
          nuevoEvento.materia.value &&
          e.materias?.value === nuevoEvento.materia.value;
        return e.materias?.value === nuevoEvento.materia.value;
      })
      .reduce((acc, e) => acc + (e.duracion || 1), 0);
    const horasMateria = materiaSeleccionada?.horas || 0;
    console.log(
      `Horas usadas de la materia: ${nuevoEvento.materia.label} => ${horasUsadasMateria}`
    );
    console.log(
      `Horas usadas con el nuevo evento: ${
        horasUsadasMateria + duracionNum
      } de ${horasMateria} horas semanales de la materia`
    );
    if (horasUsadasMateria + duracionNum > horasMateria) {
      AlertaError("¡Las horas semanales de la materia se agotaron!");
      return;
    }
    console.log(
      "Las horas dedicadas del docente son " +
        docenteSeleccionado.horas_dedicacion
    );
    console.log(
      "Horas del docente antes de agregar el evento " +
        docenteSeleccionado.horas_dedicacion
    );

    if (docenteSeleccionado.horas_dedicacion - duracionNum < 0) {
      const respuesta = AlertaConfirm(
        "La cantidad de horas dedicadas del docente se ha excedido",
        "¿Deseas continuar?",
        "Continuar"
      );
      if (!(await respuesta).isConfirmed) {
        return;
      }
    }

    // Calcular la cantidad de bloques
    const cantidadDeBloques = bloques.length;

    if (materiaSeleccionada?.horas < duracionNum) {
      AlertaError("¡Las horas semanales de la materia se agotaron!");
      return;
    } else if (cantidadDeBloques < duracionNum) {
      AlertaError("¡No hay suficientes bloques!");
      return;
    }

    const payload = {
      horario_id: horarioId.horarioId,
      sede_id: parseInt(nuevoEvento.sede.value),
      pnf_id: parseInt(nuevoEvento.pnf.value),
      trayecto_id: parseInt(nuevoEvento.trayecto.value),
      trimestre_id: parseInt(nuevoEvento.trimestre.value),
      unidad_curricular_id: parseInt(nuevoEvento.materia.value),
      docente_id: parseInt(nuevoEvento.docente.value),
      espacio_id: parseInt(nuevoEvento.aula.value),
      dia: nuevoEvento.dia.value,
      bloque_id: parseInt(nuevoEvento.bloque.value),
      duracion: nuevoEvento.duracion,
    };
    console.log("Datos ENVIADOS: " + payload);

    try {
      // Enviar datos al backend
      const response = await Api.post(`/clases`, payload);
      const response2 = await Api.put(
        `/docente_horas/${payload.docente_id}?horas_dedicacion=${-duracionNum}`
      );
      console.log(response2.message);
      
      if (response2) {
        Alerta(response2.message);
      }
      let eventoDesdeBackend = null;
      if (response.data && response.data.clase && response.data.clase.id) {
        eventoDesdeBackend = response.data.clase.id;
      } else {
        AlertaError(
          "La respuesta del backend no contiene el id del evento. Verifica la estructura de la respuesta."
        );
        return;
      }

      setEventos([
        ...eventos,
        {
          id: eventoDesdeBackend.toString(),
          dia: nuevoEvento.dia.value,
          bloque: Number(nuevoEvento.bloque.value),
          duracion: duracionNum,
          materias: nuevoEvento.materia,
          aula: nuevoEvento.aula.value,
          sede: nuevoEvento.sede,
          pnf: nuevoEvento.pnf,
          trayecto: nuevoEvento.trayecto,
          docente: nuevoEvento.docente,
          trimestre: nuevoEvento.trimestre.value,
          texto: `${nuevoEvento.materia.label}\n${nuevoEvento.docente.label}\n${nuevoEvento.aula.label}`,
          color: "#e3f2fd",
        },
      ]);
      setEventoRecienAgregado(eventoDesdeBackend.toString());
    } catch (error) {
      AlertaError(
        "Error al guardar la clase" + " " + error.response.data.message
      );
      //mostrar error detallado en consola
      console.log(
        "Error detalles:",
        error.response ? error.response.data : error.message
      );
      console.log(error);
      return;
    }

    setNuevoEvento({
      sede: null,
      pnf: null,
      trayecto: null,
      trimestre: null,
      aula: null,
      dia: null,
      bloque: null,
      docente: null,
      materia: null,
      duracion: 1,
    });
  };

  return (
    <div>
      <form
        className="mb-4 d-flex flex-wrap gap-2"
        onSubmit={handleAgregarEvento}
      >
        <ContainerIput
          title={"NUEVO EVENTO"}
          input={
            <>
              <SelectControl
                label="SEDE"
                name="sede"
                value={nuevoEvento.sede}
                options={sedesOptions}
                onChange={async (option) => {
                  setSedeSeleccionada(
                    sedes.find((e) => String(e.id) === String(option?.value)) ||
                      {}
                  );
                  setPnfs([]);
                  setPnfSeleccionado(null);
                  setNuevoEvento((prev) => ({
                    ...prev,
                    sede: option,
                    pnf: null,
                    aula: null,
                  }));

                  // Cargar aulas cuando se seleccione una sede
                  if (option) {
                    try {
                      const response = await Api.get(
                        `/horarios/sede/${option.value}/espacios`
                      );
                      setAulas(response.data);
                      setAulaSeleccionada(response.data[0]);
                    } catch (error) {
                      AlertaError("Error al cargar las aulas");
                      console.log(error);
                    }
                  }
                }}
                onValueChange={async (option) => {
                  // Cargar PNFs cuando cambie la sede
                  if (option) {
                    try {
                      const response = await Api.get(
                        `/horarios/sedes/${option.value}/pnfs`
                      );
                      setPnfs(response.data);
                      setPnfSeleccionado(response.data[0]);
                    } catch (error) {
                      AlertaError("Error al cargar los PNFs");
                      console.log(error);
                    }
                  }
                }}
              />
              <SelectControl
                label="PNF"
                name="pnf"
                value={nuevoEvento.pnf}
                options={pnfOptions}
                onChange={(option) => {
                  setPnfSeleccionado(
                    pnfs.find((e) => String(e.id) === String(option?.value)) ||
                      null
                  );
                  setNuevoEvento((prev) => ({
                    ...prev,
                    pnf: option,
                    docente: null,
                    materia: null,
                  }));
                }}
              />
              <SelectControl
                label="TRAYECTO"
                name="trayecto"
                value={nuevoEvento.trayecto}
                options={trayectoOptions}
                onChange={(option) => {
                  setTrayectoSeleccionado(
                    trayectos.find(
                      (e) => String(e.id) === String(option?.value)
                    ) || {}
                  );
                  setTrimestres([]);
                  setTrimestreSeleccionada(null);
                  setNuevoEvento((prev) => ({
                    ...prev,
                    trayecto: option,
                    trimestre: null,
                  }));
                }}
                onValueChange={async (option) => {
                  if (option) {
                    try {
                      const response = await Api.get(
                        `/horarios/trayectos/${option.value}/trimestres`
                      );
                      setTrimestres(response.data);
                      setTrimestreSeleccionada(response.data[0]);
                    } catch (error) {
                      AlertaError("Error al cargar los trimestres");
                      console.log(error);
                    }
                  }
                }}
              />
              <SelectControl
                label="TRIMESTRE"
                name="trimestre"
                value={nuevoEvento.trimestre}
                options={trimestreOptions}
                onChange={(option) => {
                  setTrimestreSeleccionada(
                    trimestres.find(
                      (t) => String(t.id) === String(option?.value)
                    ) || null
                  );
                  setNuevoEvento((prev) => ({
                    ...prev,
                    trimestre: option,
                    materia: null,
                  }));
                }}
                onValueChange={async (option) => {
                  if (option) {
                    try {
                      const response = await Api.get(
                        `/horarios/trimestres/${option.value}/unidadesCurriculares`
                      );
                      setMaterias(response.data);
                      setMateriaSeleccionada(response.data[0]);
                    } catch (error) {
                      AlertaError("Error al cargar las materias");
                      console.log(error);
                    }
                  }
                }}
              />
              <SelectControl
                label="UNIDAD CURRICULAR"
                name="materias"
                value={nuevoEvento.materia}
                options={materiasOptions}
                onChange={(option) => {
                  setMateriaSeleccionada(
                    materias.find(
                      (m) => String(m.id) === String(option?.value)
                    ) || null
                  );
                  setNuevoEvento((prev) => ({
                    ...prev,
                    materia: option,
                    docente: null,
                    duracion: 1,
                  }));
                }}
                onValueChange={async (option) => {
                  if (option) {
                    try {
                      const response = await Api.get(
                        `/docentes/unidadesPnfs?pnf_id=${pnfSeleccionado.id}&unidad_curricular_id=${option.value}`
                      );
                      setDocentes(response.data);
                      setDocenteSeleccionado(response.data[0]);
                    } catch (error) {
                      AlertaError("Error al cargar las materias");
                      console.log(error);
                    }
                  }
                }}
              />
              <SelectControl
                label="DOCENTE"
                name="docente"
                value={nuevoEvento.docente}
                options={docentesOptions}
                onChange={(option) => {
                  setDocenteSeleccionado(
                    docentes.find(
                      (e) => String(e.id) === String(option?.value)
                    ) || null
                  );
                  setNuevoEvento((prev) => ({ ...prev, docente: option }));
                }}
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    color:
                      state.data.horas !== undefined && state.data.horas < 3
                        ? "#fff"
                        : "#333",
                    backgroundColor:
                      state.data.horas !== undefined && state.data.horas < 3
                        ? "#dc3545"
                        : state.isSelected
                        ? "#2684FF"
                        : "#fff",
                  }),
                }}
              />
              <SelectControl
                label="AULA"
                name="aula"
                value={nuevoEvento.aula}
                options={aulaOptions}
                onChange={(option) => {
                  setAulaSeleccionada(
                    aulas.find((e) => String(e.id) === String(option?.value)) ||
                      null
                  );
                  setNuevoEvento((prev) => ({ ...prev, aula: option }));
                }}
              />
              <SelectControl
                label="DÍA"
                name="dia"
                value={nuevoEvento.dia}
                options={diaOptions}
                onChange={(option) =>
                  setNuevoEvento((prev) => ({ ...prev, dia: option }))
                }
              />
              <SelectControl
                label="BLOQUE"
                name="bloque"
                value={nuevoEvento.bloque}
                options={bloqueOptions}
                onChange={(option) =>
                  setNuevoEvento((prev) => ({ ...prev, bloque: option }))
                }
              />
              <div className="col-sm-5 col-xl-3">
                <label htmlFor="duracion" className="mt-4">
                  DURACIÓN (BLOQUES)
                </label>
                <input
                  type="number"
                  name="duracion"
                  min={1}
                  max={
                    materiaSeleccionada?.horas ? materiaSeleccionada.horas : 15
                  }
                  value={nuevoEvento.duracion}
                  onChange={handleInputChange}
                  style={{ width: 140 }}
                  id="duracion"
                  className="form-control"
                  required
                />
              </div>
            </>
          }
          buttom={
            <>
              <button type="submit" className="btn traslation btn-success">
                Agregar Evento
              </button>
              <button
                type="reset"
                className="btn btn-secondary traslation ms-1"
                onClick={() =>
                  setNuevoEvento({
                    sede: null,
                    pnf: null,
                    trayecto: null,
                    trimestre: null,
                    aula: null,
                    dia: null,
                    bloque: null,
                    docente: null,
                    materia: null,
                    duracion: 1,
                  })
                }
              >
                Limpiar
              </button>
            </>
          }
        />
      </form>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <button
          className="btn btn-danger mb-3 traslation"
          onClick={exportarPDF}
        >
          Generar PDF
        </button>
        <table className="table table-bordered table-striped text-center">
          <thead>
            <tr>
              <th style={{ minWidth: "100px" }}>HORA</th>
              {dias.map((dia) => (
                <th key={dia} style={{ minWidth: "100px" }}>
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* verificar si existen bloques sino mostrar un mensaje que lo diga */}
            {bloques.length === 0 && (
              <tr>
                <td colSpan={dias.length + 1}>
                  No hay bloques disponibles. Por favor,&nbsp;&nbsp;
                  <Link to="/turnos">
                    <i className="fas fa-history"></i>
                    <p className="d-inline"> Agregar Turnos.</p>
                  </Link>
                </td>
              </tr>
            )}
            {bloques.map((bloque) => (
              <tr key={bloque.id} style={{ height: "60px" }}>
                <td>{bloque.rango}</td>
                {dias.map((dia) => (
                  <Celda
                    key={`${dia}-${bloque.id}`}
                    id={`${dia}-${bloque.id}`}
                    bloqueId={bloque.id}
                    eventosDia={eventos.filter((e) => e.dia === dia)}
                    onResizeStart={handleResizeStart}
                    onEditar={(evento) => {
                      setEventoEditando(evento);
                      setMostrarModal(true);
                    }}
                    onEliminar={async (evento) => {
                      // Aquí eliminas el evento del estado
                      setEventos((prev) =>
                        prev.filter((e) => e.id !== evento.id)
                      );
                      console.log("Eliminando evento con ID:", evento.id);

                      try {
                        const response = await Api.delete(
                          `/clase/${evento.id}`
                        );
                        console.log("Respuesta de eliminación:", response.data);

                        // Sumar la duración a las horas del docente
                        const docenteId =
                          evento.docente?.value || evento.docente_id;
                        if (docenteId) {
                          await Api.put(
                            `/docente_horas/${docenteId}?horas_dedicacion=${evento.duracion}`
                          );
                        }
                        setEventos((prev) =>
                          prev.filter((e) => e.id !== evento.id)
                        );
                      } catch (error) {
                        AlertaError("Error al eliminar evento" + " " + error);
                      }
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <DragOverlay>
          {activeEvent && (
            <div
              style={{
                backgroundColor: activeEvent.color,
                padding: "6px",
                borderRadius: "4px",
                whiteSpace: "pre-line",
                fontWeight: "bold",
                textAlign: "center",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
                width: "90%",
                height: `${activeEvent.duracion * 60 - 12}px`,
              }}
            >
              {activeEvent.texto}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {mostrarModal && eventoEditando && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Actualiza el evento en el array
                  console.log(eventoEditando.texto);
                  console.log(eventoEditando);

                  setEventos((prev) =>
                    prev.map((ev) =>
                      ev.id === eventoEditando.id ? eventoEditando : ev
                    )
                  );
                  setMostrarModal(false);
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title fs-5">MODIFICAR EVENTO</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="d-flex d-flex justify-content-center">
                      <SelectControl
                        label="SEDE"
                        name="sede"
                        disabled={true}
                        className="col-sm-12 col-xs-12 col-xl-10"
                        value={eventoEditando.sede}
                        options={sedesOptions}
                        onChange={async (option) => {
                          setSedeSeleccionada(
                            sedes.find(
                              (e) => String(e.id) === String(option?.value)
                            ) || {}
                          );
                          setPnfs([]);
                          setPnfSeleccionado(null);
                          setEventoEditando({
                            ...eventoEditando,
                            sede: option,
                            pnf: null,
                            aula: null,
                          });

                          // Cargar aulas cuando se seleccione una sede
                          if (option) {
                            try {
                              const response = await Api.get(
                                `/horarios/sede/${option.value}/espacios`
                              );
                              setAulas(response.data);
                              setAulaSeleccionada(response.data[0]);
                            } catch (error) {
                              AlertaError("Error al cargar las aulas");
                              console.log(error);
                            }
                          }
                        }}
                        onValueChange={async (option) => {
                          // Cargar PNFs cuando cambie la sede
                          if (option) {
                            try {
                              const response = await Api.get(
                                `/horarios/sedes/${option.value}/pnfs`
                              );
                              setPnfs(response.data);
                              setPnfSeleccionado(response.data[0]);
                              console.log(pnfSeleccionado);
                            } catch (error) {
                              AlertaError("Error al cargar los PNFs");
                              console.log(error);
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="d-flex justify-content-center">
                      <SelectControl
                        label="PNF"
                        name="pnf"
                        className="col-sm-12 col-xs-12 col-xl-10"
                        value={eventoEditando.pnf}
                        options={pnfOptions}
                        onChange={(option) => {
                          setPnfSeleccionado(
                            pnfs.find(
                              (e) => String(e.id) === String(option?.value)
                            ) || null
                          );
                          setEventoEditando({
                            ...eventoEditando,
                            pnf: option,
                            docente: null,
                          });
                          console.log(pnfSeleccionado);
                        }}
                      />
                    </div>

                    <div className="row justify-content-center">
                      <div className="col-md-5 col-sm-12 mb-2 mb-md-0">
                        <SelectControl
                          label="TRAYECTO"
                          name="trayecto"
                          className="w-100"
                          value={eventoEditando.trayecto}
                          options={trayectoOptions}
                          onChange={(option) => {
                            setTrayectoSeleccionado(
                              trayectos.find(
                                (e) => String(e.id) === String(option?.value)
                              ) || null
                            );
                            setEventoEditando({
                              ...eventoEditando,
                              trayecto: option,
                              trimestre: null,
                            });
                          }}
                          onValueChange={async (option) => {
                            if (option) {
                              try {
                                const response = await Api.get(
                                  `/horarios/trayectos/${option.value}/trimestres`
                                );
                                setTrimestres(response.data);
                                setTrimestreSeleccionada(response.data[0]);
                              } catch (error) {
                                AlertaError("Error al cargar los trimestres");
                                console.log(error);
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="col-md-1"></div>
                      <div className="col-md-5 col-sm-12">
                        <SelectControl
                          label="TRIMESTRE"
                          name="trimestre"
                          className="w-100"
                          value={eventoEditando.trimestre}
                          options={trimestreOptions}
                          onChange={(option) => {
                            setTrimestreSeleccionada(
                              trimestres.find(
                                (t) => String(t.id) === String(option?.value)
                              ) || null
                            );
                            setEventoEditando({
                              ...eventoEditando,
                              trimestre: option,
                              materias: null,
                            });
                          }}
                          onValueChange={async (option) => {
                            if (option) {
                              try {
                                const response = await Api.get(
                                  `/horarios/trimestres/${option.value}/unidadesCurriculares`
                                );
                                setMaterias(response.data);
                                setMateriaSeleccionada(response.data[0]);
                                console.log(response.data);
                              } catch (error) {
                                AlertaError("Error al cargar las materias");
                                console.log(error);
                                console.log(eventoEditando.trimestre);
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="d-flex d-flex justify-content-center">
                      <SelectControl
                        label="MATERIA"
                        name="materias"
                        className="col-sm-12 col-xs-12 col-xl-10"
                        value={eventoEditando.materias}
                        options={materiasOptions}
                        onChange={(option) => {
                          setMateriaSeleccionada(
                            materias.find(
                              (m) => String(m.id) === String(option?.value)
                            ) || null
                          );
                          setEventoEditando({
                            ...eventoEditando,
                            materia: option,
                            docente: null,
                          });
                          console.log("pnf value:", eventoEditando.pnf?.value);
                          console.log(
                            "tipo de dato:",
                            typeof eventoEditando.pnf?.value
                          );
                        }}
                        onValueChange={async (option) => {
                          if (eventoEditando.pnf?.value && option.value) {
                            try {
                              const response = await Api.get(
                                `/docentes/unidadesPnfs?pnf_id=${pnfSeleccionado.id}&unidad_curricular_id=${option.value}`
                              );
                              setDocentes(response.data);
                              setDocenteSeleccionado(response.data[0]);
                            } catch (error) {
                              AlertaError("Error al cargar las docentes");
                              console.log(error);
                            }
                          }
                        }}
                      />
                    </div>

                    <div className="d-flex d-flex justify-content-center">
                      <SelectControl
                        label="DOCENTE"
                        name="docente"
                        className="col-sm-12 col-xs-12 col-xl-10"
                        value={eventoEditando.docente}
                        options={docentesOptions}
                        onChange={(option) => {
                          setDocenteSeleccionado(
                            docentes.find(
                              (e) => String(e.id) === String(option?.value)
                            ) || null
                          );
                          setEventoEditando({
                            ...eventoEditando,
                            docente: option,
                            texto: `${eventoEditando.materia?.label}\n${option.label}\n${eventoEditando.aula?.label} `,
                          });
                        }}
                      />
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-5 col-sm-12 mb-2 mb-md-0">
                        <SelectControl
                          label="AULA"
                          name="aula"
                          className="col-sm-12 col-xs-12 col-xl-10"
                          value={eventoEditando.aula}
                          options={aulaOptions}
                          onChange={(option) => {
                            setAulaSeleccionada(
                              aulas.find(
                                (e) => String(e.id) === String(option?.value)
                              ) || null
                            );
                            setEventoEditando({
                              ...eventoEditando,
                              aula: option,
                            });
                          }}
                        />
                      </div>
                      <div className="col-md-1"></div>{" "}
                      {/* Espacio entre columnas */}
                      <div className="col-md-5 col-sm-12">
                        <label className="form-label mt-4">DURACIÓN</label>
                        <input
                          type="number"
                          className="form-control"
                          min={1}
                          value={eventoEditando.duracion}
                          onChange={(e) =>
                            setEventoEditando({
                              ...eventoEditando,
                              duracion: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn traslation btn-secondary"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn traslation btn-primary">
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DroppableCell({ id, evento, onResize }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <td
      ref={setNodeRef}
      style={{
        minWidth: 100,
        minHeight: 40,
        position: "relative",
        backgroundColor: isOver ? "#f0f0f0" : "transparent",
      }}
    >
      {evento && <Celda evento={evento} onResize={onResize} />}
    </td>
  );
}
