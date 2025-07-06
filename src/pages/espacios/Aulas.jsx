import { useLocation } from "react-router-dom";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useEffect, useState } from "react";
import { GetAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import Acciones from "../../components/Acciones";
import { Modal, ButtomModal } from "../../components/Modal";

export default function Aulas() {
  const [loading, setLoading] = useState(true);
  const [aulas, setAulas] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    GetAll(setAulas, setLoading, "/aula");

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
    { name: "CODIGO", selector: (row) => row.codigo, sortable: true },
    { name: "NOMBRE", selector: (row) => row.nombre_aula, sortable: true },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.nombre_aula}`} id={row.id}>
            <p>
              <b>CODIGO: </b> {row.codigo}
            </p>
            <p>
              <b>NOMBRE: </b> {row.nombre_aula}
            </p>
            <p>
              <b>ETAPA: </b> {row.etapa}
            </p>
            <p>
              <b>NÚMERO: </b> {row.nro_aula}
            </p>
            <p>
              <b>SEDE: </b> {row.sede.nombre_sede}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("editar aula") || permisos.includes("eliminar aula")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/aula/${row.id}/edit`}
                urlDelete={`/aula/${row.id}`}
                navegar="/aula"
                editar="editar aula"
                eliminar="eliminar aula"
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
        title="AULAS"
        // Boton para crear nuevos registros
        link={
          permisos.includes("crear aula") ? (
            <Create path="/aula/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={aulas} />}
        // Loader
        isLoading={loading}
      />
    </>
  );
}
