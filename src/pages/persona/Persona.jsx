import React, { useEffect, useState } from "react";
import Acciones from "../../components/Acciones";
import Modal, { ButtomModal } from "../../components/Modal";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import Api, { GetAll } from "../../services/Api";
import { useLocation } from "react-router-dom";
import Alerta, { AlertaError } from "../../components/Alert";
import { Buttom } from "../../components/Buttom";
import { useFormik } from "formik";
import { FORM_LABELS } from "../../constants/formLabels";
import SelectSearch from "../../components/SelectSearch";

export default function Persona() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const [personasFiltradas, setPersonasFiltradas] = useState([]);
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = [
    "cedula_persona",
    "nombre",
    "apellido",
    "email",
    "tipo_persona",
  ];

  // Nueva función para buscar secciones
  const buscarPersonas = async (parametros) => {
    setLoading(true);
    try {
      // Llamada a la API con los parámetros de búsqueda
      const response = await GetAll(
        setPersonas,
        setLoading,
        `/personas?${new URLSearchParams(parametros).toString()}`
      );
    } catch (error) {
      setLoading(false);
    }
  };

  // Inicializar datos filtrados
  useEffect(() => {
    setPersonasFiltradas(personas);
  }, [personas]);

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de Personas
    GetAll(setPersonas, setLoading, "/personas");

    // Motrar Alerta al registrar una nueva Persona
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  const descargarPDF = async () => {
    try {
      const response = await Api.get("/persona/pdf", {
        responseType: "blob",
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "personas.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      AlertaError("Error al descargar el PDF");
      console.error(error);
    }
  };

  // Definir las columnas de la tabla
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
    ...(permisos.includes("persona.editar") ||
    permisos.includes("persona.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/persona/${row.id}/edit`}
                urlDelete={`/persona/${row.id}`}
                navegar="/persona"
                editar="persona.editar"
                eliminar="persona.eliminar"
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Contenedor para la tablas de Personas */}
      <ContainerTable
        header_parametros={
          <PersonaParametros
            buscarPersona={buscarPersonas}
            permisos={permisos}
          />
        }
        // Titulo para la tabla Personas
        title="PERSONAS"
        // Propiedades para el buscador
        data={personas}
        searchData={personas}
        onSearchFiltered={setPersonasFiltradas}
        searchFields={camposBusqueda}
        placeholder="BUSCAR..."
        showStats={true}
        // Boton para descargar el PDF
/*         button_pdf={
          permisos.includes("persona.pdf") ? (
            <Buttom
              type="button"
              style="btn btn-danger mb-3"
              onClick={descargarPDF}
              title="Generar PDF"
              text="Generar PDF"
            />
          ) : null
        } */
        // Boton para crear nuevos registros
        link={
          permisos.includes("persona.crear") ? (
            <Create path="/persona/create" />
          ) : null
        }
        isLoading={loading}
        // Tabla
        tabla={<Tabla columns={columns} data={personasFiltradas} />}
      />
    </>
  );
}

export function PersonaParametros({ buscarPersona, permisos }) {

  const initialValues = {
    tipo_persona: "",
    grado_inst: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: () => {},
  });
  // Función para generar y descargar el PDF
  const handleGenerarPDF = async () => {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(formik.values).filter(([_, v]) => v !== "")
      )
    );

    try {
      const response = await Api.get(`/persona/pdf?${params}`, {
        responseType: "blob", 
        withCredentials: true,
      });

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "personas.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Detalles del error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      AlertaError(
        `Error ${error.response?.status}: ${
          error.response?.data?.message || "Sin detalles"
        }`
      );
    }
  };

  // Dispara la búsqueda en cada cambio
  useEffect(() => {
    buscarPersona(formik.values);
  }, [formik.values]);

  return (
    <div className="row">
      <div className="col-12">
        <form onSubmit={formik.handleSubmit}>
          <div className="row mb-5">
            {/* Select para tipo de PERSONA */}
            <SelectSearch
              label={FORM_LABELS.PERSONAS.TYPE}
              name="tipo_persona"
              options={[
                { id: "ESTUDIANTE", nombre: "ESTUDIANTE" },
                { id: "DOCENTE", nombre: "DOCENTE" },
                { id: "ADMINISTRATIVO", nombre: "ADMINISTRATIVO" },
              ]}
              formik={formik}
            />
            {/* Input para grado de la PERSONA */}
            <SelectSearch
              label={FORM_LABELS.PERSONAS.GRADO}
              name="grado_inst"
              formik={formik}
              options={[
                { id: "INGENIERO", nombre: "INGENIERO" },
                { id: "LICENCIADO", nombre: "LICENCIADO" },
                { id: "DOCTOR", nombre: "DOCTOR" },
                { id: "TECNICO SUPERIOR", nombre: "TECNICO SUPERIOR" },
                { id: "BACHILLER", nombre: "BACHILLER" },
              ]}
            />
            {/* Boton para enviar */}
            <div className="col-sm-6 col-xl-4 d-flex justify-content-star align-items-end mt-4">
              <Buttom
                text="Limpiar"
                onClick={() => formik.resetForm()}
                style="btn-secondary me-2"
              />
              {permisos.includes("persona.pdf") ? (
                <Buttom
                  type="button"
                  text="Generar PDF"
                  title="PDF"
                  style="btn-danger me-2"
                  onClick={handleGenerarPDF}
                />
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
