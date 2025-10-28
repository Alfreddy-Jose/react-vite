import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import Api, { PutAll } from "../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import SelectSearch from "../../components/SelectSearch";

// Validaciones para cada campo
const validationSchema = Yup.object({
  //codigo: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  etapa: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // Solo letras
    .max(1, "Maximo 1 carácteres") // Máximo 1 carácter
    .required("Este campo es obligatorio"), // Campo obligatorio
  nro_aula: Yup.string()
    .matches(/^[0-:-9]*$/, "Formato incorrecto") // Solo números
    .required("Este campo es obligatorio"), // Campo obligatorio
  sede_id: Yup.number().required("Este campo es obligatorio"),
  nombre_aula: Yup.string().required("Este campo es obligatorio"),
});

export default function AulasEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [aula, setAula] = useState();
  const [sedes, setSedes] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PutAll(values, "/aula", navegation, id, "/aula");
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
    enableReinitialize: true,
    initialValues: {
      etapa: aula?.etapa || "",
      nro_aula: aula?.nro_aula || "",
      sede_id: aula?.sede_id || "",
      nombre_aula: aula?.nombre_aula || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getAula = async () => {
      const response = await Api.get(`aula/${id}`);
      setAula(response.data);
    };

    getAula();

    const getSedes = async () => {
      const response = await Api.get(`/espacio/getSedes`);
      setSedes(response.data);
    };
    getSedes();
  }, [id]);

  // Funcion para generar el nombre del Aula
  const nombreAula = useMemo(() => {
    return `${formik.values.etapa}-${formik.values.nro_aula}`;
  }, [formik.values.etapa, formik.values.nro_aula]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="EDITAR AULA"
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
              {/* Input para nombre de aula */}
              <InputLabel
                label={FORM_LABELS.AULA.NAME}
                type="text"
                name="nombre_aula"
                placeholder="NOMBRE"
                formik={formik}
                value={nombreAula}
                disabled={true}
              />
            </>
          }
          buttom={
            <>
              <Buttom
                type="submit"
                style="btn-success"
                title="Editar"
                text="Editar"
              />

              <Buttom
                text="Limpiar"
                title="Limpiar"
                type="button"
                style="btn-secondary ms-1"
                onClick={() => formik.resetForm()}
              />
            </>
          }
        />
      </form>
    </>
  );
}
