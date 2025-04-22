import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";

const initialValues = {
  turno: "",
  inicio: "",
  final: "",
};

// Validando campos
const validationSchema = Yup.object({
  turno: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // Solo letras
    .required("Este campo es obligatorio"), // Campo obligatorio
  inicio: Yup.string()
    .matches(/^[0-:-9]*$/, "Formato de hora incorreto") // Formato de hora
    .required("Este campo es obligatorio"), // Campo obligatorio
  final: Yup.string()
    .matches(/^[0-:-9]*$/, "Formato de hora incorreto") // Formato de hora
    .required("Este campo es obligatorio"), // Campo obligatorio
});

export function BloquesCreate() {
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
    //Formulario
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="NUEVO BLOQUE DE HORAS"
        link={
          <Create
            path="/bloques"
            text="Volver"
            style="btn btn-secondary mb-4"
          />
        }
        input={
          <>
            {/* Input para el turno del bloque de horas  */}
            <InputLabel
              label={FORM_LABELS.BLOQUES_HORAS.TURNO}
              type="text"
              name="turno"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
            />
            {/* Input para el inicio del bloque de horas */}
            <InputLabel
              label={FORM_LABELS.BLOQUES_HORAS.INICIO}
              type="text"
              name="inicio"
              placeholder="INICIO"
              formik={formik}
            />
            {/* Input para el final del bloque de horas */}
            <InputLabel
              label={FORM_LABELS.BLOQUES_HORAS.FINAL}
              type="text"
              name="final"
              placeholder="FINAL"
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
