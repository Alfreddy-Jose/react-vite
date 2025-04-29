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
  equipos: "",
  nombre_lab: "",
  etapa: "",
  abreviado_lab: "",
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  nombre_lab: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  equipos: Yup.string()
    .matches(/^[0-:-9]*$/, "Formato incorrecto") // Solo números
    .required("Este campo es obligatorio"), // Campo obligatorio
  etapa: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // solo letras
    .max(1, "Maximo 1 carácteres") // Máximo 1 carácter
    .required("Este campo es obligatorio"), // Campo obligatorio
  abreviado_lab: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
});

export default function LaboratorioCreate() {
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
          title="NUEVO LABORATORIO"
          link={
            <Create
              path="/laboratorio"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              {/* Input para el nombre del laboratorio */}
              <InputLabel
                label={FORM_LABELS.LABORATORIO.NAME}
                type="text"
                name="nombre_lab"
                placeholder="INGRESE UN NOMBRE"
                formik={formik}
              />
              {/* Input la etapa del laboratorio */}
              <InputLabel
                label={FORM_LABELS.LABORATORIO.ETAPA}
                type="text"
                name="etapa"
                placeholder="ETAPA"
                formik={formik}
              />
              {/* Input para laboratorio abreviado */}
              <InputLabel
                label={FORM_LABELS.LABORATORIO.ABREVIADO}
                type="text"
                name="abreviado_lab"
                placeholder="ABREVIADO LABORATORIO"
                formik={formik}
              />
              {/* Input para la cantidad de equipos */}
              <InputLabel
                label={FORM_LABELS.LABORATORIO.EQUIPOS}
                type="text"
                name="equipos"
                placeholder="EQUIPOS"
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
