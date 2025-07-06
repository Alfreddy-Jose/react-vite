import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import { GetAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import Acciones from "../../components/Acciones";

export function LapsoAcademico() {
  const [loading, setLoading] = useState(true);
  const [lapsos, setLapsos] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de PNF
    GetAll(setLapsos, setLoading, "/lapsos");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1, // Muestra el contador incremental
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
      selector: (row) => row.tipolapso.nombre,
      sortable: true,
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("editar lapso") || permisos.includes("eliminar lapso")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/lapso_academico/${row.id}/edit`}
                urlDelete={`/lapso/${row.id}`}
                navegar="/lapso_academico"
                editar="editar lapso"
                eliminar="eliminar lapso"
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
        title="LAPSO ACADEMICO"
        // Boton para crear nuevos registros
        link={
          permisos.includes("crear lapso") ? (
            <Create path="/lapso_academico/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={lapsos} />}
        isLoading={loading}
      />
    </>
  );
}
