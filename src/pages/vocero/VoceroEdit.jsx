import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import Api, { PutAll } from "../../services/Api";
import { useFormik } from "formik";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import SelectSearch from "../../components/SelectSearch";
import { Buttom } from "../../components/Buttom";


// Validaciones para cada campo
const validationSchema = Yup.object({
  seccion_id: Yup.string().required("Este campo es obligatorio"),
  persona_id: Yup.string().required("Este campo es obligatorio"),
});

function VoceroEdit() {
  const { id } = useParams();
  const [vocero, setVocero] = useState();
  const navegation = useNavigate();
  const [dataSelect, setDataSelect] = useState([]);

  // Función para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PutAll(values, "/vocero", navegation, id, '/voceros');
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
      seccion_id: vocero?.seccion_id || "",
      persona_id: vocero?.persona_id || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo vocero
    const getVocero = async () => {
      const response = await Api.get(`/vocero/${id}`);
      setVocero(response.data);
    };

    getVocero();
  }, [id]);
  
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
                options={dataSelect.vocerosEdit || []}
                formik={formik}
                disabled={true}
              />

              <SelectSearch
                label={FORM_LABELS.VOCERO.SECCION}
                name="seccion_id"
                options={dataSelect.secciones || []}
                formik={formik}
                valueKey="id"
                labelKey="nombre"
              />
            </>
          }
          buttom={
            <>
              <Buttom
                text="Editar"
                title="Editar"
                type="submit"
                style="btn btn-success"
              />

              <Buttom
                text={"Limpiar"}
                title={"Limpiar"}
                type={"reset"}
                style={"btn btn-secondary ms-1"}
                onClick={() => formik.resetForm()}
              />
            </>
          }
        />
      </form>
    </>
  );
}

export default VoceroEdit;
