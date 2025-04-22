import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { FORM_LABELS } from "../../constants/formLabels";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Create } from "../../components/Link";

const initialValues = {
  numero_sede: "",
  nombre_sede: "",
  nombre_abreviado: "",
  direccion: "",
  municipio_sede: "",
};
// Validando campos
const validationSchema = Yup.object({
  numero_sede: Yup.string().required("Este campo es obligatorio").matches(/^[0-9]*$/, 'Solo números permitidos'),
  nombre_sede: Yup.string().required("Este campo es obligatorio"),
  nombre_abreviado: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .required("Este campo es obligatorio"),
  direccion: Yup.string().required("Este campo es obligatorio"),
  municipio_sede: Yup.string().required("Este campo es obligatorio"),
});

export function SedeCreate() {
  // Funcion para enviar datos al backend
  const onSubmit = (values) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  console.log(formik.errors);

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
                label={FORM_LABELS.PNF.SEDE_NUMBER}
                type="text"
                name="numero_sede"
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
                name="municipio_sede"
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
              />
            </>
          }
        />
      </>
    </form>
  );
}
