import React, { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import Acciones from "../../components/Acciones";
import { useLocation } from "react-router-dom";
import Alerta, { AlertaError } from "../../components/Alert";
import Api, { GetAll } from "../../services/Api";
import Modal, { ButtomModal } from "../../components/Modal";
import { Buttom } from "../../components/Buttom";

function Docente() {
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();

  // Campos por los que buscar - definidos directamente aquí
  const camposBusqueda = [
    "persona.cedula_persona",
    "persona.nombre",
    "persona.apellido",
    "persona.email",
    "pnf.nombre",
  ];

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de registros
    GetAll(setDocentes, setLoading, "/docentes");

    // Motrar Alerta al registrar un nuevo Coordinador
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  
  const descargarPDF = async () => {
    try {
      const response = await Api.get("/docente/pdf", {
        responseType: "blob",
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "docentes.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      AlertaError("Error al descargar el PDF");
      console.error(error);
    }
  };

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
      name: "APELLIDO",
      selector: (row) => row.persona.apellido,
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
              <b>DEDICACIÓN: </b> {row.condicion_contrato.dedicacion}
            </p>
            <p>
              <b>FECHA INICIO:</b>{" "}
              {new Date(row.condicion_contrato.fecha_inicio).toLocaleDateString(
                "es-ES"
              )}
            </p>
            <p>
              <b>FECHA FIN:</b>{" "}
              {new Date(row.condicion_contrato.fecha_fin).toLocaleDateString(
                "es-ES"
              )}
            </p>
            <p>
              <b>GRADO INSTITUCIONAL:</b> {row.persona.grado_inst}
            </p>
            <p>
              <b>HORAS ACADÉMICAS:</b> {row.horas_dedicacion}
            </p>
            <p>
              <b>CATEGORÍA:</b> {row.categoria}
            </p>
            {/* mostrar Unidades curriculares si es una o mas */}
            {row.unidades_curriculares && (
              <p>
                <b>UNIDADES CURRICULARES: </b>
                {row.unidades_curriculares.map((unidades) => (
                  <span key={unidades.id}>{unidades.nombre}, </span>
                ))}
              </p>
            )}
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

  return (
    <>
      {/* Contenedor para la tablas de Administrador */}
      <ContainerTable
        // Titulo para la tabla PNF
        title="DOCENTES"
        // Boton para descargar PDF
        button_pdf={
          permisos.includes("docente.pdf") ? (
            <Buttom
              type="button"
              style="btn btn-danger mb-3"
              onClick={descargarPDF}
              title="Generar PDF"
              text="Generar PDF"
            />
          ) : null
        }
        // Boton para crear nuevos registros
        link={
          permisos.includes("docente.crear") ? (
            <Create path="/docente/create" />
          ) : null
        }
        isLoading={loading}
        // Tabla
        tabla={<Tabla columns={columns} data={docentes} searchFields={camposBusqueda} />}
      />
    </>
  );
}

export default Docente;
