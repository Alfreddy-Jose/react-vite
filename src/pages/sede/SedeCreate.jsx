import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { FORM_LABELS } from "../../constants/formLabels";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Create } from "../../components/Link";
import Api, { PostAll } from "../../services/Api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import Warning from "../../img/icons_warning.png";
import SelectSearch from "../../components/SelectSearch";
import { TextAreaLabel } from "../../components/TextAreaLabel";

const initialValues = {
  nro_sede: "",
  nombre_sede: "",
  nombre_abreviado: "",
  direccion: "",
  municipio_id: "",
  estado_id: "", // Añadido este campo que faltaba
  universidad_id: "",
  pnf_id: [],
}; 

// Validando campos
const validationSchema = Yup.object({
  nro_sede: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[0-9]*$/, "Solo números permitidos"),
  nombre_sede: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"),
  nombre_abreviado: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"),
  direccion: Yup.string().required("Este campo es obligatorio"),
  estado_id: Yup.string().required("Este campo es obligatorio"),
  municipio_id: Yup.string().required("Este campo es obligatorio"),
  pnf_id: Yup.array()
    .min(1, "Seleccione al menos un PNF")
    .required("Este campo es obligatorio"),
});

export function SedeCreate() {
  const navegation = useNavigate();
  const [universidad, setUniversidad] = useState(null);
  const [pnf, setPnf] = useState([]);
  const [loadingPnf, setLoadingPnf] = useState(true);
  const [loading, setLoading] = useState(true);
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  // Función para cargar municipios
  const cargarMunicipios = async (estadoId) => {
    if (!estadoId) {
      setMunicipios([]);
      return;
    }

    setLoadingMunicipios(true);
    try {
      const response = await Api.get(`/sede/getMunicipios/${estadoId}`);
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error al cargar Municipios:", error);
      setMunicipios([]);
    } finally {
      setLoadingMunicipios(false);
    }
  };

  // Función para enviar datos
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/sede", navegation);
    } catch (error) {
      if (error.response?.data?.errors) {
        const formikErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          formikErrors[key] = value[0];
        });
        setErrors(formikErrors);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      universidad_id: universidad?.id || "",
    },
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  // Efecto para cargar estados
  useEffect(() => {
    const getEstados = async () => {
      try {
        const response = await Api.get(`/sede/getEstados`);
        setEstados(response.data);
      } catch (error) {
        console.error("Error al cargar Estados:", error);
        setEstados([]);
      }
    };

    getEstados();
  }, []);

  // Efecto para cargar universidad
  useEffect(() => {
    const getUniversidad = async () => {
      try {
        const response = await Api.get("/universidad");
        // Asegúrate de que la respuesta tenga la estructura esperada
        setUniversidad(response.data);
      } catch (error) {
        console.error("Error fetching universidad data:", error);
        setUniversidad(null);
      } finally {
        setLoading(false);
      }
    };

    getUniversidad();
  }, []);

  // Efecto para cargar pnf
  useEffect(() => {
    const getPnf = async () => {
      try {
        const response = await Api.get("/sede/getPnf");
        setPnf(response.data);
      } catch (error) {
        console.error("Error fetching pnf data:", error);
        setPnf(null);
      } finally {
        setLoadingPnf(false);
      }
    };

    getPnf();
  }, []);

  // Efecto para cargar municipios cuando cambia el estado
  useEffect(() => {
    if (formik.values.estado_id) {
      cargarMunicipios(formik.values.estado_id);
    } else {
      setMunicipios([]);
      formik.setFieldValue("municipio_id", "");
    }
  }, [formik.values.estado_id]);

  // Mostrar Spinner mientras carga
  if (loading && loadingPnf) {
    return <Spinner />;
  }

  // Verificar si hay universidad configurada
  if (
    !universidad ||
    (Array.isArray(universidad) && universidad.length === 0)
  ) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-center p-4">
        <img src={Warning} alt="imagen de alerta" />
        <h2 className="h4 text-dark mb-3">¡Configuración requerida!</h2>
        <p className="text-muted mb-4">
          No has configurado los datos de la universidad. <br />
          Por favor completa esta información para continuar.
        </p>
        <Link to="/universidad" className="btn btn-primary">
          Configurar Universidad
        </Link>
      </div>
    );
  }

  // Renderizar el formulario
  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="NUEVA SEDE"
        link={
          <Create path="/sede" text="Volver" style="btn btn-secondary mb-4" />
        }
        input={
          <>
            {/* Input oculto para universidad_id */}
            <InputLabel
              hidden={true}
              name="universidad_id"
              value={universidad.id}
              formik={formik}
            />

            {/* Input para numero de SEDE */}
            <InputLabel
              label={FORM_LABELS.SEDE.SEDE_NUMBER}
              type="text"
              name="nro_sede"
              placeholder="NÚMERO DE SEDE"
              onBlur={formik.handleBlur}
              value={formik.values.nro_sede}
              formik={formik}
            />

            {/* Input para nombre de SEDE */}
            <InputLabel
              label={FORM_LABELS.USER.NAME}
              type="text"
              name="nombre_sede"
              placeholder="INGRESE UN NOMBRE"
              onBlur={formik.handleBlur}
              value={formik.values.nombre_sede}
              formik={formik}
            />

            {/* Input para nombre abreviado de SEDE */}
            <InputLabel
              label={FORM_LABELS.PNF.NAME_ABRE}
              type="text"
              name="nombre_abreviado"
              placeholder="NOMBRE ABREVIADO"
              onBlur={formik.handleBlur}
              value={formik.values.nombre_abreviado}
              formik={formik}
            />

            {/* Select para estado */}
            <SelectSearch
              label={FORM_LABELS.SEDE.ESTADO}
              name="estado_id"
              placeholder="SELECCIONE UN ESTADO"
              options={estados}
              labelKey="estado"
              valueKey="id_estado"
              value={formik.values.estado_id}
              formik={formik}
            />

            {/* Select para municipio */}
            <SelectSearch
              label={FORM_LABELS.SEDE.MUNICIPIO}
              name="municipio_id"
              placeholder={
                !formik.values.estado_id
                  ? "PRIMERO SELECCIONE UN ESTADO"
                  : loadingMunicipios
                  ? "CARGANDO MUNICIPIOS..."
                  : municipios.length === 0
                  ? "NO HAY MUNICIPIOS"
                  : "SELECCIONE UN MUNICIPIO"
              }
              options={municipios}
              labelKey="municipio"
              valueKey="id_municipio"
              value={formik.values.municipio_id}
              formik={formik}
              disabled={
                !formik.values.estado_id ||
                loadingMunicipios ||
                municipios.length === 0
              }
            />

            <SelectSearch
              label={FORM_LABELS.SEDE.PNF}
              name="pnf_id"
              options={pnf}
              isMulti={true}
              formik={formik}
              placeholder="SELECCIONE UNA O +OPCIONES"
            />

            {/* Input para direccion de SEDE */}
            <TextAreaLabel
              name="direccion"
              placeholder="SAN JUAN DE LOS MORROS, CALLE 1 CASA 2"
              label={FORM_LABELS.SEDE.ADDRE}
              formik={formik}
              rows={3}
            />
          </>
        }
        buttom={
          <>
            <Buttom
              text="Guardar"
              title="Guardar"
              type="submit"
              style="btn-success"
            />
            <Buttom
              text="Limpiar"
              title="Limpiar"
              type="button"
              style="btn-secondary ms-1"
              onClick={() => formik.resetForm()}
            />
          </>
        }
      />
    </form>
  );
}
