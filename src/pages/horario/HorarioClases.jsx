import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Api from "../../services/Api";
import Alerta, { AlertaError } from "../../components/Alert";
import Calendar from "../horario/HorarioFull";
import Spinner from "../../components/Spinner";
import Stepper from "../../components/Stepper";

export function HorarioClases() {
  const { id } = useParams(); // id del horario
  const navigate = useNavigate();
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
      <Stepper steps={["NUEVO HORARIO", "CLASES"]} currentStep={2} />
      <h2 className="mb-4">
        CLASES DEL HORARIO - SECCIÓN {horario.seccion?.nombre} | TRIMESTRE{" "}
        {horario.trimestre?.nombre}
      </h2>

      <Calendar horarioId={horario.id} horario={horario}/>

      <button
        className="btn btn-secondary traslation mt-4"
        onClick={() => navigate("/horarios")}
      >
        Volver a Horarios
      </button>
    </div>
  );
}
