import { useEffect, useState, useMemo } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { GetAll } from "../../services/Api";
import { Link, useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";
import { useAuth } from "../../context/AuthContext";

export function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const [pnf, setPnf] = useState("");
  const location = useLocation();
  const { lapsoActual, user } = useAuth();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["seccion.nombre", "trimestre?.nombre_relativo", "estado"];

  useEffect(() => {
    // Leer permisos desde localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    const pnfLS = localStorage.getItem("pnf") || "";
    setPnf(pnfLS);

    // Cargar horarios
    GetAll(setHorarios, setLoading, `/horarios/${lapsoActual?.nombre_lapso}`);

    // Mostrar alerta si venimos de crear/editar
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegación
    window.history.replaceState({}, "");
  }, [location.state, lapsoActual]);

  // Filtrar horarios por el PNF de la sección
  const horariosFiltrados = useMemo(() => {

    if (user?.roles[0]?.name === "COORDINADOR" && pnf) {
      const filtrados = horarios.filter((horario) => {
        const coincide = horario.seccion?.pnf_id == pnf;
        return coincide;
      });
      return filtrados;
    }

    return horarios;
  }, [horarios, pnf, user?.roles]);

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
    },
    {
      name: "SECCIÓN",
      selector: (row) => row.seccion?.nombre || "—",
      sortable: true,
    },
    {
      name: "TRIMESTRE",
      selector: (row) => row.trimestre?.nombre_relativo || "—",
      sortable: true,
    },
    {
      name: "VER CLASES",
      cell: (row) => (
        <Link
          className="btn traslation btn-primary"
          to={`/horarios/${row.id}/clases`}
          title="Ver Clases"
        >
          <i className="fas fa-eye"></i>
        </Link>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("horario.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                urlDelete={`/horarios/${row.id}`}
                navegar="/horarios"
                eliminar="horario.eliminar"
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <ContainerTable
        title="HORARIOS POR SECCIONES"
        // Boton para crear nuevos registros
        link={
          permisos.includes("horario.crear") ? (
          <Create path="/horarios/create" />
          ) : null
        }
        isLoading={loading}
        tabla={
          <Tabla
            columns={columns}
            data={horariosFiltrados} // Cambiado aquí
            searchFields={camposBusqueda}
          />
        }
      />
    </>
  );
}