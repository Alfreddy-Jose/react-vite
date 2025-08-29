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

const initialValues = {
  cedula_persona: "",
  nombre: "",
  apellido: "",
  direccion: "",
  municipio: "",
  telefono: "",
  email: "",
  tipo_persona: "",
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
  municipio: Yup.string().required("Este campo es obligatorio"), // Campo requerido
  telefono: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Solo números
    .required("Este campo es obligatorio") // Campo requerido
    .min(11, "Mínimo 11 números") // Mínimo 11 números
    .max(11, "Máximo 11 números"), // Máximo 11 números
  email: Yup.string().email("Correo no válido"),
  //.required("Este campo es obligatorio"),
  tipo_persona: Yup.string().required("Este campo es obligatorio"), // Campo requerido
  grado_inst: Yup.string()
    .required("Este campo es obligatorio") // Campo requerido
});

function PersonaCreate() {
  const navegation = useNavigate();

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
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
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
              placeholder="INGRESE CEDULA"
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
            {/* Input para direccion de PERSONA */}
            <InputLabel
              label={FORM_LABELS.PERSONAS.ADRRE}
              type="text"
              name="direccion"
              placeholder="DIRECCIÓN"
              formik={formik}
            />
            {/* Input para municipio de PERSONA */}
            <InputLabel
              label={FORM_LABELS.PERSONAS.MUNICIPIO}
              type="text"
              name="municipio"
              placeholder="MUNICIPIO"
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
              text="Cancelar"
              title="Cancelar"
              type="button"
              style="btn-danger ms-1"
              onClick={() => formik.resetForm()}
            />
          </>
        }
      />
    </form>
  );
}

export default PersonaCreate;
