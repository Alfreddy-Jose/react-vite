import { useEffect, useState } from "react";
import { GetAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import { useLocation } from "react-router-dom";
import { ContainerTable } from "../../components/ContainerTable";
import { Tabla } from "../../components/Tabla";
import { Create } from "../../components/Link";
import { Modal, ButtomModal } from "../../components/Modal";
import Acciones from "../../components/Acciones";

function Turno() {
  const [loading, setLoading] = useState(true);
  const [turnos, setTurnos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["nombre", "inicio", "inicio_periodo", "final", "final_periodo"];

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    GetAll(setTurnos, setLoading, "/turnos");

    // Motrar Alerta al registrar un nuevo TURNO
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  // Definir las columnas de la tabla
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
              <b>INICIO: </b> {`${row.inicio} ${row.inicio_periodo}`}
            </p>
            <p>
              <b>FINAL: </b> {`${row.final} ${row.final_periodo}`}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("turno.editar") || permisos.includes("turno.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/turno/${row.id}/edit`}
                urlDelete={`/turno/${row.id}`}
                navegar="/turnos"
                editar="turno.editar"
                eliminar="turno.eliminar"
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla
        title="TURNOS"
        // Boton para crear nuevos registros
        link={
          permisos.includes("turno.crear") ? (
            <Create path="/turno/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={turnos} searchFields={camposBusqueda} />}
        // Manejar Loader
        isLoading={loading}
      />
    </>
  );
}

export default Turno;
