import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import "moment/locale/es";
import "@fullcalendar/core/locales/es";


// Simula bloques de la base de datos
const bloquesManana = [
  { start: "07:30", end: "08:15" },
  { start: "08:15", end: "09:00" },
  { start: "09:05", end: "09:50" },
  { start: "09:55", end: "10:40" },
  { start: "10:45", end: "11:30" },
  { start: "11:30", end: "12:15" },
];

const bloquesTarde = [
  { start: "13:00", end: "13:45" },
  { start: "13:45", end: "14:30" },
  { start: "14:30", end: "15:15" },
  { start: "15:15", end: "16:00" },
  { start: "16:00", end: "16:45" },
  { start: "16:45", end: "17:30" },
];

// Simula eventos de la base de datos
const eventosBD = [
  {
    title: "ELECTIVA III",
    start: "2025-06-30T07:30:00",
    end: "2025-06-30T08:15:00",
    daysOfWeek: [1], // Lunes
    extendedProps: { aula: "LAB/E-07", profesor: "JENNIFER PAIVA" },
  },
  {
    title: "MATEMATICA APLI.",
    start: "2025-07-04T07:30:00",
    end: "2025-07-04T09:00:00",
    daysOfWeek: [5], // Viernes
    extendedProps: { aula: "E-07", profesor: "CARLA ALVAREZ" },
  },
  // ...agrega más eventos según tu horario...
];

function generarEventosBloques(bloques, fecha, diaSemana) {
  // fecha: string "2025-06-30" (lunes), diaSemana: 1=lunes, 2=martes...
  return bloques.map((b, i) => ({
    id: `bloque-${diaSemana}-${i}`,
    title: "",
    start: `${fecha}T${b.start}:00`,
    end: `${fecha}T${b.end}:00`,
    display: "background",
    backgroundColor: "#e3e3e3",
    groupId: "bloque",
  }));
}

export default function HorarioFullCalendar() {
  // Simula traer la fecha base de la semana (puedes calcular el lunes de la semana actual)
  const fechaBase = moment().startOf("isoWeek").format("YYYY-MM-DD"); // Lunes de esta semana

  // Simula traer eventos de la BD
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // Aquí puedes hacer tu petición a la API y setear los eventos
    setEventos(eventosBD);
  }, []);

  // Genera los bloques de fondo para cada día (lunes a sábado)
  let bloquesFondo = [];
  for (let dia = 1; dia <= 6; dia++) {
    const fecha = moment(fechaBase)
      .add(dia - 1, "days")
      .format("YYYY-MM-DD");
    bloquesFondo = [
      ...bloquesFondo,
      ...generarEventosBloques(bloquesManana, fecha, dia),
      ...generarEventosBloques(bloquesTarde, fecha, dia),
    ];
  }

  return (
    <div style={{ padding: 20 }}>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale="es"
        slotMinTime="07:30:00"
        slotMaxTime="17:30:00"
        slotDuration="00:45:00"
        allDaySlot={false}
        editable={true}
        droppable={true}
        eventOverlap={false}
        events={[...eventos, ...bloquesFondo]}
        eventContent={renderEventContent}
        height="auto"
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        dayHeaderFormat={{ weekday: "long" }}
        // Puedes agregar más props según tus necesidades
      />
    </div>
  );
}

// Personaliza cómo se ven los eventos
function renderEventContent(eventInfo) {
  if (eventInfo.event.groupId === "bloque") {
    // No mostrar texto para los bloques de fondo
    return null;
  }
  return (
    <div>
      <b>{eventInfo.event.title}</b>
      <div style={{ fontSize: 10 }}>
        {eventInfo.event.extendedProps?.aula && (
          <div>Aula: {eventInfo.event.extendedProps.aula}</div>
        )}
        {eventInfo.event.extendedProps?.profesor && (
          <div>Prof: {eventInfo.event.extendedProps.profesor}</div>
        )}
      </div>
    </div>
  );
}
