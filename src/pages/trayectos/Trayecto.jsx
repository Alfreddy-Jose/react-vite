import { useEffect, useState } from "react";
import { GetAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import { useLocation } from "react-router-dom";
import { ContainerTable } from "../../components/ContainerTable";
import { Tabla } from "../../components/Tabla";
import { Create } from "../../components/Link";
import Acciones from "../../components/Acciones";

// Leer permisos del localStorage
const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

const columns = [
  { name: "ID", selector: (row, index) => index + 1, sortable: true },
  { name: "NOMBRE", selector: (row) => row.nombre, sortable: true },
  // Mostrar columna solo si tiene al menos uno de los permisos
  ...(permisos.includes("editar trayecto") ||
  permisos.includes("eliminar trayecto")
    ? [
        {
          name: "ACCIONES",
          cell: (row) => (
            <Acciones
              url={`/trayecto/${row.id}/edit`}
              urlDelete={`/trayecto/${row.id}`}
              navegar="/trayectos"
              editar="editar trayecto"
              eliminar="eliminar trayecto"
            />
          ),
        },
      ]
    : []),
  /*   {
    name: "ACCIONES",
    cell: (row) => (
      <Acciones
        url={`/trayecto/${row.id}/edit`}
        urlDelete={`/trayecto/${row.id}`}
        navegar="/trayectos"
      />
    ),
  }, */
];

export default function Trayecto() {
  const [loading, setLoading] = useState(true);
  const [trayectos, setTrayectos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    GetAll(setTrayectos, setLoading, "/trayectos");

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
        title="TRAYECTOS"
        // Boton para crear nuevos registros
        link={<Create path="/trayecto/create" />}
        // Tabla
        tabla={
          permisos.includes("crear trayecto") ? (
            <Tabla columns={columns} data={trayectos} />
          ) : null
        }
        // Manejar Loader
        isLoading={loading}
      />
    </>
  );
}
