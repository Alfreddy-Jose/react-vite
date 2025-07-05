import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { PostAll } from "../../services/Api";
import { useNavigate } from "react-router-dom";

const initialValues = {
  codigo: "",
  nombre: "",
  abreviado: "",
  abreviado_coord: "",
};
// Validando campos
const validationSchema = Yup.object({
  nombre: Yup.string().required("Este campo es obligatorio"),
  codigo: Yup.string()
    .required("Este campo es obligatorio") // Campo requerido
    .matches(/^[0-9]*$/, "Solo números permitidos"), // Solo números
  abreviado: Yup.string()
    .min(4, "Minimo 4 carácteres") // Minimo 4 carácteres
    .required("Este campo es obligatorio"), // Campo requerido
  abreviado_coord: Yup.string()
    .min(3, "Minimo 3 carácteres") // Minimo 3 carácteres
    .required("Este campo es obligatorio"), // Campo requerido
});

export function PnfCreate() {
  const navegation = useNavigate();

  // Funcion para enviar datos al backend

  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/pnf", navegation);
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
        title="NUEVO PNF"
        link={
          <Create path="/pnf" text="Volver" style="btn btn-secondary mb-4" />
        }
        input={
          <>
            {/* Input para codigo de PNF */}
            <InputLabel
              label={FORM_LABELS.PNF.CODIGO}
              type="text"
              name="codigo"
              placeholder="INGRESE CÓDIGO"
              formik={formik}
            />
            {/* Input para nombre de PNF */}
            <InputLabel
              label={FORM_LABELS.USER.NAME}
              type="text"
              name="nombre"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
            />
            {/* Input para PNF abreviado */}
            <InputLabel
              label={FORM_LABELS.PNF.ABREVIADO}
              type="text"
              name="abreviado"
              placeholder="INGRESE ABREVIADO"
              formik={formik}
            />
            {/* Input para PNF abreviado coodinacion */}
            <InputLabel
              label={FORM_LABELS.PNF.COORDINACION}
              type="text"
              name="abreviado_coord"
              placeholder="INGRESE ABREVIADO DE COORDINACIÓN"
              formik={formik}
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
