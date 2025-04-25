import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import Api from "../../services/Api";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { Modal, ButtomModal } from "../../components/Modal";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "CODIGO",
    selector: (row) => row.codigo,
  },
  {
    name: "NOMBRE",
    selector: (row) => row.nombre,
    sortable: true,
    grow: 3,
  },
  {
    name: "+INFO",
    cell: (row) => (
      <div>
        <ButtomModal id={row.id} />

        <Modal titleModal={`+INFO ${row.abreviado}`} id={row.id}>
          <p>
            <b>CODIGO: </b> {row.codigo}
          </p>
          <p>
            <b>NOMBRE: </b> {row.nombre}
          </p>
          <p>
            <b>ABREVIADO: </b> {row.abreviado}
          </p>
          <p>
            <b>ABREVIADO COORDINACIÓN: </b>
            {row.abreviado_coord}
          </p>
        </Modal>
      </div>
    ),
  },
  {
    name: "ACCIONES",
    cell: (row) => <Acciones url={`/pnf/${row.id}/edit`} id={row.id} />,
  },
];

export function Pnf() {
  const [pnf, setPnf] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Mostrar la lista de PNF
    getAllPnf();

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const getAllPnf = async () => {
    const response = await Api.get(`/pnf`);
    setPnf(response.data);
  };

  return (
    <>
      {/* Contenedor para la tablas de PNF */}
      <ContainerTable
        // Titulo para la tabla PNF
        title="PNF"
        // Boton para crear nuevos registros
        link={<Create path="/pnf/create" />}
        // Tabla
        tabla={<Tabla columns={columns} data={pnf} />}
      />
    </>
  );
}
