import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Api from "../../services/Api";
import Alerta, { AlertaError } from "../../components/Alert";
import Calendar from "../horario/HorarioFull";
import Spinner from "../../components/Spinner";
import Stepper from "../../components/Stepper";
import { LapsoAcademico } from "../lapsoAcademico/LapsoAcademico";
import { Create } from "../../components/Link";

export function HorarioClases() {
  const { id } = useParams(); // id del horario
  const [horario, setHorario] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const res = await Api.get(`/horario/${id}`);
        setHorario(res.data);
      } catch (error) {
        AlertaError("Error al cargar horario");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHorario();
  }, [id]);

  // Mostrar alerta si venimos de crear/editar
  if (location.state?.message) {
    Alerta(location.state.message);
  }

  //mostar cargando mientras se obtiene el horario
  if (loading) return <Spinner />;

  if (!horario) return AlertaError("No se encontró el horario");

  return (
    <div>
      <Stepper
        steps={["NUEVO HORARIO", "CLASES"]}
        currentStep={2}
        contextInfo={{
          pnf: horario.seccion?.pnf?.nombre || "PNF",
          sede: horario.seccion?.sede?.nombre_sede || "Sede",
          trayecto: horario.seccion?.trayecto?.nombre || "Trayecto",
          trimestre: horario.trimestre?.nombre || "Trimestre",
          seccion: horario.seccion?.nombre || "Sección",
          LapsoAcademico: horario.lapso_academico || "Lapso Academico",
        }}
      />
      <br />
      <Create path="/horarios" horario={true} text="Volver" style="btn btn-secondary mb-4" />
      <Calendar horarioId={horario.id} horario={horario} />
    </div>
  );
}
