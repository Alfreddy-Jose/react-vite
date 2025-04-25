import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { useLocation } from "react-router-dom";
import Api from "../../services/Api";
import Alerta from "../../components/Alert";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";



const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "NOMBRE",
    selector: (row) => row.nombre,
    sortable: true,
  },
  {
    name: "TIPO",
    selector: (row) => row.tipo,
  },
  {
    name: "ACCIONES",
    cell: (row) => <Acciones url={`/tipo_matricula/${row.id}/edit`} />,
  },
];


export function TipoMatricula() {

  const [matricula, setMatricula] = useState([]);
  const location = useLocation();

  useEffect(() => {

    // Mostrar la lista de Matricula
    getAllMatriculas();

    // Motrar Alerta al registrar unm nuevo tipo de matricula
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");

  }, [location.state]);

  const getAllMatriculas = async () => {
    const response = await Api.get(`/matriculas`);
    setMatricula(response.data);
  };

  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="TIPO MATRICULA"
        // Boton para crear nuevos registros
        link={<Create path="/tipo_matricula/create" />}
        // Tabla
        tabla={<Tabla data={matricula} columns={columns}>
        </Tabla>}
      />
    </>
  );
}
