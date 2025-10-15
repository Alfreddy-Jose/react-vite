import { FORM_LABELS } from "../../constants/formLabels";
import { InputLabel } from "../../components/InputLabel";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Api, { PostAll } from "../../services/Api";
import * as Yup from "yup";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { Buttom } from "../../components/Buttom";
import SelectSearch from "../../components/SelectSearch";
import { TextAreaLabel } from "../../components/TextAreaLabel";
import { useEffect, useState } from "react";

const initialValues = {
  cedula_persona: "",
  nombre: "",
  apellido: "",
  direccion: "",
  municipio: "",
  telefono: "",
  email: "",
  tipo_persona: "",
  municipio_id: "",
  estado_id: "", // Añadido este campo que faltaba
  grado_inst: "",
};
// Validando campos
const validationSchema = Yup.object({
  cedula_persona: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Solo números
    .max(8, "Máximo 8 números")
    .min(7, "Mínimo 7 números")
    .required("Este campo es obligatorio"), // Campo requerido
  nombre: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // solo letras permitidas
    .required("Este campo es obligatorio"), // Campo obligatorio
  apellido: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // solo letras permitidas
    .required("Este campo es obligatorio"), // Campo requerido
  direccion: Yup.string().required("Este campo es obligatorio"), // Campo requerido
  telefono: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Solo números
    .required("Este campo es obligatorio") // Campo requerido
    .min(11, "Mínimo 11 números") // Mínimo 11 números
    .max(11, "Máximo 11 números"), // Máximo 11 números
  email: Yup.string().email("Correo no válido"),
  //.required("Este campo es obligatorio"),
  tipo_persona: Yup.string().required("Este campo es obligatorio"), // Campo requerido
  grado_inst: Yup.string().required("Este campo es obligatorio"), // Campo requerido
  estado_id: Yup.string().required("Este campo es obligatorio"),
  municipio_id: Yup.string().required("Este campo es obligatorio"),
});

function PersonaCreate() {
  const navegation = useNavigate();
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

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/persona", navegation);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Transforma los arrays de Laravel a strings para Formik
        const formikErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          formikErrors[key] = value[0];
        });
        setErrors(error.response.data.errors);
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit,
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

  // Efecto para cargar municipios cuando cambia el estado
  useEffect(() => {
    if (formik.values.estado_id) {
      cargarMunicipios(formik.values.estado_id);
    } else {
      setMunicipios([]);
      formik.setFieldValue("municipio_id", "");
    }
  }, [formik.values.estado_id]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="NUEVA PERSONA"
          link={
            <Create
              path="/persona"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              {/* Input para CEDULA de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.CEDULA}
                type="text"
                name="cedula_persona"
                placeholder="INGRESE CÉDULA"
                formik={formik}
              />
              {/* Input para nombre de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.NAME}
                type="text"
                name="nombre"
                placeholder="INGRESE UN NOMBRE"
                formik={formik}
              />
              {/* Input para apellido de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.LASTNAME}
                type="text"
                name="apellido"
                placeholder="INGRESE UN APELLIDO"
                formik={formik}
              />

              {/* Input para telefono de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.TELEFONO}
                type="text"
                name="telefono"
                placeholder="TELÉFONO"
                formik={formik}
              />
              {/* Input para correo de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.EMAIL}
                type="email"
                name="email"
                placeholder="CORREO"
                formik={formik}
              />
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
              {/* Input para direccion de PERSONA */}
              <TextAreaLabel
                name="direccion"
                label={FORM_LABELS.PERSONAS.ADRRE}
                placeholder="SAN JUAN DE LOS MORROS, CALLE 1 CASA 2"
                formik={formik}
                rows={3}
              />
            </>
          }
          // Botones para enviar y cancelar
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
    </div>
  );
}

export default PersonaCreate;
