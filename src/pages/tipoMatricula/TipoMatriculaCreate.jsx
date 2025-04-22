import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
// Inicializando los campos
const initialValues = {
  name_tipo_matricula: "",
  tipo_matricula: "",
};
// Validando los campos
const validationSchema = Yup.object({
  name_tipo_matricula: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  tipo_matricula: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") //Solo letras
    .required("Este campo es obligatorio"), // Campo obligatorio
});

export function TipoMatriculaCreate() {
  // Funcion para enviar datos al backend
  const onSubmit = (values) => {
    console.log(values);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="NUEVO TIPO DE MATRICULA"
        link={
          <Create
            path="/tipo_matricula"
            text="Volver"
            style="btn btn-secondary mb-4"
          />
        }
        input={
          <>
            {/* Input para nombre del TIPO DE MATRICULA  */}
            <InputLabel
              label={FORM_LABELS.TIPO_MATRICULA.NAME}
              type="text"
              name="name_tipo_matricula"
              placeholder="INGRESE UN NOMBRE"
              onBlur={formik.handleBlur}
              value={formik.values.codigo}
              formik={formik}
            />
            {/* Input para el TIPO DE MATRICULA */}
            <InputLabel
              label={FORM_LABELS.TIPO_MATRICULA.TYPE}
              type="text"
              name="tipo_matricula"
              placeholder="TIPO"
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
              type="reset"
              style="btn-danger ms-1"
            />
          </>
        }
      />
    </form>
  );
}
