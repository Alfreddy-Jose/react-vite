import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { FORM_LABELS } from "../../constants/formLabels";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Create } from "../../components/Link";
import Api, { PutAll } from "../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Validando campos
const validationSchema = Yup.object({
  nro_sede: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[0-9]*$/, "Solo números permitidos"), // Solo Permitir Números
  nombre_sede: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), // Permite Solo Letras
  nombre_abreviado: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"),
  direccion: Yup.string().required("Este campo es obligatorio"),
  municipio: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"),
});

export function SedeEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [sede, setSede] = useState();

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PutAll(values, "/sede", navegation, id, "/sede");
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
    // Cargando los datos en los campos
    initialValues: {
      nro_sede: sede?.nro_sede || "",
      nombre_sede: sede?.nombre_sede || "",
      nombre_abreviado: sede?.nombre_abreviado || "",
      direccion: sede?.direccion || "",
      municipio: sede?.municipio || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getSede = async () => {
      const response = await Api.get(`sede/${id}`);
      setSede(response.data);
    };

    getSede();
  }, [id]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <>
        <ContainerIput
          title="EDITAR SEDE"
          link={
            <Create path="/sede" text="Volver" style="btn btn-secondary mb-4" />
          }
          input={
            <>
              {/* Input para numero de SEDE */}
              <InputLabel
                label={FORM_LABELS.SEDE.SEDE_NUMBER}
                type="text"
                name="nro_sede"
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
                name="municipio"
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
                text="Editar"
                title="Editar"
                type="submit"
                style="btn-success"
              />

              <Buttom
                text="Cancelar"
                title="Cancelar"
                type="button"
                style="btn-danger ms-1"
                onClick={() => formik.resetForm()}
              />
            </>
          }
        />
      </>
    </form>
  );
}
