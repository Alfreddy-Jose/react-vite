import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
import Alerta, {
  AlertaConfirm,
  AlertaError,
  AlertaWarning,
} from "../../components/Alert";
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
              Editar
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

  // Obtener el bloque actual del ID de la celda
  const bloqueActual = parseInt(id.split("-")[1]);

  // Memoizar el cálculo de eventos para mejorar rendimiento
  const eventosEnCelda = React.useMemo(() => {
    return eventosDia.filter((evento) => {
      const bloqueInicio = evento.bloque;
      const bloqueFin = evento.bloque + evento.duracion - 1;
      // El evento debe mostrarse en esta celda si el bloqueActual está dentro de su rango
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
        backgroundColor: isOver ? "#f0f8ff" : "transparent",
      }}
    >
      {eventosEnCelda.map(
        (evento) =>
          eventoComienzaAqui(evento) && (
            <Evento
              key={`${evento.id}-${bloqueActual}`}
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
  const todasLasClases = useCallback(async () => {
    try {
      const trimestreActualId = horarioId?.horario?.trimestre_id;
      const horarioActualId = horarioId?.horarioId;

      if (!trimestreActualId || !horarioActualId) {
        console.error("Faltan trimestre_id o horario_id");
        return;
      }

      // Usar tu endpoint específico
      const response = await Api.get(
        `/clases/trimestre/${trimestreActualId}/horario/${horarioActualId}`
      );
      const eventoTodos = response.data;

      const clasesFormateados = eventoTodos.map((clase) => ({
        id: clase.id.toString(),
        dia: clase.dia,
        bloque: clase.bloque_id,
        duracion: clase.duracion,
        trimestre_id: clase.trimestre_id,
        docente: {
          value: clase.docente_id,
          label:
            clase.docente.persona.nombre + " " + clase.docente.persona.apellido,
          horas_dedicacion: clase.docente.horas_dedicacion, // Incluir las horas del docente
        },
        materias: {
          value: clase.unidad_curricular_id,
          label: clase.unidad_curricular.nombre,
          horas: clase.unidad_curricular.hora_total_est,
        },
        aula: {
          value: clase.espacio_id,
          label: clase.espacio.nombre_aula,
        },
        // Mantener todos los campos necesarios
        sede_id: clase.sede_id,
        pnf_id: clase.pnf_id,
        trayecto_id: clase.trayecto_id,
        horario_id: clase.horario_id,
      }));

      setTodosLosEventos(clasesFormateados);
      console.log(
        `✅ Cargadas ${clasesFormateados.length} clases del trimestre ${trimestreActualId} y horario ${horarioActualId}`
      );
    } catch (error) {
      AlertaError("Error al cargar todas las Clases: " + error);
      console.error("Error en todasLasClases:", error);
    }
  }, [horarioId?.horario?.trimestre_id, horarioId?.horarioId]);

  // Al cargar el componente
  const cargarClases = useCallback(async () => {
    try {
      // Cargar todas las clases del horario
      const response = await Api.get(`/horarios/${horarioId.horarioId}/clases`);
      const evento = response.data;

      // Normalizar nombres de días
      const normalizarDia = (dia) => {
        const mapaDias = {
          MIERCOLES: "MIÉRCOLES",
          MARTES: "MARTES",
          LUNES: "LUNES",
          JUEVES: "JUEVES",
          VIERNES: "VIERNES",
          SABADO: "SÁBADO",
        };
        return mapaDias[dia.toUpperCase()] || dia;
      };

      // Luego de obtener las clases del horario, cargar las materias y aulas
      obtenerMaterias(horarioId.horario);
      // Formatear clases para el calendario
      const eventosFormateados = evento.map((evento) => ({
        id: evento.id.toString(),
        dia: normalizarDia(evento.dia),
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
        aula: { value: evento.espacio_id, label: evento.espacio.nombre_aula },
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
  }, [horarioId.horario, horarioId.horarioId]);

  useEffect(() => {
    if (horarioId) {
      obtenerBloques();
      cargarClases();
      todasLasClases();
    }
  }, [horarioId, cargarClases, todasLasClases]); // Agregar las dependencias

  const obtenerMaterias = async (infoHorario) => {
    // cargar materias segun el trimestre
    try {
      const response = await Api.get(
        `/horarios/trimestres/${infoHorario?.trimestre?.id}/unidadesCurriculares`
      );
      setMaterias(response.data);
      setMateriaSeleccionada(response.data[0]);
    } catch (error) {
      AlertaError("Error al cargar las materias");
      console.log(error.message);
    }
    // cargar aulas segun la sede
    try {
      const response = await Api.get(
        `/horarios/sede/${infoHorario?.seccion?.sede_id}/espacios`
      );
      setAulas(response.data);
      setAulaSeleccionada(response.data[0]);
    } catch (error) {
      AlertaError("Error al cargar las aulas");
      console.log(error);
    }
  };

  const exportarPDF = async (horarioId) => {
    try {
      // Enviar solo el ID del horario al backend
      const response = await Api.get(
        `/generar_horario_pdf/${horarioId.horarioId}`,
        {
          responseType: "blob",
        }
      );
      const nombrePDF = `Horario_Sección_${horarioId?.horario?.seccion?.nombre}_trimestre_${horarioId?.horario?.trimestre?.nombre_relativo}.pdf`;
      // Crear y descargar el PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", nombrePDF);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      if (error.response && error.response.data) {
        AlertaError("Error al exportar PDF: " + error.response.data.error);
      } else {
        AlertaError("Error al exportar PDF: " + error.message);
      }
    }
  };
  const obtenerBloques = async () => {
    try {
      const response = await Api.get("/bloques");
      setBloques(response.data);
    } catch (error) {
      AlertaError("Error al cargar los bloques de horas");
      console.error(error);
    }
  };

  const dias = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

  // Datos para select

  const [aulas, setAulas] = useState([]);
  const [aulaSeleccionada, setAulaSeleccionada] = useState([]);

  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState([]);

  const [docentes, setDocentes] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState([]);

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

  const recargarDatosCompletos = useCallback(async () => {
    await cargarClases();
    await todasLasClases();
  }, [cargarClases, todasLasClases]);

  // Función para calcular horas usadas por docente en el lapso/trimestre actual
  const calcularHorasUsadasPorDocente = useCallback(
    (docenteId) => {
      return todosLosEventos
        .filter((evento) => {
          const idDocenteEvento = evento.docente?.value || evento.docente_id;
          return idDocenteEvento == docenteId;
        })
        .reduce((total, evento) => total + (evento.duracion || 1), 0);
    },
    [todosLosEventos]
  );

  // Función para actualizar el evento en la base de datos
  const actualizarEventoEnBD = useCallback(
    async (eventoActualizado) => {
      try {
        if (!eventoActualizado || !eventoActualizado.id) {
          console.error("Evento inválido para actualizar:", eventoActualizado);
          return;
        }

        let eventoId = eventoActualizado.id;
        if (typeof eventoId === "object" && eventoId !== null) {
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

        // Recargar todos los datos después de actualizar
        await recargarDatosCompletos();
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
    },
    [recargarDatosCompletos]
  ); // Agregar recargarDatosCompletos como dependencia

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

  // Función para calcular horas usadas por materia
  const calcularHorasUsadasPorMateria = useCallback(
    (materiaId) => {
      return eventos
        .filter((evento) => {
          const idMateriaEvento =
            evento.materias?.value || evento.materia || evento.materia_id;
          return idMateriaEvento == materiaId;
        })
        .reduce((total, evento) => total + (evento.duracion || 1), 0);
    },
    [eventos]
  );

  // Bloques disponibles: solo los que no están ocupados por el docente ni el aula en ese día y permiten la duración seleccionada
  const getBloquesConDisponibilidad = () => {
    if (!nuevoEvento.dia || !nuevoEvento.docente || !nuevoEvento.aula)
      return bloques.map((b) => ({
        ...b,
        disponible: true,
        razones: [],
      }));

    const dia = nuevoEvento.dia.value;
    const docenteId = nuevoEvento.docente.value;
    const aulaId = nuevoEvento.aula.value;
    const duracion = parseInt(nuevoEvento.duracion) || 1;

    // Obtener ocupaciones para docente y aula
    const ocupacionesDocente = new Set();
    const ocupacionesAula = new Set();
    const ocupacionesHorarioActual = new Set();

    // Ocupaciones en todos los horarios (docente y aula)
    todosLosEventos.forEach((evento) => {
      if (evento.dia === dia) {
        for (let i = 0; i < evento.duracion; i++) {
          if (evento.docente?.value === docenteId) {
            ocupacionesDocente.add(evento.bloque + i);
          }
          if (evento.aula?.value === aulaId) {
            ocupacionesAula.add(evento.bloque + i);
          }
        }
      }
    });

    // Ocupaciones en el horario actual (para evitar solapamiento)
    eventos.forEach((evento) => {
      if (evento.dia === dia) {
        for (let i = 0; i < evento.duracion; i++) {
          ocupacionesHorarioActual.add(evento.bloque + i);
        }
      }
    });

    return bloques.map((bloque) => {
      const razones = [];
      let disponible = true;

      // Verificar si hay espacio suficiente para la duración
      for (let i = 0; i < duracion; i++) {
        const bloqueActual = bloque.id + i;

        // Verificar ocupación en horario actual
        if (ocupacionesHorarioActual.has(bloqueActual)) {
          razones.push("Ocupado en este horario");
          disponible = false;
          break;
        }

        // Verificar ocupación del docente
        if (ocupacionesDocente.has(bloqueActual)) {
          razones.push("Docente ocupado");
          disponible = false;
          break;
        }

        // Verificar ocupación del aula
        if (ocupacionesAula.has(bloqueActual)) {
          razones.push("Aula ocupada");
          disponible = false;
          break;
        }
      }

      return {
        value: bloque.id,
        label: bloque.rango,
        disponible,
        razones: [...new Set(razones)], // Eliminar duplicados
        // Propiedades para estilos
        colorFondo: disponible ? "#ffffff" : "#f8f9fa",
        colorTexto: disponible ? "#333333" : "#6c757d",
        estado: disponible ? "normal" : "no-disponible",
        isDisabled: !disponible,
      };
    });
  };

  const bloqueOptionsConDisponibilidad = getBloquesConDisponibilidad();

  const CustomOption = ({ innerProps, label, data, isDisabled }) => {
    if (isDisabled || data?.isDisabled) {
      return (
        <div
          {...innerProps}
          style={{
            padding: "8px 12px",
            backgroundColor: "#f8f9fa",
            color: "#6c757d",
            cursor: "not-allowed",
            borderLeft: "3px solid #dc3545",
            position: "relative",
          }}
          title={data?.razones?.join(", ") || "No disponible"}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{label}</span>
            <span style={{ fontSize: "12px", color: "#dc3545" }}>
              ⚠ No disponible
            </span>
          </div>
          {data?.razones && data.razones.length > 0 && (
            <div
              style={{ fontSize: "11px", marginTop: "4px", color: "#6c757d" }}
            >
              {data.razones.join(", ")}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        {...innerProps}
        style={{
          padding: "8px 12px",
          cursor: "pointer",
          borderLeft: "3px solid #28a745",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{label}</span>
          <span style={{ fontSize: "12px", color: "#28a745" }}>
            ✓ Disponible
          </span>
        </div>
      </div>
    );
  };

  // Función para obtener estilos condicionales
  const getSelectStyles = (selectedOption) => {
    const estado = selectedOption?.estado;

    return {
      option: (provided, state) => {
        const optionData = state.data;
        let backgroundColor = provided.backgroundColor;
        let color = provided.color;
        let cursor = "default";
        let fontWeight = "normal";

        if (state.isDisabled || optionData?.isDisabled) {
          backgroundColor = "#f8f9fa";
          color = "#6c757d";
          cursor = "not-allowed";
        } else if (optionData?.estado === "critico") {
          backgroundColor = state.isSelected ? "#dc3545" : "#dc3545";
          color = "#ffffff";
          fontWeight = "bold";
        } else if (optionData?.estado === "advertencia") {
          backgroundColor = state.isSelected ? "#ffc107" : "#ffc107";
          color = "#212529";
        } else if (optionData?.estado === "no-disponible") {
          backgroundColor = "#f8f9fa";
          color = "#6c757d";
          cursor = "not-allowed";
        } else if (state.isSelected) {
          backgroundColor = "#2684FF";
          color = "#ffffff";
        } else if (state.isFocused) {
          backgroundColor = "#f8f9fa";
        }

        return {
          ...provided,
          backgroundColor,
          color,
          cursor,
          fontWeight,
          position: "relative",
          ":hover": {
            backgroundColor:
              state.isDisabled || optionData?.isDisabled
                ? "#f8f9fa"
                : state.isSelected
                ? "#2684FF"
                : "#f8f9fa",
            color:
              state.isDisabled || optionData?.isDisabled
                ? "#6c757d"
                : state.isSelected
                ? "#ffffff"
                : "#333333",
          },
        };
      },
      singleValue: (provided, state) => ({
        ...provided,
        backgroundColor: selectedOption?.colorFondo || provided.backgroundColor,
        color: selectedOption?.colorTexto || provided.color,
        fontWeight: selectedOption?.estado === "critico" ? "bold" : "normal",
        padding: "2px 6px",
        borderRadius: "4px",
      }),
      control: (provided, state) => ({
        ...provided,
        borderColor:
          estado === "critico"
            ? "#dc3545"
            : estado === "advertencia"
            ? "#ffc107"
            : estado === "no-disponible"
            ? "#6c757d"
            : provided.borderColor,
        boxShadow:
          estado === "critico"
            ? "0 0 0 1px #dc3545"
            : estado === "advertencia"
            ? "0 0 0 1px #ffc107"
            : estado === "no-disponible"
            ? "0 0 0 1px #6c757d"
            : provided.boxShadow,
        "&:hover": {
          borderColor:
            estado === "critico"
              ? "#c82333"
              : estado === "advertencia"
              ? "#e0a800"
              : estado === "no-disponible"
              ? "#6c757d"
              : provided.borderColor,
        },
      }),
      menu: (provided) => ({
        ...provided,
        zIndex: 9999,
      }),
    };
  };

  // Adaptar datos para react-select
  const docentesOptions = useMemo(() => {
    return docentes.map((d) => {
      const horasUsadas = calcularHorasUsadasPorDocente(d.id);
      const horasDisponibles = d.horas_dedicacion - horasUsadas;

      // Determinar colores según las horas disponibles
      let colorFondo = "#ffffff";
      let colorTexto = "#333333";
      let estado = "normal";

      if (horasDisponibles <= 1) {
        colorFondo = "#dc3545"; // Rojo
        colorTexto = "#ffffff";
        estado = "critico";
      } else if (horasDisponibles <= 4) {
        colorFondo = "#ffc107"; // Amarillo
        colorTexto = "#212529";
        estado = "advertencia";
      }

      return {
        value: d.id,
        label: d.persona?.nombre_completo || d.label || "Docente",
        labelConHoras: `${
          d.persona?.nombre_completo || d.label || "Docente"
        } (${horasDisponibles}/${d.horas_dedicacion} hrs)`,
        horasDisponibles: horasDisponibles,
        horasBase: d.horas_dedicacion,
        colorFondo,
        colorTexto,
        estado,
        isDisabled: horasDisponibles <= 0,
      };
    });
  }, [docentes, calcularHorasUsadasPorDocente]); // Se recalcula cuando cambian docentes o eventos

  const aulaOptions = aulas.map((a) => ({ value: a.id, label: a.nombre_aula }));
  const diaOptions = dias.map((d) => ({ value: d, label: d }));

  const materiasOptions = useMemo(() => {
    return materias
      .map((m) => {
        const horasUsadas = calcularHorasUsadasPorMateria(m.id);
        const horasDisponibles = m.horas - horasUsadas;

        // Colores para materias
        let colorFondo = "#ffffff";
        let colorTexto = "#333333";
        let estado = "normal";

        if (horasDisponibles <= 1) {
          colorFondo = "#dc3545";
          colorTexto = "#ffffff";
          estado = "critico";
        } else if (horasDisponibles <= 4) {
          colorFondo = "#ffc107";
          colorTexto = "#212529";
          estado = "advertencia";
        }

        return {
          value: m.id,
          label: m.text,
          labelConHoras:
            horasDisponibles > 1
              ? `${m.text} (${horasDisponibles} hrs disponibles)`
              : `${m.text} (SIN HORAS DISPONIBLES)`,
          horasDisponibles: horasDisponibles,
          isDisabled: horasDisponibles <= 1,
          colorFondo,
          colorTexto,
          estado,
        };
      })
      .filter((materia) => materia.horasDisponibles > 1);
  }, [materias, calcularHorasUsadasPorMateria]);

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

        // 1. Validación de solapamiento en el horario actual
        const haySolapamientoHorarioActual = prevEventos.some(
          (e) =>
            e.id !== active.id &&
            e.dia === newDia &&
            bloqueNum < e.bloque + e.duracion &&
            bloqueNum + duracionEvento > e.bloque
        );

        if (haySolapamientoHorarioActual) {
          AlertaWarning(
            "¡Ya existe un evento en ese rango de bloques en este horario!"
          );
          return prevEventos;
        }

        // 2. Validación de solapamiento del docente en todos los horarios
        const docenteId = activeEvent.docente?.value || activeEvent.docente_id;
        const haySolapamientoDocente = todosLosEventos.some(
          (e) =>
            e.id !== active.id && // Excluir el evento actual
            (e.docente?.value === docenteId || e.docente_id === docenteId) &&
            e.dia === newDia &&
            bloqueNum < e.bloque + e.duracion &&
            bloqueNum + duracionEvento > e.bloque
        );

        if (haySolapamientoDocente) {
          AlertaWarning(
            "¡El docente ya tiene una clase en ese rango de bloques en otro horario!"
          );
          return prevEventos;
        }

        // 3. Validación de solapamiento del aula en todos los horarios
        const aulaId = activeEvent.aula?.value || activeEvent.espacio_id;
        const haySolapamientoAula = todosLosEventos.some(
          (e) =>
            e.id !== active.id && // Excluir el evento actual
            (e.aula?.value === aulaId || e.espacio_id === aulaId) &&
            e.dia === newDia &&
            bloqueNum < e.bloque + e.duracion &&
            bloqueNum + duracionEvento > e.bloque
        );

        if (haySolapamientoAula) {
          AlertaWarning(
            "¡El aula ya tiene una clase en ese rango de bloques en otro horario!"
          );
          return prevEventos;
        }

        // Si pasa todas las validaciones, actualizar
        const nuevosEventos = prevEventos.map((e) =>
          e.id === active.id ? { ...e, dia: newDia, bloque: bloqueNum } : e
        );

        // Actualizar en la base de datos
        const eventoActualizado = nuevosEventos.find((e) => e.id === active.id);

        if (eventoActualizado) {
          setTimeout(() => {
            actualizarEventoEnBD(eventoActualizado);
          }, 0);
        }

        return nuevosEventos;
      });

      setActiveEvent(null);
    },
    [activeEvent, actualizarEventoEnBD, todosLosEventos] // Agregar todosLosEventos como dependencia
  );

  useEffect(() => {
    if (!isResizing) return;

    let isMounted = true;
    const controller = new AbortController();

    const handleMouseMove = (e) => {
      if (!resizingEventId || !resizeData.current.initialY) return;

      const deltaY = e.clientY - resizeData.current.initialY;
      const nuevaDuracion = Math.max(
        2,
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
          AlertaWarning("¡Ya existe un evento en ese rango de bloques!");
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

        const horasUsadasMateria = eventos
          .filter((e) => {
            const esMismaMateria =
              e.materias?.value === materiaId ||
              e.materia === materiaId ||
              e.materia_id === materiaId;
            return esMismaMateria;
          })
          .reduce((acc, e) => {
            // Si es el evento que se está redimensionando, usa la duración original
            if (e.id === resizingEventId) {
              return acc + duracionOriginal;
            }
            // Para otros eventos, usa la duración actual
            return acc + (e.duracion || 1);
          }, 0);

        // Ahora comparamos con la NUEVA duración que se quiere aplicar
        const horasTotalesConNuevaDuracion =
          horasUsadasMateria - duracionOriginal + duracionNueva;

        if (horasTotalesConNuevaDuracion > horasMateria) {
          AlertaWarning(`
            <strong>¡Atención! Se ha excedido el límite de horas semanales para esta Unidad Curricular.</strong><br><br>
            Horas permitidas: ${horasMateria}<br>
            Horas usadas actualmente: ${horasUsadasMateria}<br>
            Horas que se quieren agregar: ${
              duracionNueva - duracionOriginal
            }<br>
            Horas totales con la nueva duración: ${horasTotalesConNuevaDuracion}<br><br>
            Por favor, revisa el horario para ajustarlo dentro del límite establecido.
          `);
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
          // Validación de horas del docente
          const docenteId =
            eventoOriginal.docente?.value || eventoOriginal.docente_id;
          const horasUsadasDocente = calcularHorasUsadasPorDocente(docenteId);
          const horasBaseDocente =
            docentes.find((d) => d.id === docenteId)?.horas_dedicacion || 0;

          if (
            horasUsadasDocente - duracionOriginal + duracionNueva >
            horasBaseDocente
          ) {
            AlertaWarning(`
              <strong>¡Atención! El docente ha excedido su dedicación horaria en este período.</strong><br><br>
              Dedicación base: ${horasBaseDocente} hrs<br>
              Horas usadas en el lapso/trimestre: ${horasUsadasDocente} hrs<br>
              Horas que intenta agregar: ${
                duracionNueva - duracionOriginal
              } hrs<br>
              Horas disponibles: ${
                horasBaseDocente - horasUsadasDocente
              } hrs<br><br>
              <em>Nota: Incluye todas las clases de este docente en todos los horarios del mismo lapso académico y trimestre.</em>
          `);

            // Restaurar el tamaño original
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
        await recargarDatosCompletos();
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
    calcularHorasUsadasPorDocente,
    recargarDatosCompletos,
    docentes,
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
      !docenteSeleccionado ||
      !materiaSeleccionada ||
      !docenteSeleccionado ||
      !nuevoEvento.dia ||
      nuevoEvento.bloque === null
    ) {
      AlertaWarning("Completa los campos vacíos");
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
      AlertaWarning("¡Ya existe una clase en ese rango de bloques!");
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
      AlertaWarning(
        "¡El docente ya tiene una clase en ese rango de bloques en otro horario!"
      );
      return;
    }

    //evitar solapamiento de aulas
    const haySolapamientoAula = todosLosEventos.some(
      (e) =>
        e.aula.value === nuevoEvento.aula?.value &&
        e.dia === nuevoEvento.dia.value &&
        bloqueNum < e.bloque + e.duracion &&
        bloqueNum + duracionNum > e.bloque
    );
    if (haySolapamientoAula) {
      AlertaWarning(
        "¡El aula ya tiene una clase en ese rango de bloques en otro horario!"
      );
      return;
    }

    // Evitar exceder el horario de la materia
    const horasUsadasMateria = eventos
      .filter((e) => {
        e.materias?.value &&
          nuevoEvento.materia.value &&
          e.materias?.value === nuevoEvento.materia.value;
        return e.materias?.value === nuevoEvento.materia.value;
      })
      .reduce((acc, e) => acc + (e.duracion || 1), 0);
    const horasMateria = materiaSeleccionada?.horas || 0;

    if (horasUsadasMateria + duracionNum > horasMateria) {
      AlertaWarning(`
        <strong>¡Atención! Se ha excedido el límite de horas semanales para esta Unidad Curricular.</strong><br><br>
        Horas permitidas: ${horasMateria}<br>
        Horas usadas actualmente: ${horasUsadasMateria}<br>
        Horas totales con la nueva clase: ${
          horasUsadasMateria + duracionNum
        }<br><br>
        Por favor, revisa el horario para ajustarlo dentro del límite establecido.
      `);
      return;
    }

    // Calcular la suma de horas ya usadas para el docente
    const horasUsadasDocente = calcularHorasUsadasPorDocente(
      nuevoEvento.docente.value
    );
    const horasBaseDocente =
      docentes.find((d) => d.id === nuevoEvento.docente.value)
        ?.horas_dedicacion || 0;

    if (horasUsadasDocente + duracionNum > horasBaseDocente) {
      AlertaWarning(`
    <strong>¡Atención! El docente ha excedido su dedicación horaria en este período.</strong><br><br>
    Dedicación base: ${horasBaseDocente} hrs<br>
    Horas usadas en el lapso/trimestre: ${horasUsadasDocente} hrs<br>
    Horas que intenta agregar: ${duracionNum} hrs<br>
    Horas disponibles: ${horasBaseDocente - horasUsadasDocente} hrs<br><br>
    <em>Nota: Incluye todas las clases de este docente en todos los horarios del mismo lapso académico y trimestre.</em>
  `);
      return;
    }

    // Calcular la cantidad de bloques
    const cantidadDeBloques = bloques.length;
    if (materiaSeleccionada?.horas < duracionNum) {
      AlertaWarning("¡Las horas semanales de la materia se agotaron!");
      return;
    } else if (cantidadDeBloques < duracionNum) {
      AlertaWarning("¡No hay suficientes bloques!");
      return;
    }

    const payload = {
      horario_id: horarioId.horarioId,
      sede_id: parseInt(horarioId?.horario?.seccion?.sede_id),
      pnf_id: parseInt(horarioId?.horario?.seccion?.pnf_id),
      trayecto_id: parseInt(horarioId?.horario?.seccion?.trayecto_id),
      trimestre_id: parseInt(horarioId?.horario?.trimestre_id),
      unidad_curricular_id: parseInt(nuevoEvento.materia.value),
      docente_id: parseInt(nuevoEvento.docente.value),
      espacio_id: nuevoEvento.aula?.value
        ? parseInt(nuevoEvento.aula?.value)
        : null,
      dia: nuevoEvento.dia.value,
      bloque_id: parseInt(nuevoEvento.bloque.value),
      duracion: nuevoEvento.duracion,
    };

    try {
      // Enviar datos al backend
      const response = await Api.post(`/clases`, payload);

      if (response) {
        Alerta(response.data.message);
      }
      let eventoDesdeBackend = null;
      if (response.data && response.data.clase && response.data.clase.id) {
        eventoDesdeBackend = response.data.clase.id;
      } else {
        AlertaError("Error al guardar la clase.");
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
          aula: nuevoEvento.aula,
          sede: horarioId?.horario?.seccion?.sede_id,
          pnf: horarioId?.horario?.seccion?.pnf_id,
          trayecto: horarioId?.horario?.seccion?.trayecto_id,
          docente: nuevoEvento.docente,
          trimestre: horarioId?.horario?.trimestre_id,
          texto: `${nuevoEvento.materia.label}\n${nuevoEvento.docente.label}\n${nuevoEvento.aula.label}`,
          color: "#e3f2fd",
        },
      ]);
      setTodosLosEventos((prev) => [
        ...prev,
        {
          id: eventoDesdeBackend.toString(),
          dia: nuevoEvento.dia.value,
          bloque: Number(nuevoEvento.bloque.value),
          duracion: duracionNum,
          materias: nuevoEvento.materia,
          aula: nuevoEvento.aula,
          docente: nuevoEvento.docente,
        },
      ]);
      setEventoRecienAgregado(eventoDesdeBackend.toString());
    } catch (error) {
      // si estaus code 422 mostrar el mensaje en el AlertaWarning
      if (error.response && error.response.status === 422) {
        AlertaWarning(error.response?.data?.message || error.message);
        return;
      }
      AlertaError(
        "Error al guardar la clase" +
          " " +
          (error.response?.data?.message || error.message)
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
    await recargarDatosCompletos();
  };

  const handleEditarEvento = (evento) => {
    // Preseleccionar aula correctamente para el select
    let aulaObj = null;
    if (
      evento.aula &&
      typeof evento.aula === "object" &&
      "value" in evento.aula
    ) {
      aulaObj = evento.aula;
    } else if (evento.aula) {
      // Buscar en aulasOptions
      const found = aulaOptions.find(
        (a) => String(a.value) === String(evento.aula)
      );
      aulaObj = found || null;
    }
    setEventoEditando({
      ...evento,
      aula: aulaObj,
    });
    setMostrarModal(true);
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
                label="UNIDAD CURRICULAR"
                name="materias"
                value={nuevoEvento.materia}
                options={materiasOptions}
                getOptionLabel={(option) =>
                  option.labelConHoras || option.label
                }
                getOptionValue={(option) => option.value}
                onChange={(option) => {
                  if (option) {
                    setMateriaSeleccionada(
                      materias.find(
                        (m) => String(m.id) === String(option.value)
                      ) || null
                    );
                    setNuevoEvento((prev) => ({
                      ...prev,
                      materia: {
                        value: option.value,
                        label: option.label,
                        // Pasamos los datos de estilo para el select
                        colorFondo: option.colorFondo,
                        colorTexto: option.colorTexto,
                        estado: option.estado,
                      },
                      docente: null,
                      duracion: 2,
                    }));
                  } else {
                    setNuevoEvento((prev) => ({
                      ...prev,
                      materia: null,
                      docente: null,
                    }));
                  }
                }}
                onValueChange={async (option) => {
                  if (option) {
                    try {
                      const response = await Api.get(
                        `/docentes/unidadesPnfs?pnf_id=${horarioId?.horario?.seccion?.pnf_id}&unidad_curricular_id=${option.value}`
                      );
                      setDocentes(response.data);
                      setDocenteSeleccionado(response.data[0]);
                    } catch (error) {
                      AlertaError("Error al cargar los docentes");
                      console.log(error);
                    }
                  }
                }}
                styles={getSelectStyles(nuevoEvento.materia)}
              />
              <SelectControl
                label="DOCENTE"
                name="docente"
                value={nuevoEvento.docente}
                options={docentesOptions}
                getOptionLabel={(option) =>
                  option.labelConHoras || option.label
                }
                getOptionValue={(option) => option.value}
                onChange={(option) => {
                  if (option) {
                    setDocenteSeleccionado(
                      docentes.find(
                        (d) => String(d.id) === String(option.value)
                      ) || null
                    );
                    setNuevoEvento((prev) => ({
                      ...prev,
                      docente: {
                        value: option.value,
                        label: option.label,
                        // Pasamos los datos de estilo para el select
                        colorFondo: option.colorFondo,
                        colorTexto: option.colorTexto,
                        estado: option.estado,
                      },
                      duracion: 2,
                    }));
                  } else {
                    setNuevoEvento((prev) => ({
                      ...prev,
                      docente: null,
                    }));
                  }
                }}
                styles={getSelectStyles(nuevoEvento.docente)}
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
                  setNuevoEvento((prev) => ({
                    ...prev,
                    aula: option,
                    duracion: 2,
                  }));
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
                options={bloqueOptionsConDisponibilidad}
                getOptionLabel={(option) => {
                  if (option.isDisabled) {
                    return `${
                      option.label
                    } (No disponible - ${option.razones?.join(", ")})`;
                  }
                  return option.label;
                }}
                getOptionValue={(option) => option.value}
                onChange={(option) => {
                  if (option && !option.isDisabled) {
                    setNuevoEvento((prev) => ({ ...prev, bloque: option }));
                  }
                }}
                styles={getSelectStyles(nuevoEvento.bloque)}
                isOptionDisabled={(option) => option.isDisabled}
                components={{
                  Option: CustomOption,
                }}
              />
              <div className="col-sm-5 col-xl-3">
                <label htmlFor="duracion" className="mt-4">
                  DURACIÓN (BLOQUES)
                </label>
                <input
                  type="number"
                  name="duracion"
                  min={2}
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
          onClick={() => exportarPDF(horarioId)}
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
                    onEditar={handleEditarEvento}
                    onEliminar={async (evento) => {
                      // Aquí eliminas el evento del estado
                      setEventos((prev) =>
                        prev.filter((e) => e.id !== evento.id)
                      );
                      try {
                        const response = await Api.delete(
                          `/clase/${evento.id}`
                        );

                        Alerta(response.data.message);
                        setEventos((prev) =>
                          prev.filter((e) => e.id !== evento.id)
                        );
                        await recargarDatosCompletos();
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
                onSubmit={async (e) => {
                  e.preventDefault();
                  // Validaciones igual que en agregar evento
                  const eventoAnterior = eventos.find(
                    (ev) => ev.id === eventoEditando.id
                  );
                  const materiaEdit = materias.find(
                    (m) =>
                      String(m.id) === String(eventoEditando.materias?.value)
                  );
                  const docenteEdit = docentes.find(
                    (d) =>
                      String(d.id) === String(eventoEditando.docente?.value)
                  );
                  const aulaEdit = aulas.find(
                    (a) => String(a.id) === String(eventoEditando.aula?.value)
                  );
                  const diaEdit = eventoEditando.dia?.value;
                  if (!docenteEdit || !materiaEdit || !aulaEdit) {
                    AlertaWarning("Completa los campos vacíos");
                    return;
                  }
                  // Validar solapamiento en el mismo horario
                  const bloqueNum = eventoAnterior.bloque;
                  const duracionNum = eventoAnterior.duracion;
                  const haySolapamiento = eventos.some(
                    (e) =>
                      e.id !== eventoEditando.id &&
                      e.dia === diaEdit &&
                      bloqueNum < e.bloque + e.duracion &&
                      bloqueNum + duracionNum > e.bloque
                  );
                  if (haySolapamiento) {
                    AlertaWarning(
                      "¡Ya existe una clase en ese rango de bloques!"
                    );
                    return;
                  }
                  // Validar solapamiento docente en todos los horarios
                  const haySolaplamientoDocente = todosLosEventos.some(
                    (e) =>
                      e.id !== eventoEditando.id &&
                      e.docente.value === docenteEdit.id &&
                      e.dia === diaEdit &&
                      bloqueNum < e.bloque + e.duracion &&
                      bloqueNum + duracionNum > e.bloque
                  );
                  if (haySolaplamientoDocente) {
                    AlertaWarning(
                      "¡El docente ya tiene una clase en ese rango de bloques en otro horario!"
                    );
                    return;
                  }
                  // Validar solapamiento aula en todos los horarios
                  const haySolapamientoAula = todosLosEventos.some(
                    (e) =>
                      e.id !== eventoEditando.id &&
                      e.aula.value === aulaEdit.id &&
                      e.dia === diaEdit &&
                      bloqueNum < e.bloque + e.duracion &&
                      bloqueNum + duracionNum > e.bloque
                  );
                  if (haySolapamientoAula) {
                    AlertaWarning(
                      "¡El aula ya tiene una clase en ese rango de bloques en otro horario!"
                    );
                    return;
                  }
                  // Validar horas de la materia
                  const horasUsadasMateria = eventos
                    .filter(
                      (e) =>
                        e.id !== eventoEditando.id &&
                        e.materias?.value === eventoEditando.materias?.value
                    )
                    .reduce((acc, e) => acc + (e.duracion || 1), 0);
                  const horasMateria = materiaEdit?.horas || 0;
                  if (horasUsadasMateria + duracionNum > horasMateria) {
                    AlertaWarning(
                      "¡Se excedieron las horas semanales de la Unidad Curricular!"
                    );
                    return;
                  }
                  // Validar horas del docente
                  const horasUsadasDocente = calcularHorasUsadasPorDocente(
                    eventoEditando.docente.value
                  );
                  const horasBaseDocente =
                    docentes.find((d) => d.id === eventoEditando.docente.value)
                      ?.horas_dedicacion || 0;

                  if (horasUsadasDocente + duracionNum > horasBaseDocente) {
                    // Excluir el evento actual del cálculo si estamos editando el mismo docente
                    const horasUsadasSinEventoActual = todosLosEventos
                      .filter((e) => {
                        const idDocenteEvento =
                          e.docente?.value || e.docente_id;
                        return (
                          idDocenteEvento == eventoEditando.docente.value &&
                          e.id !== eventoEditando.id
                        );
                      })
                      .reduce(
                        (total, evento) => total + (evento.duracion || 1),
                        0
                      );

                    const horasTotalesConEventoEditado =
                      horasUsadasSinEventoActual + duracionNum;

                    if (horasTotalesConEventoEditado > horasBaseDocente) {
                      AlertaWarning(`
                        <strong>¡Atención! El docente ha excedido su dedicación horaria en este período.</strong><br><br>
                        Dedicación base: ${horasBaseDocente} hrs<br>
                        Horas usadas en el lapso/trimestre: ${horasUsadasSinEventoActual} hrs<br>
                        Horas que intenta asignar: ${duracionNum} hrs<br>
                        Horas disponibles: ${
                          horasBaseDocente - horasUsadasSinEventoActual
                        } hrs<br><br>
                        <em>Nota: Incluye todas las clases de este docente en todos los horarios del mismo lapso académico y trimestre.</em>
                      `);
                      return;
                    }
                  }
                  // Actualizar en backend
                  const payload = {
                    dia: diaEdit,
                    bloque_id: bloqueNum,
                    duracion: duracionNum,
                    unidad_curricular_id: materiaEdit.id,
                    docente_id: docenteEdit.id,
                    espacio_id: aulaEdit.id,
                  };
                  try {
                    const response = await Api.put(
                      `/claseEdit/${eventoEditando.id}`,
                      payload
                    );
                    Alerta(response.data.message);
                  } catch (error) {
                    AlertaError(
                      "Error al Editar el evento: " +
                        (error.response?.data?.message || error.message)
                    );
                    return;
                  }
                  // Actualiza el evento en el array y resalta visualmente
                  setEventos((prev) =>
                    prev.map((ev) =>
                      ev.id === eventoEditando.id
                        ? {
                            ...ev,
                            materias: {
                              value: eventoEditando.materias?.value,
                              label: eventoEditando.materias?.label,
                            },
                            docente: {
                              value: eventoEditando.docente?.value,
                              label: eventoEditando.docente?.label,
                            },
                            aula: {
                              value: eventoEditando.aula?.value,
                              label: eventoEditando.aula?.label,
                            },
                            dia: eventoEditando.dia,
                            texto: `${eventoEditando.materias.label}\n${eventoEditando.docente.label}\n${eventoEditando.aula.label}`,
                          }
                        : ev
                    )
                  );
                  setEventoRecienAgregado(eventoEditando.id); // Resalta el evento editado
                  setMostrarModal(false);
                  await recargarDatosCompletos();
                }}
              >
                <div className="modal-header">
                  <h5 className="modal-title fs-5">EDITAR EVENTO</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMostrarModal(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="d-flex justify-content-center">
                      <SelectControl
                        label="UNIDAD CURRICULAR"
                        name="materias"
                        className="col-sm-12 col-xs-12 col-xl-10"
                        value={eventoEditando.materias}
                        options={materiasOptions}
                        getOptionLabel={(option) =>
                          option.labelConHoras || option.label
                        }
                        getOptionValue={(option) => option.value}
                        onChange={(option) => {
                          if (option) {
                            setMateriaSeleccionada(
                              materias.find(
                                (m) => String(m.id) === String(option.value)
                              ) || null
                            );
                            setEventoEditando({
                              ...eventoEditando,
                              materias: {
                                value: option.value,
                                label: option.label,
                                colorFondo: option.colorFondo,
                                colorTexto: option.colorTexto,
                                estado: option.estado,
                              },
                              docente: null,
                            });
                          } else {
                            setEventoEditando({
                              ...eventoEditando,
                              materias: null,
                              docente: null,
                            });
                          }
                        }}
                        onValueChange={async (option) => {
                          if (option) {
                            try {
                              const response = await Api.get(
                                `/docentes/unidadesPnfs?pnf_id=${horarioId?.horario?.seccion?.pnf_id}&unidad_curricular_id=${option.value}`
                              );
                              setDocentes(response.data);
                              setDocenteSeleccionado(response.data[0]);
                            } catch (error) {
                              AlertaError("Error al cargar los docentes");
                              console.log(error);
                            }
                          }
                        }}
                        styles={getSelectStyles(eventoEditando.materias)}
                      />
                    </div>
                    <div className="d-flex justify-content-center">
                      <SelectControl
                        label="DOCENTE"
                        name="docente"
                        className="col-sm-12 col-xs-12 col-xl-10"
                        value={eventoEditando.docente}
                        options={docentesOptions}
                        getOptionLabel={(option) =>
                          option.labelConHoras || option.label
                        }
                        getOptionValue={(option) => option.value}
                        onChange={(option) => {
                          if (option) {
                            setDocenteSeleccionado(
                              docentes.find(
                                (d) => String(d.id) === String(option.value)
                              ) || null
                            );
                            setEventoEditando({
                              ...eventoEditando,
                              docente: {
                                value: option.value,
                                label: option.label,
                                colorFondo: option.colorFondo,
                                colorTexto: option.colorTexto,
                                estado: option.estado,
                              },
                            });
                          } else {
                            setEventoEditando({
                              ...eventoEditando,
                              docente: null,
                            });
                          }
                        }}
                        styles={getSelectStyles(eventoEditando.docente)}
                      />
                    </div>
                    <div className="d-flex justify-content-center">
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
