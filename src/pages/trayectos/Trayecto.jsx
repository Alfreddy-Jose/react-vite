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
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  // Campos por los que buscar
  const camposBusqueda = ["nombre"];

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    GetAll(setTrayectos, setLoading, "/trayectos");

    // Mostrar Alerta si hay mensaje
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion
    window.history.replaceState({}, "");
  }, [location.state]);

  // Definir las columnas de la tabla
  const columns = [
    { 
      name: "ID", 
      selector: (row) => row.id, 
      sortable: true,
      cell: (row, index) => index + 1
    },
    { 
      name: "NOMBRE", 
      selector: (row) => row.nombre, 
      sortable: true 
    },
    // Mostrar columna solo si tiene permisos
    ...(permisos.includes("trayecto.editar") || permisos.includes("trayecto.eliminar")
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
      <ContainerTable
        title="TRAYECTOS"
        link={<Create path="/trayecto/create" />}
        tabla={
          <Tabla 
            columns={columns} 
            data={trayectos} 
            searchFields={camposBusqueda}
          />
        }
        isLoading={loading}
      />
    </>
  );
}