import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { FORM_LABELS } from "../../constants/formLabels";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Create } from "../../components/Link";
import Api, { PutAll } from "../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import SelectSearch from "../../components/SelectSearch";
import { TextAreaLabel } from "../../components/TextAreaLabel";

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
});

export function SedeEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [sede, setSede] = useState(null);
  const [loading, setLoading] = useState(true);
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  // Función para cargar municipios basados en el estado seleccionado
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

  // Función para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PutAll(values, "/sede", navegation, id, "/sede");
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
    enableReinitialize: true,
    initialValues: {
      nro_sede: sede?.nro_sede || "",
      nombre_sede: sede?.nombre_sede || "",
      nombre_abreviado: sede?.nombre_abreviado || "",
      direccion: sede?.direccion || "",
      estado_id: sede?.municipio.estado.id_estado || "",
      municipio_id: sede?.municipio.id_municipio || "",
      universidad_id: sede?.universidad_id || ""
    },
    validationSchema, 
    onSubmit,
  });

  // Efecto para cargar estados al montar el componente
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

  // Efecto para cargar los datos de la sede
  useEffect(() => {
    const getSede = async () => {
      try {
        const response = await Api.get(`/sede/${id}`);
        setSede(response.data);
        
        // Si la sede tiene estado_id, cargar sus municipios
        if (response.data.estado_id) {
          cargarMunicipios(response.data.estado_id);
        }
      } catch (error) {
        console.error("Error fetching sede data:", error);
        setSede(null);
      } finally {
        setLoading(false);
      }
    };

    getSede();
  }, [id]);

  // Efecto para cargar municipios cuando cambia el estado seleccionado
  useEffect(() => {
    if (formik.values.estado_id) {
      cargarMunicipios(formik.values.estado_id);
    } else {
      setMunicipios([]);
      formik.setFieldValue("municipio_id", "");
    }
  }, [formik.values.estado_id]);

  // Mostrar Spinner mientras se cargan los datos
  if (loading) {
    return <Spinner />;
  }

  if (!sede) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-center p-4">
        <h2 className="h4 text-dark mb-3">¡Sede no encontrada!</h2>
        <p className="text-muted mb-4">
          La sede que intentas editar no existe o no se pudo cargar.
        </p>
        <Create 
          path="/sede" 
          text="Volver a la lista" 
          style="btn btn-primary" 
        />
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="EDITAR SEDE"
        link={
          <Create path="/sede" text="Volver" style="btn btn-secondary mb-4" />
        }
        input={
          <>
            {/* Input oculto para universidad_id */}
            <InputLabel
              hidden={true}
              name="universidad_id"
              formik={formik}
            />

            {/* Input para numero de SEDE */}
            <InputLabel
              label={FORM_LABELS.SEDE.SEDE_NUMBER}
              type="text"
              name="nro_sede"
              placeholder="NÚMERO DE SEDE"
              onBlur={formik.handleBlur}
              formik={formik}
            />

            {/* Input para nombre de SEDE */}
            <InputLabel
              label={FORM_LABELS.USER.NAME}
              type="text"
              name="nombre_sede"
              placeholder="INGRESE UN NOMBRE"
              onBlur={formik.handleBlur}
              formik={formik}
            />

            {/* Input para nombre abreviado de SEDE */}
            <InputLabel
              label={FORM_LABELS.PNF.NAME_ABRE}
              type="text"
              name="nombre_abreviado"
              placeholder="NOMBRE ABREVIADO"
              onBlur={formik.handleBlur}
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
              disabled={!formik.values.estado_id || loadingMunicipios || municipios.length === 0}
            />

            {/* Input para dirección de SEDE */}
            <TextAreaLabel
              name="direccion"
              placeholder="SAN JUAN DE LOS MORROS, CALLE 1 CASA 2"
              label={FORM_LABELS.SEDE.ADDRE}
              onBlur={formik.handleBlur}
              formik={formik}
              rows={3}
            />
          </>
        }
        buttom={
          <>
            <Buttom
              text="Editar"
              title="Editar"
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