import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { FORM_LABELS } from "../../constants/formLabels";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Create } from "../../components/Link";
import { PostAll } from "../../services/Api";
import { useNavigate } from "react-router-dom";

const initialValues = {
  nro_sede: "",
  nombre_sede: "",
  nombre_abreviado: "",
  direccion: "",
  municipio: "",
};
// Validando campos
const validationSchema = Yup.object({
  nro_sede: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[0-9]*$/, "Solo números permitidos"), // Solo Permitir Números
  nombre_sede: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), // Permite Solo Letras
  nombre_abreviado: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"),
  direccion: Yup.string().required("Este campo es obligatorio"),
  municipio: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"),
});

export function SedeCreate() {
  const navegation = useNavigate();

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/sede", navegation);
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
      <>
        <ContainerIput
          title="NUEVA SEDE"
          link={
            <Create path="/sede" text="Volver" style="btn btn-secondary mb-4" />
          }
          input={
            <>
              {/* Input para numero de SEDE */}
              <InputLabel
                label={FORM_LABELS.SEDE.SEDE_NUMBER}
                type="text"
                name="nro_sede"
                placeholder="NÚMERO DE SEDE"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
              />
              {/* Input para nombre de SEDE */}
              <InputLabel
                label={FORM_LABELS.USER.NAME}
                type="text"
                name="nombre_sede"
                placeholder="INGRESE UN NOMBRE"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
              />
              {/* Input para nombre abreviado de SEDE */}
              <InputLabel
                label={FORM_LABELS.PNF.NAME_ABRE}
                type="text"
                name="nombre_abreviado"
                placeholder="NOMBRE ABREVIADO"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
              />
              {/* Input para dirección de SEDE */}
              <InputLabel
                label={FORM_LABELS.SEDE.ADDRE}
                type="text"
                name="direccion"
                placeholder="DIRECCIÓN"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
              />
              {/* Input para dirección de SEDE */}
              <InputLabel
                label={FORM_LABELS.SEDE.MUNICIPIO}
                type="text"
                name="municipio"
                placeholder="MUNICIPIO"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
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
                text="Cancelar"
                title="Cancelar"
                type="reset"
                style="btn-danger ms-1"
                onClick={() => formik.resetForm()}
              />
            </>
          }
        />
      </>
    </form>
  );
}
