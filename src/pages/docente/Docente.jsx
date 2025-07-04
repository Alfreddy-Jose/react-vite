import React, { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";
import { GetAll } from "../../services/Api";
import Modal, { ButtomModal } from "../../components/Modal";

  // Leer permisos del localStorage
  //const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "CÉDULA PERSONA",
    selector: (row) => row.cedula_persona,
  },
  {
    name: "PERSONA",
    selector: (row) => row.persona.nombre,
    sortable: true,
  },
  {
    name: "+INFO",
    cell: (row) => (
      <div>
        <ButtomModal id={row.id} />

        <Modal titleModal={`+INFO ${row.persona.nombre}`} id={row.id}>
          <p>
            <b>NOMBRE: </b> {row.persona.nombre}
          </p>
          <p>
            <b>APELLIDO: </b> {row.persona.apellido}
          </p>
          <p>
            <b>PNF: </b> {row.pnf.nombre}
          </p>
        </Modal>
      </div>
    ),
  },
  {
    name: "ACCIONES",
    cell: (row) => (
      <Acciones
        url={`/pnf/${row.id}/edit`}
        urlDelete={`/pnf/${row.id}`}
        navegar="/pnf"
      />
    ),
  },
];

function Docente() {
  const [docente, setDocente] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Mostrar la lista de registros
    GetAll(setDocente, setLoading, "/docente");

    // Motrar Alerta al registrar un nuevo Coordinador
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  return (
    <>
      {/* Contenedor para la tablas de Administrador */}
      <ContainerTable
        // Titulo para la tabla PNF
        title="DOCENTES"
        // Boton para crear nuevos registros
        link={<Create path="/docente/create" />}
        isLoading={loading}
        // Tabla
        tabla={<Tabla columns={columns} data={docente} />}
      />
    </>
  );
}

export default Docente;
