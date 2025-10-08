import { useEffect, useState } from "react";
import { GetAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import { useLocation } from "react-router-dom";
import { ContainerTable } from "../../components/ContainerTable";
import { Tabla } from "../../components/Tabla";
import { Create } from "../../components/Link";
import Acciones from "../../components/Acciones";

export default function Trayecto() {
  const [loading, setLoading] = useState(true);
  const [trayectos, setTrayectos] = useState([]);
  const [trayectosFiltrados, setTrayectosFiltrados] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["nombre"];

  // Inicializar datos filtrados
  useEffect(() => {
    setTrayectosFiltrados(trayectos);
  }, [trayectos]);

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    GetAll(setTrayectos, setLoading, "/trayectos");

    // Motrar Alerta al registrar un nuevo PNF
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
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("trayecto.editar") ||
    permisos.includes("trayecto.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/trayecto/${row.id}/edit`}
                urlDelete={`/trayecto/${row.id}`}
                navegar="/trayectos"
                editar="trayecto.editar"
                eliminar="trayecto.eliminar"
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
        title="TRAYECTOS"
        // Propiedades para el buscador
        data={trayectos}
        searchData={trayectos}
        onSearchFiltered={setTrayectosFiltrados}
        searchFields={camposBusqueda}
        placeholder="BUSCAR..."
        showStats={true}
        // Boton para crear nuevos registros
        link={<Create path="/trayecto/create" />}
        // Tabla
        tabla={
          permisos.includes("trayecto.crear") ? (
            <Tabla columns={columns} data={trayectosFiltrados} />
          ) : null
        }
        // Manejar Loader
        isLoading={loading}
      />
    </>
  );
}
