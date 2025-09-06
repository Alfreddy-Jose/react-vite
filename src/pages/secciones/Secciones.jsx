import { useEffect, useState } from "react";
import { ContainerTable } from "../../components/ContainerTable";
import { Create } from "../../components/Link";
import { Tabla } from "../../components/Tabla";
import { useLocation } from "react-router-dom";
import Alerta, { AlertaError } from "../../components/Alert";
import Api, { GetAll } from "../../services/Api";
import Modal, { ButtomModal } from "../../components/Modal";
import Acciones from "../../components/Acciones";
import { useFormik } from "formik";
import { FORM_LABELS } from "../../constants/formLabels";
import SelectSearch from "../../components/SelectSearch";
import { Buttom } from "../../components/Buttom";
import { useAuth } from "../../context/AuthContext";

export function Secciones() {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permisos, setPermisos] = useState([]);
  const location = useLocation();


  // Nueva función para buscar secciones
  const buscarSecciones = async (parametros) => {
    setLoading(true);
    try {
      // Llamada a la API con los parámetros de búsqueda
      const response = await GetAll(
        setSecciones,
        setLoading,
        `/secciones?${new URLSearchParams(parametros).toString()}`
      );
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Leer permisos del localStorage
    const permisosLS = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisosLS);

    // Mostrar la lista de Secciones
    GetAll(setSecciones, setLoading, "/secciones");

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");
  }, [location.state]);

  // Definir las columnas de la tabla
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
    },
    {
      name: "+INFO",
      cell: (row) => (
        <div>
          <ButtomModal id={row.id} />

          <Modal titleModal={`+INFO ${row.nombre}`} id={row.id}>
            <p>
              <b>PNF: </b> {row.pnf.nombre}
            </p>
            <p>
              <b>TIPO MATRICULA: </b> {row.matricula.nombre}
            </p>
            <p>
              <b>TRAYECTO: </b>
              {row.trayecto.nombre}
            </p>
            <p>
              <b>SEDE: </b> {row.sede.nombre_sede}
            </p>
            <p>
              <b>LAPSO: </b> {row.lapso.ano}
            </p>
            <p>
              <b>NÚMERO DE SECCIÓN: </b> {row.numero_seccion}
            </p>
          </Modal>
        </div>
      ),
    },
    // Mostrar columna solo si tiene al menos uno de los permisos
    ...(permisos.includes("seccion.editar") ||
    permisos.includes("seccion.eliminar")
      ? [
          {
            name: "ACCIONES",
            cell: (row) => (
              <Acciones
                url={`/seccion/${row.id}/edit`}
                urlDelete={`/seccion/${row.id}`}
                navegar="/secciones"
                editar="seccion.editar"
                eliminar="seccion.eliminar"
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
        header_parametros={
          <SeccionParametros buscarSecciones={buscarSecciones} permisos={permisos } />
        }
        // Titulo para la tabla
        title="SECCIONES"
        // Boton para crear nuevos registros
        link={
          permisos.includes("seccion.crear") ? (
            <Create path="/seccion/create" />
          ) : null
        }
        // Tabla
        tabla={<Tabla data={secciones} columns={columns} />}
        // Indicador de carga
        isLoading={loading}
      />
    </>
  );
}

export function SeccionParametros({ buscarSecciones, permisos }) {
  const [opciones, setOpciones] = useState({});
  const { lapsoActual } = useAuth();

  const initialValues = {
    lapso: lapsoActual?.id,
    sede: "",
    pnf: "",
    trayecto: "",
    matricula: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: () => {},
  });

  /*   const handleGenerarPDF = () => {
    const params = new URLSearchParams(formik.values).toString();
    window.open(`api/secciones/pdf?${params}`, "_blank");
  }; */
  const handleGenerarPDF = async () => {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(formik.values).filter(([_, v]) => v !== "")
      )
    );

    try {
      const response = await Api.get(`/secciones/pdf?${params}`, {
        responseType: "blob",
        withCredentials: true,
      });

      // Crear enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "secciones_" + lapsoActual.ano + ".pdf");
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
    // Obtener opciones para los selects
    const getOpciones = async () => {
      const response = await Api.get(`/seccion/getDataSelect`);
      setOpciones(response.data);
    };

    getOpciones();

    buscarSecciones(formik.values);
  }, [formik.values]);

  return (
    <div className="row">
      <div className="col-12">
        <form onSubmit={formik.handleSubmit}>
          <div className="row mb-5">
            {/* Input para codigo de PNF */}
            <SelectSearch
              label={FORM_LABELS.SECCION.LAPSO}
              name="lapso"
              options={opciones.lapsos || []}
              formik={formik}
              valueKey="id"
              labelKey="ano"
            />
            {/* Input para nombre de PNF */}
            <SelectSearch
              label={FORM_LABELS.SECCION.SEDE}
              name="sede"
              options={opciones.sedes || []}
              labelKey="nombre_sede"
              formik={formik}
            />
            {/* Input para PNF abreviado */}
            <SelectSearch
              label={FORM_LABELS.SECCION.PNF}
              name="pnf"
              options={opciones.pnfs || []}
              formik={formik}
            />
            {/* Input para PNF abreviado coodinacion */}
            <SelectSearch
              label={FORM_LABELS.SECCION.TRAYECTO}
              name="trayecto"
              options={opciones.trayectos || []}
              formik={formik}
            />
            {/* Boton para enviar */}
            <div className="col-sm-6 col-xl-4 d-flex justify-content-star align-items-end mt-4">
              <Buttom
                text="Limpiar"
                onClick={() => formik.resetForm()}
                style="btn-secondary me-2"
              />
              { permisos.includes("seccion.pdf") ?
              (<Buttom
                type="button"
                text="Generar PDF"
                title="PDF"
                style="btn-danger me-2"
                onClick={handleGenerarPDF}
              />) : null }
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
