import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import Api, { PostAll } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectSearch from "../../components/SelectSearch";

// Iniciando variables
const initialValues = {
  codigo: "",
  etapa: "",
  nro_aula: "",
  sede_id: "",
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  codigo: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  etapa: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // Solo letras
    .max(1, "Maximo 1 carácteres") // Máximo 1 carácter
    .required("Este campo es obligatorio"), // Campo obligatorio
  nro_aula: Yup.string()
    .matches(/^[0-:-9]*$/, "Formato incorrecto") // Solo números
    .required("Este campo es obligatorio"), // Campo obligatorio
  sede_id: Yup.number().required("Este campo es obligatorio"), // Campo obligatorio
});

export default function AulasCreate() {
  const navegation = useNavigate();
  const [sedes, setSedes] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/aula", navegation);
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

  useEffect(() => {
    // Trayendo los datos del registro
    const getSedes = async () => {
      const response = await Api.get(`/espacio/getSedes`);
      setSedes(response.data);
    };
    getSedes();
  }, []);

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
              {/* Select para Sedes */}
              <SelectSearch
                label={FORM_LABELS.AULA.SEDE}
                name="sede_id"
                options={sedes}
                formik={formik}
                valueKey="id"
                labelKey="nombre_sede"
              />
              {/* Input para nombre de aula */}
              <InputLabel
                label={FORM_LABELS.AULA.CODIGO}
                type="text"
                name="codigo"
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
                name="nro_aula"
                placeholder="NÚMERO DE AULA"
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
                type="button"
                style="btn-danger ms-1"
                title="Cancelar"
                text="Cancelar"
                onClick={() => formik.resetForm()}
              />
            </>
          }
        />
      </form>
    </>
  );
}
