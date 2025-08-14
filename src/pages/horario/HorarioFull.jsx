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
import { AlertaError } from "../../components/Alert";
import Api from "../../services/Api";
import SelectControl from "../../components/SelectDependiente";
import { ContainerIput } from "../../components/ContainerInput";

function Evento({ evento, onResizeStart, isResizing, onEditar, onEliminar }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: evento.id,
    data: { evento },
  });

  const [menuAbierto, setMenuAbierto] = React.useState(false);

  // Cierra el menú si se hace click fuera
  React.useEffect(() => {
    if (!menuAbierto) return;
    const handleClick = (e) => setMenuAbierto(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuAbierto]);

  const estilo = {
    transform: CSS.Translate.toString(transform),
    backgroundColor: evento.color,
    height: `${evento.duracion * 60 - 4}px`,
    // Resto de tus estilos
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        // Guardamos la referencia del elemento para acceso directo
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
            /* const rect = e.target.getBoundingClientRect(); */
            /* setMenuPosition({ top: rect.bottom, left: rect.right - 120 }); */
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
              onResizeStart={onResizeStart}
              onEditar={onEditar}
              onEliminar={onEliminar}
            />
          )
      )}
    </td>
  );
}

export default function Calendar() {
  const [bloques, setBloques] = useState([]);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    obtenerBloques();
    cargarHorarios();
  }, []);

  // Al cargar el componente
  const cargarHorarios = async () => {
    try {
      const response = await Api.get("/eventos");
      const eventosFormateados = response.data.map((evento) => ({
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
      console.log("Datos enviados:", datosParaPDF);
      console.log(Array.isArray(datosParaPDF.dias));
      console.log(typeof datosParaPDF.encabezado === "object");

      // Enviar datos al backend
      const response = await Api.get("/generar-horario-pdf", datosParaPDF, {
        responseType: "blob",
        withCredentials: true,
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

  const [eventos, setEventos] = useState([
    {
      id: "1",
      dia: "JUEVES",
      bloque: 0,
      duracion: 2,
      texto: "LAB / E - 07",
      color: "#e3f2fd",
    },
    {
      id: "2",
      dia: "JUEVES",
      bloque: 2,
      duracion: 1,
      texto: "ELECTIVA III\nJENNIFER PAIVA",
      color: "#fff9c4",
    },
    {
      id: "3",
      dia: "JUEVES",
      bloque: { value: 147, label: "07:30 AM - 08:15 AM" },
      duracion: 3,
      texto: "PROYECTO III\nDORA MENDOZA",
      color: "#ffe0b2",
    },
  ]);

  // Adaptar datos para react-select
  const sedesOptions = sedes.map((s) => ({
    value: s.value || s.id,
    label: s.label || s.nombre_sede,
  }));
  const docentesOptions = docentes.map((d) => ({
    value: d.value || d.id,
    label: d.label || d.persona.nombre_completo,
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

      setEventos((prevEventos) => {
        const eventoActivo = prevEventos.find((e) => e.id === active.id);
        if (!eventoActivo) return prevEventos;

        const haySolapamiento = prevEventos.some(
          (e) =>
            e.id !== active.id &&
            e.dia === newDia &&
            ((e.bloque >= bloqueNum &&
              e.bloque < bloqueNum + eventoActivo.duracion) ||
              (e.bloque + e.duracion > bloqueNum &&
                e.bloque + e.duracion <= bloqueNum + eventoActivo.duracion))
        );

        if (!haySolapamiento) {
          return prevEventos.map((e) =>
            e.id === active.id ? { ...e, dia: newDia, bloque: bloqueNum } : e
          );
        }
        return prevEventos;
      });

      setActiveEvent(null);
    },
    [activeEvent]
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      if (!resizingEventId || !resizeData.current.initialY) return;

      const deltaY = e.clientY - resizeData.current.initialY;
      const nuevaDuracion = Math.max(
        1,
        Math.round(resizeData.current.initialDuracion + deltaY / 60)
      );

      // Actualizamos la referencia y el DOM
      resizeData.current.tempDuracion = nuevaDuracion;
      if (resizeData.current.elemento) {
        resizeData.current.elemento.style.height = `${
          nuevaDuracion * 60 - 4
        }px`;
      }
    };

    const handleMouseUp = () => {
      if (resizingEventId && resizeData.current.tempDuracion) {
        // Actualizamos el estado con el valor final
        setEventos((prev) =>
          prev.map((ev) =>
            ev.id === resizingEventId
              ? { ...ev, duracion: resizeData.current.tempDuracion }
              : ev
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

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, resizingEventId]); // Dependencias mínimas

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

    // Evitar solapamientos
    const haySolapamiento = eventos.some(
      (e) =>
        e.dia === nuevoEvento.dia.value &&
        ((e.bloque >= bloqueNum && e.bloque < bloqueNum + duracionNum) ||
          (e.bloque + e.duracion > bloqueNum &&
            e.bloque + e.duracion <= bloqueNum + duracionNum))
    );
    if (haySolapamiento) {
      AlertaError("¡Ya existe un evento en ese bloque!");
      return;
    }

    const payload = {
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
    console.log("Payload enviado:", payload);
    try {
      // Enviar datos al backend
      await Api.post("/eventos", payload).then((response) => {
        console.log({ state: { message: response.data.message } });
      });

      setEventos([
        ...eventos,
        {
          id: Date.now().toString(),
          dia: nuevoEvento.dia.value,
          bloque: Number(nuevoEvento.bloque.value),
          duracion: duracionNum,
          materia: nuevoEvento.materia.value,
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
    } catch (error) {
      AlertaError("Error al guardar el evento" + " " + error);
    }

    setNuevoEvento({
      sede: null,
      pnf: null,
      trayecto: null,
      trimestre: null,
      materia: null,
      aula: null,
      dia: null,
      bloque: null,
      docente: null,
      texto: null,
      duracion: 1,
    });
  };

  // Si quieres cargar eventos desde backend, puedes usar useEffect aquí

  // Render
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
                label="MATERIA"
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
                  console.log(docenteSeleccionado);
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
                  max={bloques.length}
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
          Exportar PDF
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
                      try {
                        await Api.delete(`/evento/${evento.id}`);
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
                    {/*  <div className="d-flex justify-content-center aling-content-center">
                      <SelectControl
                        label="TRAYECTO"
                        name="trayecto"
                        className="col-sm-12 col-xs-12 col-xl-10"
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
                            texto: `${eventoEditando.sede?.label} - ${eventoEditando.pnf?.label} - ${option.label}`,
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
                    <div className="d-flex justify-content-center aling-content-center">
                      <SelectControl
                        label="TRIMESTRE"
                        name="trimestre"
                        className="col-sm-12 col-xs-12 col-xl-10"
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
                            } catch (error) {
                              AlertaError("Error al cargar las materias");
                              console.log(error);
                            }
                          }
                        }}
                      />
                    </div> */}
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
                    {/* <div className="d-flex justify-content-center aling-content-center">
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
                    <div className="mb-2 d-flex justify-content-center aling-content-center">
                      <div className="col-sm-12 col-xs-12 col-xl-10">
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
                    </div> */}
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
