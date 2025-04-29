import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { GetAll } from "../../services/Api";
import Acciones from "../../components/Acciones";
import Modal, { ButtomModal } from "../../components/Modal";

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "NÚMERO SEDE",
    selector: (row) => row.nro_sede,
  },
  {
    name: "NOMBRE",
    selector: (row) => row.nombre_sede,
    sortable: true,
  },
  {
    name: "+INFO",
    cell: (row) => (
      <div>
        <ButtomModal id={row.id} />

        <Modal titleModal={`+INFO ${row.nombre_abreviado}`} id={row.id}>
          <p>
            <b>NÚMERO SEDE: </b> {row.nro_sede}
          </p>
          <p>
            <b>NOMBRE: </b> {row.nombre_sede}
          </p>
          <p>
            <b>ABREVIADO: </b> {row.nombre_abreviado}
          </p>
          <p>
            <b>DIRECCIÓN: </b> {row.direccion}
          </p>
          <p>
            <b>MUNICIPIO: </b> {row.municipio}
          </p>
        </Modal>
      </div>
    ),
  },
  {
    name: "ACCIONES",
    cell: (row) => (
      <Acciones
        url={`/sede/${row.id}/edit`}
        urlDelete={`/sede/${row.id}`}
        navegar="/sede"
      />
    ),
  },
];

export function Sede() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Mostrar la lista de PNF
    GetAll(setSedes, setLoading, "/sedes");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  return (
    <>
      <ContainerTable
        title="SEDES"
        link={<Create path="/sede/create" />}
        isLoading={loading}
        tabla={<Tabla data={sedes} columns={columns} />}
      />
    </>
  );
}
