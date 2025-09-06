import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { PostAll, GetAll } from "../../services/Api";
import SelectSearch from "../../components/SelectSearch";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const initialValues = {
  pnf_id: "",
  matricula_id: "",
  trayecto_id: "",
  sede_id: "",
};

const validationSchema = Yup.object({
  matricula_id: Yup.number().required("Este campo es obligatorio"),
  pnf_id: Yup.number().required("Este campo es obligatorio"),
  trayecto_id: Yup.number().required("Este campo es obligatorio"),
  sede_id: Yup.number().required("Este campo es obligatorio"),
});

export function SeccionesCreate() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const navegation = useNavigate();
  const { lapsoActual } = useAuth();

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/secciones", navegation, lapsoActual.id);
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
    GetAll(setData, setLoading, "/seccion/getDataSelect");
  }, []);
  console.log(loading);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="NUEVA SECCIÓN"
        link={
          <Create
            path="/secciones"
            text="Volver"
            style="btn btn-secondary mb-4"
          />
        }
        input={
          <>
            <SelectSearch
              name="pnf_id"
              label={FORM_LABELS.SECCION.PNF}
              options={data.pnfs || []}
              formik={formik}
              valueKey="id"
            />

            <SelectSearch
              name="matricula_id"
              label={FORM_LABELS.SECCION.TIPO_MATRICULA}
              options={data.tipo_matricula || []}
              formik={formik}
              valueKey="id"
            />

            <SelectSearch
              name="trayecto_id"
              label={FORM_LABELS.SECCION.TRAYECTO}
              options={data.trayectos || []}
              formik={formik}
              valueKey="id"
            />

            <SelectSearch
              name="sede_id"
              label={FORM_LABELS.SECCION.SEDE}
              options={data.sedes}
              formik={formik}
              labelKey="nombre_sede"
              valueKey="id"
            />
          </>
        }
        // Botones para enviar y cancelar
        buttom={
          <>
            <Buttom
              text="Guardar"
              title="Guardar"
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
