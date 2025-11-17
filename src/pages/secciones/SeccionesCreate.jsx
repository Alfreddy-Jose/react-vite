import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Api, { PostAll, GetAll } from "../../services/Api";
import SelectSearch from "../../components/SelectSearch";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/Spinner";

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
  const [sedes, setSedes] = useState([]);
  const [pnfs, setPnfs] = useState([]);
  const [loadingPnfs, setLoadingPnfs] = useState(false);
  const { lapsoActual } = useAuth();

  // Función para cargar Pnfs
  const cargarPnfs = async (sedeId) => {
    if (!sedeId) {
      setPnfs([]);
      return;
    }

    setLoadingPnfs(true);
    try {
      const response = await Api.get(`/horarios/sedes/${sedeId}/pnfs`);
      setPnfs(response.data);
    } catch (error) {
      console.error("Error al cargar Pnfs:", error);
      setPnfs([]);
    } finally {
      setLoadingPnfs(false);
    }
  };

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

  // Efecto para cargar Sedes
  useEffect(() => {
    const getSedes = async () => {
      try {
        const response = await Api.get(`/horarios/sedes`);
        setSedes(response.data);
      } catch (error) {
        console.error("Error al cargar Estados:", error);
        setSedes([]);
      }
    };

    getSedes();
  }, []);

  // Efecto para cargar Pnfs cuando cambia el sede
  useEffect(() => {
    if (formik.values.sede_id) {
      cargarPnfs(formik.values.sede_id);
    } else {
      setPnfs([]);
      formik.setFieldValue("pnf_id", "");
    }
  }, [formik.values.sede_id]);

  if (loading) {
    return <Spinner />;
  }

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
              name="sede_id"
              label={FORM_LABELS.SECCION.SEDE}
              options={sedes}
              formik={formik}
              labelKey="nombre_sede"
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

            {/*             <SelectSearch
              name="pnf_id"
              label={FORM_LABELS.SECCION.PNF}
              options={data.pnfs || []}
              formik={formik}
              valueKey="id"
            /> */}

            <SelectSearch
              label={FORM_LABELS.SECCION.PNF}
              name="pnf_id"
              placeholder={
                !formik.values.sede_id
                  ? "PRIMERO SELECCIONE UN PNF"
                  : loadingPnfs
                  ? "CARGANDO PNF..."
                  : pnfs.length === 0
                  ? "NO HAY PNF"
                  : "SELECCIONE UN PNF"
              }
              options={pnfs}
              valueKey="id"
              value={formik.values.pnf_id}
              formik={formik}
              disabled={!formik.values.sede_id || loadingPnfs || pnfs.length === 0}
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
  );
}
