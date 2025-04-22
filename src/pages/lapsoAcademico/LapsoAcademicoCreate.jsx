import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";

const initialValues = {
  name_lapso: "",
  year_lapso: "",
  type_lapso: "",
};

const validationSchema = Yup.object({
  name_lapso: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Solo números
    .required("Este campo es obligatorio"), // Campo obligatorio
  year_lapso: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Validación mientras escribe
    .test("longitud", "Debe tener 4 dígitos", (val) => !val || val.length === 4) // Solo valida cuando tiene 4
    .test("no-futuro", "No puede ser un año futuro", (value) => {
      if (!value || value.length < 4) return true; // No valida futuro hasta tener año completo
      const añoActual = new Date().getFullYear();
      return parseInt(value) <= añoActual;
    })
    .required("Este campo es obligatorio"),
  type_lapso: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .required("Este campo es obligatorio"),
});

export function LapsoAcademicoCreate() {
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
        title="NUEVO LAPSO ACADEMICO"
        link={
          <Create
            path="/lapso_academico"
            text="Volver"
            style="btn btn-secondary mb-4"
          />
        }
        input={
          <>
            {/* Input para nombre de LAPSO */}
            <InputLabel
              label={FORM_LABELS.LAPSO_ACADEMICO.NAME}
              type="text"
              name="name_lapso"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
            />
            {/* Input para año del LAPSO */}
            <InputLabel
              label={FORM_LABELS.LAPSO_ACADEMICO.YEAR}
              type="text"
              name="year_lapso"
              placeholder="INGRESE AÑO"
              formik={formik}
            />
            {/* Input para PNF abreviado */}
            <InputLabel
              label={FORM_LABELS.LAPSO_ACADEMICO.TYPE}
              type="text"
              name="type_lapso"
              placeholder="TIPO LAPSO"
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
