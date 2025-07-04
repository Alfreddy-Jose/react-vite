import React, { useEffect, useState } from "react";
import Acciones from "../../components/Acciones";
import Modal, { ButtomModal } from "../../components/Modal";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { GetAll } from "../../services/Api";
import { useLocation } from "react-router-dom";
import Alerta from "../../components/Alert";

// Leer permisos del localStorage
const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

const columns = [
  {
    name: "ID",
    selector: (row, index) => index + 1, // Muestra el contador incremental
    sortable: true,
  },
  {
    name: "CÉDULA",
    selector: (row) => row.cedula_persona,
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
            <b>CÉDULA: </b> {row.cedula_persona}
          </p>
          <p>
            <b>NOMBRE: </b> {row.nombre}
          </p>
          <p>
            <b>APELLIDO: </b> {row.apellido}
          </p>
          <p>
            <b>CORREO: </b> {row.email}
          </p>
          <p>
            <b>DIRECCIÓN: </b> {row.direccion}
          </p>
          <p>
            <b>MUNICIPIO: </b> {row.municipio}
          </p>
          <p>
            <b>TELÉFONO: </b> {row.telefono}
          </p>
          <p>
            <b>TIPO PERSONA: </b> {row.tipo_persona}
          </p>
          <p>
            <b>GRADO INSTITUCIONAL: </b> {row.grado_inst}
          </p>
        </Modal>
      </div>
    ),
  },
  // Mostrar columna solo si tiene al menos uno de los permisos
  ...(permisos.includes("editar persona") ||
  permisos.includes("eliminar persona")
    ? [
        {
          name: "ACCIONES",
          cell: (row) => (
            <Acciones
              url={`/persona/${row.id}/edit`}
              urlDelete={`/persona/${row.id}`}
              navegar="/persona"
              editar="editar persona"
              eliminar="eliminar persona"
            />
          ),
        },
      ]
    : []),
  /*   {
    name: "ACCIONES",
    cell: (row) => (
      <Acciones
        url={`/persona/${row.id}/edit`}
        urlDelete={`/persona/${row.id}`}
        navegar="/persona"
      />
    ),
  }, */
];

export default function Persona() {
  const [personas, setPnf] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Mostrar la lista de Personas
    GetAll(setPnf, setLoading, "/personas");

    // Motrar Alerta al registrar una nueva Persona
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  return (
    <>
      {/* Contenedor para la tablas de Personas */}
      <ContainerTable
        // Titulo para la tabla Personas
        title="PERSONAS"
        // Boton para crear nuevos registros
        link={
          permisos.includes("crear persona") ? (
            <Create path="/persona/create" />
          ) : null
        }
        isLoading={loading}
        // Tabla
        tabla={<Tabla columns={columns} data={personas} />}
      />
    </>
  );
}
