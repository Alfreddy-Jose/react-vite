import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import Api, { PutAll } from "../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import SelectSearch from "../../components/SelectSearch";

// Validaciones para cada campo
const validationSchema = Yup.object({
  nombre_aula: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  equipos: Yup.string()
    .matches(/^[0-:-9]*$/, "Formato incorrecto") // Solo números
    .required("Este campo es obligatorio"), // Campo obligatorio
  etapa: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // solo letras
    .max(1, "Maximo 1 carácteres") // Máximo 1 carácter
    .required("Este campo es obligatorio"), // Campo obligatorio
  abreviado_lab: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  sede_id: Yup.number().required("Este campo es obligatorio"),
});

export default function LaboratorioEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [laboratorio, setLaboratorio] = useState();
  const [sedes, setSedes] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PutAll(values, "/laboratorio", navegation, id, "/laboratorio");
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
      nombre_aula: laboratorio?.nombre_aula || "",
      etapa: laboratorio?.etapa || "",
      equipos: laboratorio?.equipos || "",
      abreviado_lab: laboratorio?.abreviado_lab || "",
      sede_id: laboratorio?.sede_id || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getLaboratorio = async () => {
      const response = await Api.get(`laboratorio/${id}`);
      setLaboratorio(response.data);
    };

    getLaboratorio();

    const getSedes = async () => {
      const response = await Api.get(`/espacio/getSedes`);
      setSedes(response.data);
    };
    getSedes();
  }, [id]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="EDITAR LABORATORIO"
          link={
            <Create
              path="/laboratorio"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
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
              {/* Input para etapa */}
              <InputLabel
                label={FORM_LABELS.AULA.ETAPA}
                type="text"
                name="etapa"
                placeholder="ETAPA"
                formik={formik}
              />
              {/* Input para nombre de laboratorio */}
              <InputLabel
                label={FORM_LABELS.LABORATORIO.NAME}
                type="text"
                name="nombre_aula"
                placeholder="NOMBRE"
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
