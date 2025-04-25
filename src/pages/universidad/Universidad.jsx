import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";

const initialValues = {
  rif_univ: "",
  nombre_univ: "",
  abreviado_univ: "",
  direccion: "",
};

const validationSchema = Yup.object({
  rif_univ: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  nombre_univ: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") //Solo letras
    .required("Este campo es obligatorio"), // Campo obligatorio
  abreviado_univ: Yup.string()
    .max(8, "Máximo 8 caracteres")
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), //Solo letras
  direccion: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
});

export function Universidad() {
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
        title="NUEVA UNIVERSIDAD"
        input={
          <>
            {/* Input para nombre de LAPSO */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.RIF}
              type="text"
              name="rif_univ"
              placeholder="RIF"
              formik={formik}
            />
            {/* Input para año del LAPSO */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.NAME}
              type="text"
              name="nombre_univ"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
            />
            {/* Input para PNF abreviado */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.NAME_ABRE}
              type="text"
              name="abreviado_univ"
              placeholder="NOMBRE ABREVIADO"
              formik={formik}
            />
            {/* Input para PNF abreviado */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.ADRRE}
              type="text"
              name="direccion"
              placeholder="DIRECCIÓN"
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
