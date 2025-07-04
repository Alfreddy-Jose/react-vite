import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { GetAll } from "../../services/Api";
import Acciones from "../../components/Acciones";
import { Tabla } from "../../components/Tabla";
import Alerta from "../../components/Alert";
import { useLocation } from "react-router-dom";

// Leer permisos del localStorage
const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

const columns = [
  { name: "ID", selector: (row, index) => index + 1, sortable: true },
  { name: "NOMBRE", selector: (row) => row.name, sortable: true },
  { name: "EMAIL", selector: (row) => row.email, sortable: true },
  {
    name: "ROL",
    selector: (row) =>
      row.roles && row.roles.length > 0 ? row.roles[0].name : "Sin rol",
    sortable: true,
  },
  // Mostrar columna solo si tiene al menos uno de los permisos
  ...(permisos.includes("editar usuario") ||
  permisos.includes("eliminar usuario")
    ? [
        {
          name: "ACCIONES",
          cell: (row) => (
            <Acciones
              url={`/usuario/${row.id}/edit`}
              urlDelete={`/usuario/${row.id}`}
              navegar="/Usuarios"
              editar="editar usuario"
              eliminar="eliminar usuario"
            />
          ),
        },
      ]
    : []),
];

export function Usuario() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const location = useLocation();

  useEffect(() => {
    GetAll(setUsuarios, setLoading, "/usuarios");

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
        title="USUARIOS"
        // Boton para crear nuevos registros
        link={
          permisos.includes("crear usuario") ? (
            <Create path="/usuarios/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={usuarios} />}
        // Manejar Loader
        isLoading={loading}
      />
    </>
  );
}
