import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { useLocation } from "react-router-dom";
import { GetAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";

export function TipoMatricula() {
  const [loading, setLoading] = useState(true);
  const [matricula, setMatricula] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de Matricula
    GetAll(setMatricula, setLoading, "/matriculas");

    // Motrar Alerta al registrar unm nuevo tipo de matricula
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  // Definir las columnas de la tabla
  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1, // Muestra el contador incremental
      sortable: true,
    },
    {
      name: "NÚMERO",
      selector: (row) => row.numero,
      sortable: true,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.nombre,
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("editar matricula") ||
    permisos.includes("eliminar matricula")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/tipo_matricula/${row.id}/edit`}
                urlDelete={`/matricula/${row.id}`}
                navegar="/matricula"
                editar="editar matricula"
                eliminar="eliminar matricula"
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
        title="TIPO MATRICULA"
        // Boton para crear nuevos registros
        link={
          permisos.includes("crear matricula") ? (
            <Create path="/tipo_matricula/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla data={matricula} columns={columns}></Tabla>}
        isLoading={loading}
      />
    </>
  );
}
