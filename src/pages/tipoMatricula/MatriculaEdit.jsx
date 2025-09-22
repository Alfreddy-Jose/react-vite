import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Api, { PutAll } from "../../services/Api";
import { useEffect, useState } from "react";

// Validando los campos
const validationSchema = Yup.object({
  numero: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[0-9]*$/, "Solo números permitidos"), // Solo números
  nombre: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") //Solo letras
    .required("Este campo es obligatorio"), // Campo obligatorio
});

export function TipoMatriculaEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [matricula, setMatricula] = useState();

  // Funcion para enviar datos al backend

  const onSubmit = async (values, { setErrors }) => {
    try {
      await PutAll(values, "/matricula", navegation, id, "/matricula");
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
      numero: matricula?.numero || "",
      nombre: matricula?.nombre || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getMatricula = async () => {
      const response = await Api.get(`matricula/${id}`);
      setMatricula(response.data);
    };

    getMatricula();
  }, [id]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="EDITAR TIPO DE MATRÍCULA"
        link={
          <Create
            path="/matricula"
            text="Volver"
            style="btn btn-secondary mb-4"
          />
        }
        input={
          <>
            {/* Input para el NUMERO DE MATRICULA  */}
            <InputLabel
              label={FORM_LABELS.TIPO_MATRICULA.NUMBER}
              type="text"
              name="numero"
              placeholder="INGRESE UN NÚMERO"
              onBlur={formik.handleBlur}
              value={formik.values.codigo}
              formik={formik}
            />
            {/* Input para el NOMBRE DE MATRICULA */}
            <InputLabel
              label={FORM_LABELS.TIPO_MATRICULA.NAME}
              type="text"
              name="nombre"
              placeholder="NOMBRE MATRÍCULA"
              formik={formik}
            />
          </>
        }
        // Botones para enviar y cancelar
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
    </form>
  );
}
