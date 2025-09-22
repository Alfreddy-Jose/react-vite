import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../services/Api";
import { ContainerIput } from "../../components/ContainerInput";
import SelectControl from "../../components/SelectDependiente";
import Alerta, { AlertaError } from "../../components/Alert";
import { Buttom } from "../../components/Buttom";
import { useAuth } from "../../context/AuthContext";
import Stepper from "../../components/Stepper";
import { Create } from "../../components/Link";

export function HorarioCreate() {
  const [secciones, setSecciones] = useState([]);
  const [trimestres, setTrimestres] = useState([]);
  const [trimestresFiltrados, setTrimestresFiltrados] = useState([]);
  const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
  const [trimestreSeleccionado, setTrimestreSeleccionado] = useState(null);
  const [lapsoSeleccionado, setLapsoSeleccionado] = useState(null);
  const navigate = useNavigate();
  const { lapsoActual, lapsos } = useAuth();


  useEffect(() => {
  if (seccionSeleccionada) {
    // encontrar la seccion completa en el arreglo
    const seccion = secciones.find(s => s.id === seccionSeleccionada.value);
    if (seccion) {
      // filtramos los trimestres cuyo trayecto coincida
      const filtrados = trimestres.filter(
        t => t.trayecto_id === seccion.trayecto_id
      );
      setTrimestresFiltrados(filtrados);
      setTrimestreSeleccionado(null); // resetear selección al cambiar de sección
    }
  } else {
    setTrimestresFiltrados([]);
    setTrimestreSeleccionado(null);
  }
}, [seccionSeleccionada, trimestres, secciones]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const resSecciones = await Api.get("/secciones");
        setSecciones(resSecciones.data);
        console.log(resSecciones.data);
        
        const resTrimestres = await Api.get("/get_trimestres");
        setTrimestres(resTrimestres.data);
      } catch (error) {
        AlertaError("Error al cargar datos: " + error.message);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!seccionSeleccionada || !trimestreSeleccionado || !lapsoSeleccionado) {
      AlertaError("Debes seleccionar una sección y un trimestre");
      return;
    }

    try {
      const payload = {
        seccion_id: seccionSeleccionada.value,
        trimestre_id: trimestreSeleccionado.value,
        lapso_academico: lapsoSeleccionado.value,
        nombre: `Horario ${seccionSeleccionada.label} - ${trimestreSeleccionado.label}`,
        estado: "borrador",
      };
      const response = await Api.post(
        `/secciones/${seccionSeleccionada.value}/horarios`,
        payload
      );
      Alerta("Horario creado correctamente");
      const nuevoId = response.data.id; 
      navigate(`/horarios/${nuevoId}/clases`, {
        state: { message: "Horario creado exitosamente" },
      });
    } catch (error) {
      AlertaError(
        "Error al crear horario: " + error.response?.data?.message ||
          error.message
      );
      console.error(error);
    }
  };

  //inicializar el valor del select con el lapso actual
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

  // Detener las opciones de trimestre cuando sea igual a III
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
              />
            </>
          }
          buttom={
            <>
              <Buttom
                type="submit"
                style="btn btn-success"
                text="Guardar Horario"
              />
              <Buttom
                text="Cancelar"
                title="Cancelar"
                type="reset"
                style="btn-danger ms-1"
              />
            </>
          }
        />
      </form>
    </>
  );
}
