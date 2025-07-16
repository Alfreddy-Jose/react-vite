import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { GetAll } from "../../services/Api";
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

function Evento({ evento, onResizeStart, isResizing }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: evento.id,
    data: { evento },
  });

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
      {evento.texto}
      <div
        className="event-resizer"
        onPointerDown={(e) => {
          e.stopPropagation();
          // Pasamos la referencia del elemento al iniciar
          onResizeStart(evento.id, e.clientY, e.currentTarget.parentElement);
        }}
      />
    </div>
  );
}

function Celda({ id, eventosDia, onResizeStart }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const bloqueActual = parseInt(id.split("-")[1]);

  // Memoizar el cálculo de eventos para mejorar rendimiento
  const eventosEnCelda = React.useMemo(() => {
    return eventosDia.filter((e) => {
      const bloqueInicio = e.bloque;
      const bloqueFin = e.bloque + e.duracion - 1;
      return bloqueActual >= bloqueInicio && bloqueActual <= bloqueFin;
    });
  }, [eventosDia, bloqueActual]);

  // Función para verificar si el evento comienza en esta celda
  const eventoComienzaAqui = (evento) => evento.bloque === bloqueActual;

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
      // Eliminé los manejadores de redimensionamiento que no pertenecen aquí
    >
      {eventosEnCelda.map(
        (evento) =>
          eventoComienzaAqui(evento) && (
            <Evento
              key={`${evento.id}-${bloqueActual}`} // Key más específica
              evento={evento}
              onResizeStart={onResizeStart}
            />
          )
      )}
    </td>
  );
}

export default function Calendar() {
  const bloques = [
    { id: 0, rango: "07:30 - 08:15", periodo: "AM" },
    { id: 1, rango: "08:15 - 09:00", periodo: "AM" },
    { id: 2, rango: "09:05 - 09:50", periodo: "AM" },
    { id: 3, rango: "09:55 - 10:40", periodo: "AM" },
    { id: 4, rango: "10:45 - 11:30", periodo: "AM" },
    { id: 5, rango: "11:30 - 12:15", periodo: "PM" },
    { id: 6, rango: "01:00 - 01:45", periodo: "PM" },
    { id: 7, rango: "01:45 - 02:30", periodo: "PM" },
    { id: 8, rango: "02:30 - 03:15", periodo: "PM" },
    { id: 9, rango: "03:15 - 04:00", periodo: "PM" },
    { id: 10, rango: "04:00 - 04:45", periodo: "PM" },
    { id: 11, rango: "04:45 - 05:30", periodo: "PM" },
  ];

  const dias = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

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
      bloque: 3,
      duracion: 3,
      texto: "PROYECTO III\nDORA MENDOZA",
      color: "#ffe0b2",
    },
  ]);

  const resizeData = useRef({
    initialY: null,
    initialDuracion: null,
    tempDuracion: null,
    elemento: null,
  });

  const [activeEvent, setActiveEvent] = useState(null);
  const [resizingEventId, setResizingEventId] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [turnos, setTurnos] = useState([]);
  const location = useLocation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    GetAll(setTurnos, setLoading, "/turnos");
  }, [location.state]);

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

  if (loading) return <div>Loading...</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
          {bloques.map((bloque, bloqueIndex) => (
            <tr key={bloque.id} style={{ height: "60px" }}>
              <td>
                {bloque.rango} {bloque.periodo}
              </td>
              {dias.map((dia) => (
                <Celda
                  key={`${dia}-${bloqueIndex}`}
                  id={`${dia}-${bloqueIndex}`}
                  eventosDia={eventos.filter((e) => e.dia === dia)}
                  onResizeStart={handleResizeStart}
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
