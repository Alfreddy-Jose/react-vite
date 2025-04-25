import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import Api from "../../services/Api";
import Alerta from "../../components/Alert";
import Acciones from "../../components/Acciones";


const columns = [ 
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "NOMBRE",
    selector: (row) => row.nombre_lapso,
  },
  {
    name: "AÑO",
    selector: (row) => row.ano,
    sortable: true,
  },
  {
    name: "TIPO DE LAPSO",
    selector: (row) => row.tipo_lapso,
    sortable: true,
  },
  {
    name: "ACCIONES",
    cell: (row) => (
      <Acciones url={`/lapso_academico/${row.id}/edit`} />
    )
  }
];


export function LapsoAcademico() {



  const [lapsos, setLapsos] = useState([]);
  const location = useLocation();

  useEffect(() => {

    // Mostrar la lista de PNF
    getAllLapsos();

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");

  }, [location.state]);

  // Recibiendo datos de la Api
  const getAllLapsos = async () => {
    const response = await Api.get(`/lapsos`);
    setLapsos(response.data);
  };



  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="LAPSO ACADEMICO"
        // Boton para crear nuevos registros
        link={<Create path="/lapso_academico/create" />}
        // Tabla
        tabla={<Tabla columns={columns} data={lapsos} />}
      />
    </>
  );
}
