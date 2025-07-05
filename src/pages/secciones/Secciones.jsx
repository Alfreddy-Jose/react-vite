import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { GetAll } from "../../services/Api";
import Modal, { ButtomModal } from "../../components/Modal";
import Acciones from "../../components/Acciones";

// Leer permisos del localStorage
const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

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
    grow: 3,
  },
  {
    name: "+INFO",
    cell: (row) => (
      <div>
        <ButtomModal id={row.id} />

        <Modal titleModal={`+INFO ${row.abreviado}`} id={row.id}>
          <p>
            <b>CODIGO: </b> {row.codigo}
          </p>
          <p>
            <b>NOMBRE: </b> {row.nombre}
          </p>
          <p>
            <b>ABREVIADO: </b> {row.abreviado}
          </p>
          <p>
            <b>ABREVIADO COORDINACIÓN: </b>
            {row.abreviado_coord}
          </p>
        </Modal>
      </div>
    ),
  },
  // Mostrar columna solo si tiene al menos uno de los permisos
  ...(permisos.includes("editar seccion") || permisos.includes("eliminar seccion")
    ? [
        {
          name: "ACCIONES",
          cell: (row) => (
            <Acciones
              url={`/pnf/${row.id}/edit`}
              urlDelete={`/pnf/${row.id}`}
              navegar="/pnf"
              editar="editar seccion"
              eliminar="eliminar seccion"
            />
          ),
        },
      ]
    : []),
];

export function Secciones() {
    const [secciones, setSecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
  
    useEffect(() => {
      // Mostrar la lista de PNF
      GetAll(setSecciones, setLoading, "/pnf");
  
      // Motrar Alerta al registrar un nuevo PNF
      if (location.state?.message) {
        Alerta(location.state.message);
      }
  
      // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
      window.history.replaceState({}, "");
    }, [location.state]);
  
  return (
    <>
      {/* Contenedor para la tablas */}
      <ContainerTable
        // Titulo para la tabla 
        title="SECCIONES"
        // Boton para crear nuevos registros
        link={ permisos.includes('crear seccion') ? (<Create path="/seccion/create" />) : null}
        // Tabla
        tabla={<Tabla columns={columns} />}
        // Indicador de carga
        isLoading={loading}
      />
    </>
  );
}
