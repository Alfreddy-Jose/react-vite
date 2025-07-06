import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import esLocale from '@fullcalendar/core/locales/es';
import '@fullcalendar/timegrid';

export default function Calendar() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="timeGridWeek"
      eventContent={renderEventContent}
      locale={esLocale}
    />
  );
}

function renderEventContent(eventInfo) {
  return(
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}
