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
    selector: (row, index) => index + 1,
    sortable: true,
  },
  {
    name: "CÉDULA",
    selector: (row) => row.persona.cedula_persona,
  },
  {
    name: "NOMBRE",
    selector: (row) => row.persona.nombre,
    sortable: true,
  },
  {
    name: "SECCIÓN",
    selector: (row) => row.seccion.nombre,
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
            <b>SECCIÓN: </b> {row.seccion.nombre}
          </p>
          <p>
            <b>TELÉFONO: </b> {row.persona.telefono}
          </p>
          <p>
            <b>CORREO: </b> {row.persona.email}
          </p>
          <p>
            <b>TIPO PERSONA:</b> {row.persona.tipo_persona}
          </p>
          <p>
            <b>GRADO INSTITUCIONAL:</b> {row.persona.grado_inst}
          </p>
          <p>
            <b>MUNICIPIO: </b> {row.persona.municipio}
          </p>
          <p>
            <b>DIRECCIÓN: </b> {row.persona.direccion}
          </p>
        </Modal>
      </div>
    ),
  },
  // Mostrar columna solo si tiene al menos uno de los permisos
  ...(permisos.includes("vocero.editar") || permisos.includes("vocero.eliminar")
    ? [
        {
          name: "ACCIONES",
          cell: (row) => (
            <Acciones
              url={`/vocero/${row.id}/edit`}
              urlDelete={`/vocero/${row.id}`}
              navegar="/voceros"
              editar="vocero.editar"
              eliminar="vocero.eliminar"
            />
          ),
        },
      ]
    : []),
];

function Voceros() {
  const [voceros, setVoceros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vocerosFiltrados, setVocerosFiltrados] = useState([]);
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = [
    "persona.cedula_persona",
    "persona.nombre",
    "persona.apellido",
    "persona.email",
    "seccion.nombre",
  ];
  // Inicializar datos filtrados
  useEffect(() => {
    setVocerosFiltrados(voceros);
  }, [voceros]);

  useEffect(() => {
    // Mostrar la lista de registros
    GetAll(setVoceros, setLoading, "/voceros");

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
        title="VOCEROS"
        // Propiedades para el buscador
        data={voceros}
        searchData={voceros}
        onSearchFiltered={setVocerosFiltrados}
        searchFields={camposBusqueda}
        placeholder="BUSCAR..."
        showStats={true}
        // Boton para crear nuevos registros
        link={
          permisos.includes("vocero.crear") ? (
            <Create path="/vocero/create" />
          ) : null
        }
        isLoading={loading}
        // Tabla
        tabla={<Tabla columns={columns} data={vocerosFiltrados} />}
      />
    </>
  );
}

export default Voceros;
