import React, { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { GetAll } from "../../services/Api";
import Modal, { ButtomModal } from "../../components/Modal";

function Coordinador() {
  const [coordinador, setCoodinador] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = [
    "docente.persona.cedula_persona",
    "docente.persona.nombre",
    "docente.persona.apellido",
  ];

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de registros
    GetAll(setCoodinador, setLoading, "/coordinadores");

    // Motrar Alerta al registrar un nuevo Coordinador
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const columns = [
    {
      name: "ID",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "CÉDULA",
      selector: (row) => row.docente.persona.cedula_persona,
    },
    {
      name: "NOMBRE",
      selector: (row) => row.docente.persona.nombre,
      sortable: true,
    },
    {
      name: "APELLIDO",
      selector: (row) => row.docente.persona.apellido,
      sortable: true,
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.docente.persona.nombre}`} id={row.id}>
            <p>
              <b>NOMBRE: </b> {row.docente.persona.nombre}
            </p>
            <p>
              <b>APELLIDO: </b> {row.docente.persona.apellido}
            </p>
            <p>
              <b>PNF: </b> {row.docente.pnf.nombre}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("coordinador.editar") ||
    permisos.includes("coordinador.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/coordinador/${row.id}/edit`}
                urlDelete={`/coordinador/${row.id}`}
                navegar="/coordinador"
                editar={"coordinador.editar"}
                eliminar={"coordinador.eliminar"}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Contenedor para la tablas de Administrador */}
      <ContainerTable
        // Titulo para la tabla PNF
        title="COORDINADORES"
        // Boton para crear nuevos registros
        link={permisos.includes("coordinador.crear") ? (
        <Create path="/coordinador/create" /> ) : null}
        isLoading={loading}
        // Tabla
        tabla={
          <Tabla
            columns={columns}
            data={coordinador}
            searchFields={camposBusqueda}
          />
        }
      />
    </>
  );
}

export default Coordinador;
