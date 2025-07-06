import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import { GetAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import Acciones from "../../components/Acciones";
import { Modal, ButtomModal } from "../../components/Modal";

function UnidadCurricular() {
  const [loading, setLoading] = useState(true);
  const [unidad, setUnidad] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de PNF
    GetAll(setUnidad, setLoading, "/unidad_curricular");

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
      sortable: true,
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
              <b>NOMBRE: </b> {row.nombre}
            </p>
            <p>
              <b>HORAS ACADÉMICAS: </b> {row.hora_acad}
            </p>
            <p>
              <b>HORAS TOTAL ESTIMADAS: </b> {row.hora_total_est}
            </p>
            <p>
              <b>UNIDAD CRÉDITO: </b> {row.unidad_credito}
            </p>
            <p>
              <b>PERÍODO: </b>
              {row.periodo}
            </p>
            <p>
              <b>TRIMESTRE: </b> {row.trimestre.nombre}
            </p>
            <p>
              <b>DESCRIPCIÓN: </b> {row.descripcion}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("editar unidad") ||
    permisos.includes("eliminar unidad")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/unidad_curricular/${row.id}/edit`}
                urlDelete={`/unidad_curricular/${row.id}`}
                navegar="/unidad_curricular"
                editar="editar unidad"
                eliminar="eliminar unidad"
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
        title="UNIDADES CURRICULARES"
        // Boton para crear nuevos registros
        link={
          permisos.includes("crear unidad") ? (
            <Create path="/unidad_curricular/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={unidad} />}
        isLoading={loading}
      />
    </>
  );
}

export default UnidadCurricular;
