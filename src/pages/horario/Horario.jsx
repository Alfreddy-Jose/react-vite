import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import '/home/alfreddy/Documentos/frontend/src/pages/horario/style.css'
import { useEffect, useState } from 'react';
import Api, { GetAll } from '../../services/Api';



const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);




function Horario() {
  const [loading, setLoading] = useState(true);
  const [turnos, setTurnos] = useState([]);
  const [turnoActivo, setTurnoActivo] = useState('MAÑANA');

  useEffect(() => {
    GetAll(setTurnos, setLoading, "/turnos");
  }, []);

  const turno = turnos.find(t => t.nombre === turnoActivo);

  const minHora = turno
    ? moment(turno.inicio, "H:mm").toDate()
    : new Date(0, 0, 0, 7, 30);

  const maxHora = turno
    ? moment(turno.final, "H:mm").toDate()
    : new Date(0, 0, 0, 12, 15);

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

  // Genera eventos de fondo para cada bloque
  function generarEventosBloques(bloques, dia = 1) {
    // dia: 1 = lunes, 2 = martes, etc.
    return bloques.map((b, i) => ({
      id: `bloque-${i}`,
      title: `${b.start} - ${b.end}`,
      start: moment().day(dia).set({
        hour: parseInt(b.start.split(":")[0], 10),
        minute: parseInt(b.start.split(":")[1], 10),
        second: 0,
        millisecond: 0,
      }).toDate(),
      end: moment().day(dia).set({
        hour: parseInt(b.end.split(":")[0], 10),
        minute: parseInt(b.end.split(":")[1], 10),
        second: 0,
        millisecond: 0,
      }).toDate(),
      allDay: false,
      resource: "bloque",
      // Puedes agregar un color de fondo especial si quieres
    }));
  }

  // Ejemplo: bloques para toda la semana (lunes a sábado)
  let eventosBloques = [];
  for (let dia = 1; dia <= 6; dia++) {
    eventosBloques = [
      ...eventosBloques,
      ...generarEventosBloques(bloquesManana, dia),
      ...generarEventosBloques(bloquesTarde, dia),
    ];
  }

  return (
    <div style={{ height: '90vh', padding: '20px' }}>
      <select onChange={e => setTurnoActivo(e.target.value)} value={turnoActivo}>
        {turnos.map(t => (
          <option key={t.id} value={t.nombre}>{t.nombre}</option>
        ))}
      </select>
      <DragAndDropCalendar
        defaultDate={moment().toDate()}
        defaultView="week"
        localizer={localizer}
        events={eventosBloques}
        resizable
        loading={loading}
        min={minHora}
        max={maxHora}
        step={5}
        timeslots={9}
        formats={{
    timeGutterFormat: 'HH:mm', // Esto mostrará la hora y los minutos
  }}     components={{
          event: ({ event }) => (
            <div style={{ background: "#e3e3e3", color: "#333", fontSize: 12 }}>
              {event.title}
            </div>
          ),
        }} />
    </div>
  );
}

export default Horario;