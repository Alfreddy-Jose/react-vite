import { useEffect, useState } from "react";
import { GetAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import { useLocation } from "react-router-dom";
import { ContainerTable } from "../../components/ContainerTable";
import { Tabla } from "../../components/Tabla";
import { Create } from "../../components/Link";
import { Modal, ButtomModal } from "../../components/Modal";
import Acciones from "../../components/Acciones";

// Leer permisos del localStorage
const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

const columns = [
  { name: "ID", selector: (row, index) => index + 1, sortable: true },
  { name: "NOMBRE", selector: (row) => row.nombre, sortable: true },
  {
    name: "+INFO",
    cell: (row) => (
      <div>
        <ButtomModal id={row.id} />

        <Modal titleModal={`+INFO ${row.abreviado}`} id={row.id}>
          <p>
            <b>NOMBRE: </b> {row.nombre}
          </p>
          <p>
            <b>INICIO: </b> {row.inicio}
          </p>
          <p>
            <b>FINAL: </b> {row.final}
          </p>
        </Modal>
      </div>
    ),
  },
  // Mostrar columna solo si tiene al menos uno de los permisos
  ...(permisos.includes("editar turno") || permisos.includes("eliminar turno")
    ? [
        {
          name: "ACCIONES",
          cell: (row) => (
            <Acciones
              url={`/turno/${row.id}/edit`}
              urlDelete={`/turno/${row.id}`}
              navegar="/turnos"
              editar="editar turno"
              eliminar="eliminar turno"
            />
          ),
        },
      ]
    : []),
  /*   {
    name: "ACCIONES",
    cell: (row) => (
      <Acciones
        url={`/turno/${row.id}/edit`}
        urlDelete={`/turno/${row.id}`}
        navegar="/turnos"
      />
    ),
  }, */
];

function Turno() {
  const [loading, setLoading] = useState(true);
  const [turnos, setTurnos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    GetAll(setTurnos, setLoading, "/turnos");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="TURNOS"
        // Boton para crear nuevos registros
        link={
          permisos.includes("crear turno") ? (
            <Create path="/turno/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={turnos} />}
        // Manejar Loader
        isLoading={loading}
      />
    </>
  );
}

export default Turno;
