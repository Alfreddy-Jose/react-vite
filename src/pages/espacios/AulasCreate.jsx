import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";

// Iniciando variables
const initialValues = {
  codigo_aula: "",
  nombre_aula: "",
  etapa: "",
  numero_aula: "",
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  nombre_aula: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  codigo_aula: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  etapa: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // Solo letras
    .max(1, "Maximo 1 carácteres") // Máximo 1 carácter
    .required("Este campo es obligatorio"), // Campo obligatorio
  numero_aula: Yup.string()
    .matches(/^[0-:-9]*$/, "Formato incorrecto") // Solo números
    .required("Este campo es obligatorio"), // Campo obligatorio
});

export default function AulasCreate() {
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
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="NUEVA AULA"
          link={
            <Create path="/aula" text="Volver" style="btn btn-secondary mb-4" />
          }
          input={
            <>
              {/* Input para nombre de aula */}
              <InputLabel
                label={FORM_LABELS.AULA.CODIGO}
                type="text"
                name="codigo_aula"
                placeholder="CÓDIGO"
                formik={formik}
              />
              {/* Input para email de usuario */}
              <InputLabel
                label={FORM_LABELS.AULA.ETAPA}
                type="text"
                name="etapa"
                placeholder="ETAPA"
                formik={formik}
              />
              {/* Input para contraseña de usuario */}
              <InputLabel
                label={FORM_LABELS.AULA.NUMBER}
                type="text"
                name="numero_aula"
                placeholder="NÚMERO DE AULA"
                formik={formik}
              />
              {/* Input para confirmar la contraseña de usuario */}
              <InputLabel
                label={FORM_LABELS.AULA.NAME}
                type="text"
                name="nombre_aula"
                placeholder="NOMBRE DE AULA"
                formik={formik}
              />
            </>
          }
          buttom={
            <>
              <Buttom
                type="submit"
                style="btn-success"
                title="Guardar"
                text="Guardar"
              />
              <Buttom
                type="reset"
                style="btn-danger ms-1"
                title="Cancelar"
                text="Cancelar"
              />
            </>
          }
        />
      </form>
    </>
  );
}
