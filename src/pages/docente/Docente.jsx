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
const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: "CÉDULA PERSONA",
    selector: (row) => row.persona.cedula_persona,
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
            <b>CÉDULA: </b> {row.persona.cedula_persona}
          </p>
          <p>
            <b>NOMBRE: </b> {row.persona.nombre}
          </p>
          <p>
            <b>APELLIDO: </b> {row.persona.apellido}
          </p>
          <p>
            <b>PNF: </b> {row.pnf.nombre}
          </p>
          <p>
            <b>DIRECCIÓN: </b> {row.persona.direccion}
          </p>
          <p>
            <b>MUNICIPIO: </b> {row.persona.municipio}
          </p>
          <p>
            <b>TELEFONO: </b> {row.persona.telefono}
          </p>
          <p>
            <b>EMAIL: </b> {row.persona.email}
          </p>
          <p>
            <b>TIPO PERSONA:</b> {row.persona.tipo_persona}
          </p>
          <p>
            <b>GRADO INTITUCIONAL:</b> {row.persona.grado_inst}
          </p>
          <p>
            <b>CATEGORÍA:</b> {row.categoria}
          </p>
        </Modal>
      </div>
    ),
  },
  // Mostrar columna solo si tiene al menos uno de los permisos
  ...(permisos.includes("docente.editar") ||
  permisos.includes("docente.eliminar")
    ? [
        {
          name: "ACCIONES",
          cell: (row) => (
            <Acciones
              url={`/docente/${row.id}/edit`}
              urlDelete={`/docente/${row.id}`}
              navegar="/docentes"
              editar="docente.editar"
              eliminar="docente.eliminar"
            />
          ),
        },
      ]
    : []),
];

function Docente() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Mostrar la lista de registros
    GetAll(setDocentes, setLoading, "/docentes");

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

        link={
          permisos.includes("docente.crear") ? (
            <Create path="/docente/create" />
          ) : null
        }
        isLoading={loading}
        // Tabla
        tabla={<Tabla columns={columns} data={docentes} />}
      />
    </>
  );
}

export default Docente;
