import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { GetAll } from "../../services/Api";
import Acciones from "../../components/Acciones";
import { Tabla } from "../../components/Tabla";
import Alerta from "../../components/Alert";
import { useLocation } from "react-router-dom";
import { SearchBox } from "../../components/SearchBox";

export function Usuario() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["name", "email", "roles[0].name"];

  useEffect(() => {
    // Leer permisos cada vez que el componente se monta o el localStorage cambia
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    GetAll(setUsuarios, setLoading, "/usuarios");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  // Inicializar datos filtrados
  useEffect(() => {
    setUsuariosFiltrados(usuarios);
  }, [usuarios]);

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
    ...(permisos.includes("usuario.editar") ||
    permisos.includes("usuario.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/usuario/${row.id}/edit`}
                urlDelete={`/usuario/${row.id}`}
                navegar="/Usuarios"
                editar="usuario.editar"
                eliminar="usuario.eliminar"
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
        title="USUARIOS"
        // Propiedades para el buscador
        data={usuarios}
        searchData={usuarios}
        onSearchFiltered={setUsuariosFiltrados}
        searchFields={camposBusqueda}
        placeholder="BUSCAR..."
        showStats={true}
        // Boton para crear nuevos registros
        link={
          permisos.includes("usuario.crear") ? (
            <Create path="/usuarios/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={usuariosFiltrados} />}
        // Manejar Loader
        isLoading={loading}
      />
    </>
  );
}
