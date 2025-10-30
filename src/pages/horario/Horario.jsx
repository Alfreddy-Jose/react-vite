import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { GetAll } from "../../services/Api";
import { Link, useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { Modal, ButtomModal } from "../../components/Modal";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";

export function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  /*   const [permisos, setPermisos] = useState([]); */
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = ["seccion.nombre", "trimestre.nombre", "estado"];

  useEffect(() => {
    // Leer permisos desde localStorage
    /*     const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS); */

    // Cargar horarios
    GetAll(setHorarios, setLoading, "/horarios");

    // Mostrar alerta si venimos de crear/editar
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegación
    window.history.replaceState({}, "");
  }, [location.state]);

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
      selector: (row) => row.trimestre?.nombre || "—",
      sortable: true,
    },
    {
      name: "ESTADO",
      selector: (row) => row.estado.toUpperCase(),
      sortable: true,
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />
          <Modal titleModal={`+INFO Horario ${row.id}`} id={row.id}>
            <p>
              <b>SECCIÓN:</b> {row.seccion?.nombre}
            </p>
            <p>
              <b>TRIMESTRE:</b> {row.trimestre?.nombre}
            </p>
            <p>
              <b>ESTADO:</b> {row.estado.toUpperCase()}
            </p>
          </Modal>
        </div>
      ),
    },
    {
      name: "VER UNIDADES CURRICULARES",
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
    {
      name: "ACCIONES",
      cell: (row) => (
        <Acciones
          urlDelete={`/horarios/${row.id}`}
          navegar="/docentes"
          eliminar="docente.eliminar"
        />
      ),
    },
  ];

  return (
    <>
      <ContainerTable
        title="HORARIOS POR SECCIONES"
        // Boton para crear nuevos registros
        link={
          // permisos.includes("horarios.crear") ? (
          <Create path="/horarios/create" />
          //  ) : null
        }
        isLoading={loading}
        tabla={
          <Tabla
            columns={columns}
            data={horarios}
            searchFields={camposBusqueda}
          />
        }
      />
    </>
  );
}
