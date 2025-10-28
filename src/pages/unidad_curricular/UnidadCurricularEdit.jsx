import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import Api, { PutAll } from "../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectSearch from "../../components/SelectSearch";
import Spinner from "../../components/Spinner";
import { TextAreaLabel } from "../../components/TextAreaLabel";
import { useMemo } from "react";

// Iniciando variables
const initialValues = {
  nombre: "",
  descripcion: "",
  unidad_credito: "",
  hora_teorica: "",
  hora_practica: "",
  periodo: "",
  trayecto_id: "",
  trimestre_id: "",
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"),
  unidad_credito: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[0-:-9]*$/, "Solo números"),
  hora_teorica: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[0-:-9]*$/, "Solo números"),
  hora_practica: Yup.string()
    .nullable()
    .matches(/^[0-:-9]*$/, "Solo números"),
  periodo: Yup.string().required("Este campo es obligatorio"),
  trayecto_id: Yup.string().required("Este campo es obligatorio"),
  descripcion: Yup.string().max(255, "Máximo 255 caracteres"),
  trimestre_id: Yup.mixed().test("trimestre-validation", function (value) {
    const { periodo } = this.parent;

    if (!periodo) return true;

    if (periodo === "1") {
      if (value === null || value === undefined || value === "") {
        return this.createError({
          message: "Este campo es obligatorio",
        });
      }
      return true;
    } else if (periodo === "2" || periodo === "3") {
      if (!Array.isArray(value) || value.length === 0) {
        return this.createError({
          message: "Este campo es obligatorio",
        });
      }

      if (periodo === "2" && value.length !== 2) {
        return this.createError({
          message:
            "Debe seleccionar exactamente 2 trimestres para período semestral",
        });
      }

      return true;
    }

    return true;
  }),
});

function UnidadCurricularEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [trimestres, setTrimestres] = useState([]);
  const [trayectos, setTrayectos] = useState([]);
  const [loadingTrimestres, setLoadingTrimestres] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialTrayectoId, setInitialTrayectoId] = useState("");
  const [initialData, setInitialData] = useState(initialValues);
  const [initialTrimestres, setInitialTrimestres] = useState([]);

  // Función para cargar los datos de la unidad curricular
  const cargarUnidadCurricular = async () => {
    try {
      setLoading(true);
      const response = await Api.get(`/unidad_curricular/${id}`);
      const unidadCurricular = response.data;

      // Determinar el trayecto basado en los trimestres
      let trayectoId = "";
      if (
        unidadCurricular.trimestres &&
        unidadCurricular.trimestres.length > 0
      ) {
        // Tomar el trayecto_id del primer trimestre (todos deberían ser del mismo trayecto)
        trayectoId = unidadCurricular.trimestres[0].trayecto_id;
        setInitialTrayectoId(trayectoId);
      }

      // Preparar el valor de trimestre_id según el periodo
      let trimestreIdValue;
      if (unidadCurricular.periodo === "1") {
        // TRIMESTRAL - tomar el primer trimestre (debería haber solo uno)
        trimestreIdValue = unidadCurricular.trimestres[0]?.id || "";
      } else {
        // SEMESTRAL o ANUAL - array de IDs de trimestres
        trimestreIdValue = unidadCurricular.trimestres.map((t) => t.id);
      }

      // Cargar los trimestres del trayecto original
      let trimestresOriginales = [];
      if (trayectoId) {
        const responseTrimestres = await Api.get(
          `/horarios/trayectos/${trayectoId}/trimestres`
        );
        trimestresOriginales = responseTrimestres.data;
        setTrimestres(trimestresOriginales);
        setInitialTrimestres(trimestresOriginales); // Guardar trimestres originales
      }

      // Crear objeto con los valores iniciales
      const initialValuesData = {
        nombre: unidadCurricular.nombre || "",
        descripcion: unidadCurricular.descripcion || "",
        unidad_credito: unidadCurricular.unidad_credito || "",
        hora_teorica: unidadCurricular.hora_teorica || "",
        hora_practica: unidadCurricular.hora_practica || "",
        periodo: unidadCurricular.periodo || "",
        trayecto_id: trayectoId,
        hora_total_est: unidadCurricular.hora_total_est || "",
        trimestre_id: trimestreIdValue,
      };

      // Guardar en estado y en formik
      setInitialData(initialValuesData);
      formik.setValues(initialValuesData);

      // Cargar trimestres del trayecto
      if (trayectoId) {
        await cargarTrimestres(trayectoId);
      }
    } catch (error) {
      console.error("Error al cargar la unidad curricular:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar trimestres basados en el trayecto seleccionado
  const cargarTrimestres = async (trayectoId) => {
    if (!trayectoId) {
      setTrimestres([]);
      return;
    }

    setLoadingTrimestres(true);
    try {
      const response = await Api.get(
        `/horarios/trayectos/${trayectoId}/trimestres`
      );
      setTrimestres(response.data);
    } catch (error) {
      console.error("Error al cargar trimestres:", error);
      setTrimestres([]);
    } finally {
      setLoadingTrimestres(false);
    }
  };

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {

    try {
      await PutAll(
        values,
        `/unidad_curricular`,
        navegation,
        id,
        "/unidad_curricular"
      );
    } catch (error) {
      if (error.response && error.response.data.errors) {
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

  // Efecto para cargar trayectos al montar el componente
  useEffect(() => {
    const getTrayectos = async () => {
      try {
        const response = await Api.get(`/horarios/trayectos`);
        setTrayectos(response.data);
      } catch (error) {
        console.error("Error al cargar trayectos:", error);
      }
    };

    getTrayectos();
  }, []);

  // Efecto para cargar la unidad curricular al montar el componente
  useEffect(() => {
    if (id) {
      cargarUnidadCurricular();
    }
  }, [id]);

  // Efecto para cargar trimestres cuando cambia el trayecto seleccionado
  useEffect(() => {
    if (
      formik.values.trayecto_id &&
      formik.values.trayecto_id !== initialTrayectoId
    ) {
      cargarTrimestres(formik.values.trayecto_id);
      // Limpiar la selección de trimestres al cambiar de trayecto
      formik.setFieldValue(
        "trimestre_id",
        formik.values.periodo === "1" ? "" : []
      );
    }
  }, [formik.values.trayecto_id]);

  // Determinar el modo de selección de trimestres según el periodo
  const periodoSeleccionado = formik.values.periodo;
  const isTrimestreMulti =
    periodoSeleccionado === "2" || periodoSeleccionado === "3";
  const isTrimestreDisabled = periodoSeleccionado === "3";

  // Efecto para seleccionar automáticamente los trimestres en modo ANUAL
  useEffect(() => {
    if (periodoSeleccionado === "3" && trimestres.length > 0) {
      formik.setFieldValue(
        "trimestre_id",
        trimestres.map((t) => t.id)
      );
    } else if (periodoSeleccionado === "2" && trimestres.length > 0) {
      if (
        Array.isArray(formik.values.trimestre_id) &&
        formik.values.trimestre_id.length > 2
      ) {
        formik.setFieldValue("trimestre_id", []);
      }
    } else if (periodoSeleccionado === "1") {
      // Si cambia a trimestral y tenemos un array, tomar el primer elemento
      if (
        Array.isArray(formik.values.trimestre_id) &&
        formik.values.trimestre_id.length > 0
      ) {
        formik.setFieldValue("trimestre_id", formik.values.trimestre_id[0]);
      }
    }
  }, [periodoSeleccionado, trimestres]);

  const handleCancel = () => {
    // Restaurar los valores del formulario
    formik.setValues(initialData);

    // Restaurar los trimestres disponibles (los del trayecto original)
    setTrimestres(initialTrimestres);

    // Restaurar el trayecto_id inicial
    setInitialTrayectoId(initialData.trayecto_id);

    // Limpiar errores y estados touched
    formik.setErrors({});
    formik.setTouched({});
  };

  // Funcion para generar el total de horas
  const totalHoras = useMemo(() => {
    // sumar horas teoricas con horas practicas
    return (
      parseInt(formik.values.hora_teorica || 0) +
      parseInt(formik.values.hora_practica || 0)
    );
  }, [formik.values.hora_teorica, formik.values.hora_practica]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="EDITAR UNIDAD CURRICULAR"
          link={
            <Create
              path="/unidad_curricular"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.NAME}
                type="text"
                name="nombre"
                placeholder="NOMBRE"
                formik={formik}
              />
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.UNIDAD_CREDITO}
                type="text"
                name="unidad_credito"
                placeholder="UNIDAD CREDITO"
                formik={formik}
              />
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.HORA_TEORICA}
                type="text"
                name="hora_teorica"
                placeholder="HORA TEORÍCA"
                formik={formik}
              />
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.HORA_PRACTICA}
                type="text"
                name="hora_practica"
                placeholder="HORA PRACTICA"
                formik={formik}
              />
              {/* Input para el total de horas estimadas*/}
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.HORA_TOTAL_EST}
                type="text"
                name="hora_total_est"
                placeholder="HORAS TOTALES"
                formik={formik}
                disabled={true}
                value={totalHoras}
              />
              <SelectSearch
                name="trayecto_id"
                options={trayectos || []}
                label="TRAYECTO"
                formik={formik}
              />
              <SelectSearch
                name="periodo"
                options={[
                  { id: "1", nombre: "TRIMESTRAL" },
                  { id: "2", nombre: "SEMESTRAL" },
                  { id: "3", nombre: "ANUAL" },
                ]}
                label="PERÍODO"
                formik={formik}
              />
              <SelectSearch
                name="trimestre_id"
                options={trimestres}
                label={FORM_LABELS.UNIDAD_CURRICULAR.TRIMESTRE_ID}
                formik={formik}
                isMulti={isTrimestreMulti}
                disabled={
                  !formik.values.trayecto_id ||
                  loadingTrimestres ||
                  isTrimestreDisabled
                }
                placeholder={
                  !formik.values.trayecto_id
                    ? "PRIMERO SELECCIONE UN TRAYECTO"
                    : loadingTrimestres
                    ? "CARGANDO TRIMESTRES..."
                    : isTrimestreDisabled
                    ? "TRIMESTRES SELECCIONADOS AUTOMÁTICAMENTE"
                    : isTrimestreMulti
                    ? "SELECCIONE 2 TRIMESTRES"
                    : "SELECCIONE UN TRIMESTRE"
                }
              />
              <TextAreaLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.DESCRIPCION}
                name="descripcion"
                placeholder="UNIDAD CURRICULAR SOBRE ..."
                formik={formik}
                rows={3}
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
                type="button"
                style="btn-secondary ms-1"
                title="Limpiar"
                text="Limpiar"
                onClick={handleCancel}
              />
            </>
          }
        />
      </form>
    </>
  );
}

export default UnidadCurricularEdit;
