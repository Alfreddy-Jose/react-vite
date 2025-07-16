import { Create } from "../../components/Link";
import { ContainerTable } from "../../components/ContainerTable";
import { Tabla } from "../../components/Tabla";
import { useEffect } from "react";
import { GetAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Modal, { ButtomModal } from "../../components/Modal";
import Acciones from "../../components/Acciones";

export default function Laboratorios() {
  const [loading, setLoading] = useState(true);
  const [laboratorios, setLaboratorios] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    GetAll(setLaboratorios, setLoading, "/laboratorios");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const columns = [
    { name: "ID", selector: (row, index) => index + 1, sortable: true },
    { name: "CODIGO", selector: (row) => row.codigo, sortable: true },
    { name: "NOMBRE", selector: (row) => row.nombre_aula, sortable: true },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.abreviado_lab}`} id={row.id}>
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
              <b>ABREVIADO: </b> {row.abreviado_lab}
            </p>
            <p>
              <b>EQUIPOS: </b> {row.equipos}
            </p>
            <p>
              <b>SEDE: </b> {row.sede.nombre_sede}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("laboratorio.editar") ||
    permisos.includes("laboratorio.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/laboratorio/${row.id}/edit`}
                urlDelete={`/laboratorio/${row.id}`}
                navegar="/laboratorio"
                editar="laboratorio.editar"
                eliminar="laboratorio.eliminar"
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
        title="LABORATORIO"
        // Boton para crear nuevos registros
        link={
          permisos.includes("laboratorio.crear") ? (
            <Create path="/laboratorio/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla columns={columns} data={laboratorios} />}
        // mostrando sniper cuando se cargan los datos
        isLoading={loading}
      />
    </>
  );
}
