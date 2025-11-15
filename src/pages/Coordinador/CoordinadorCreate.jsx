import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Api, { PostAll } from "../../services/Api";
import { useFormik } from "formik";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import SelectSearch from "../../components/SelectSearch";
import { Buttom } from "../../components/Buttom";
import { AlertaError } from "../../components/Alert";

const initialValues = {
  docente_id: "",
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  docente_id: Yup.string().required("Este campo es obligatorio"),
});

function CoordinadorCreate() {
  const navegation = useNavigate();
  const [docentes, setDocentes] = useState([]);

  // Función para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/coordinador", navegation);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Transforma los arrays de Laravel a strings para Formik
        const formikErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          formikErrors[key] = value[0];
        });
        setErrors(error.response.data.errors);
      }
      // Mostrar mensaje de error general si existe
      if (error.response && error.response.data.message) {
        AlertaError(error.response.data.message);
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo Docentes para el select
    const getData = async () => {
      const response = await Api.get(`/coordinador/getDocentes/${0}`);

      setDocentes(response.data);
    };

    getData();
  }, []);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="NUEVO COORDINADOR"
          link={
            <Create
              path="/coordinador"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              <SelectSearch
                label={FORM_LABELS.COORDINADOR.COORDINADOR}
                name="docente_id"
                options={docentes.docentes || []}
                formik={formik}
                valueKey="id"
                labelKey="nombre"
              />

              {/*               <SelectSearch
                label={FORM_LABELS.VOCERO.SECCION}
                name="seccion_id"
                options={dataSelect.secciones || []}
                formik={formik}
                valueKey="id"
                labelKey="nombre"
              /> */}
            </>
          }
          buttom={
            <>
              <Buttom
                text="Guardar"
                title="Guardar"
                type="submit"
                style="btn btn-success"
              />

              <Buttom
                text={"Limpiar"}
                title={"Limpiar"}
                type={"reset"}
                onClick={() => formik.resetForm()}
                style={"btn btn-secondary ms-1"}
              />
            </>
          }
        />
      </form>
    </>
  );
}

export default CoordinadorCreate;
