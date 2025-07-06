import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { GetAll } from "../../services/Api";
import Modal, { ButtomModal } from "../../components/Modal";
import Acciones from "../../components/Acciones";

export function Secciones() {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de Secciones
    GetAll(setSecciones, setLoading, "/secciones");

    // Motrar Alerta al registrar un nuevo PNF
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
      sortable: false,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.nombre}`} id={row.id}>
            <p>
              <b>PNF: </b> {row.pnf.nombre}
            </p>
            <p>
              <b>TIPO MATRICULA: </b> {row.matricula.nombre}
            </p>
            <p>
              <b>TRAYECTO: </b>
              {row.trayecto.nombre}
            </p>
            <p>
              <b>SEDE: </b> {row.sede.nombre_sede}
            </p>
            <p>
              <b>LAPSO: </b> {row.lapso.ano}
            </p>
            <p>
              <b>NÚMERO DE SECCIÓN: </b> {row.numero_seccion}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("editar seccion") ||
    permisos.includes("eliminar seccion")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/seccion/${row.id}/edit`}
                urlDelete={`/seccion/${row.id}`}
                navegar="/secciones"
                editar="editar seccion"
                eliminar="eliminar seccion"
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
        title="SECCIONES"
        // Boton para crear nuevos registros
        link={
          permisos.includes("crear seccion") ? (
            <Create path="/seccion/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla data={secciones} columns={columns} />}
        // Indicador de carga
        isLoading={loading}
      />
    </>
  );
}
