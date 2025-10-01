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

const initialValues = {
  seccion_id: "",
  persona_id: "",
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  seccion_id: Yup.string().required("Este campo es obligatorio"),
  persona_id: Yup.string().required("Este campo es obligatorio"),
});

function VoceroCreate() {
  const navegation = useNavigate();
  const [dataSelect, setDataSelect] = useState([]);

  // Función para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/voceros", navegation);
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
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo secciones
    const getData = async () => {
      const response = await Api.get(`/vocero/getDataSelect`);

      setDataSelect(response.data);
    };

    getData();
  }, []);
  
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="NUEVO VOCERO"
          link={
            <Create
              path="/voceros"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              <SelectSearch
                label={FORM_LABELS.VOCERO.VOCERO}
                name="persona_id"
                options={dataSelect.voceros || []}
                formik={formik}
              />

              <SelectSearch
                label={FORM_LABELS.VOCERO.SECCION}
                name="seccion_id"
                options={dataSelect.secciones|| []}
                formik={formik}
                valueKey="id"
                labelKey="nombre"
              />
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

export default VoceroCreate;
