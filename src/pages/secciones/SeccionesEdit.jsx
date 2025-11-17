import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Api, { GetAll, PutAll } from "../../services/Api";
import SelectSearch from "../../components/SelectSearch";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";

const validationSchema = Yup.object({
  matricula_id: Yup.number().required("Este campo es obligatorio"),
  pnf_id: Yup.number().required("Este campo es obligatorio"),
  trayecto_id: Yup.number().required("Este campo es obligatorio"),
  sede_id: Yup.number().required("Este campo es obligatorio"),
  numero_seccion: Yup.number().required("Este campo es obligatorio"),
  //lapso_id: Yup.number().required("Este campo es obligatorio"),
});

export function SeccionesEdit() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [seccion, setSeccion] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [pnfs, setPnfs] = useState([]);
  const [loadingPnfs, setLoadingPnfs] = useState(false);
  const navegation = useNavigate();

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
      await PutAll(values, "/seccion", navegation, id, "/secciones");
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
      sede_id: seccion?.sede_id || "",
      pnf_id: seccion?.pnf_id || "",
      matricula_id: seccion?.matricula_id || "",
      trayecto_id: seccion?.trayecto_id || "",
      numero_seccion: seccion?.numero_seccion || "",
      //lapso_id: seccion?.lapso_id || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    GetAll(setData, setLoading, "/seccion/getDataSelect");

    // Trayendo los datos del registro
    const getSeccion = async () => {
      const response = await Api.get(`/seccion/${id}`);

      // Si la sección tiene sede_id, cargar sus pnfs
        if (response.data.sede_id) {
          cargarPnfs(response.data.sede_id);
        }
      setSeccion(response.data);
    };
    getSeccion();
  }, [id]);  

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
        title="EDITAR SECCIÓN"
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

            <InputLabel
              name="numero_seccion"
              label={FORM_LABELS.SECCION.NRO_SECCION}
              formik={formik}
              type="text"
              hidden={true}
              placeholder="INGRESE NÚMERO DE SECCIÓN"
            />

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
              disabled={
                !formik.values.sede_id || loadingPnfs || pnfs.length === 0
              }
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
