import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import Api, { PostAll } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectSearch from "../../components/SelectSearch";
import { TextAreaLabel } from "../../components/TextAreaLabel";

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
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), // Solo letras
  unidad_credito: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[0-:-9]*$/, "Solo números"), // Solo números
  hora_teorica: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[0-:-9]*$/, "Solo números"), // Solo números
  hora_practica: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[0-:-9]*$/, "Solo números"), // Solo números
  periodo: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  trayecto_id: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  descripcion: Yup.string().max(255, "Máximo 255 caracteres"),
  // Primero definir una validación base
  trimestre_id: Yup.mixed().test("trimestre-validation", function (value) {
    const { periodo } = this.parent;

    // Si no hay período seleccionado, no validar
    if (!periodo) return true;

    if (periodo === "1") {
      // TRIMESTRAL
      // Debe ser un número (no array)
      if (value === null || value === undefined || value === "") {
        return this.createError({
          message: "Este campo es obligatorio",
        });
      }
      return true;
    } else if (periodo === "2" || periodo === "3") {
      // SEMESTRAL o ANUAL
      // Debe ser un array con al menos un elemento
      if (!Array.isArray(value) || value.length === 0) {
        return this.createError({
          message: "Este campo es obligatorio",
        });
      }

      // Validación adicional para SEMESTRAL (exactamente 2 trimestres)
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

function UnidadCurricularCreate() {
  const navegation = useNavigate();
  const [trimestres, setTrimestres] = useState([]);
  const [trayectos, setTrayectos] = useState([]);
  const [loadingTrimestres, setLoadingTrimestres] = useState(false);

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
    values.hora_total_est =
      parseInt(values.hora_teorica) + parseInt(values.hora_practica);

    try {
      await PostAll(values, "/unidad_curricular", navegation);
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

  // Efecto para cargar trimestres cuando cambia el trayecto seleccionado
  useEffect(() => {
    if (formik.values.trayecto_id) {
      cargarTrimestres(formik.values.trayecto_id);
    } else {
      setTrimestres([]);
      formik.setFieldValue("trimestre_id", "");
    }
  }, [formik.values.trayecto_id]);

  // Determinar el modo de selección de trimestres según el periodo
  const periodoSeleccionado = formik.values.periodo;
  const isTrimestreMulti =
    periodoSeleccionado === "2" || periodoSeleccionado === "3"; // 2=SEMESTRAL, 3=ANUAL
  const isTrimestreDisabled = periodoSeleccionado === "3"; // ANUAL

  // Efecto para seleccionar automáticamente los trimestres en modo ANUAL
  useEffect(() => {
    if (periodoSeleccionado === "3" && trimestres.length > 0) {
      // Selecciona todos los trimestres
      formik.setFieldValue(
        "trimestre_id",
        trimestres.map((t) => t.id)
      );
    } else if (periodoSeleccionado === "2" && trimestres.length > 0) {
      // Si cambia a semestral, limpia la selección
      if (
        Array.isArray(formik.values.trimestre_id) &&
        formik.values.trimestre_id.length > 2
      ) {
        formik.setFieldValue("trimestre_id", []);
      }
    } else if (periodoSeleccionado === "1") {
      // Si cambia a trimestral, limpia la selección
      formik.setFieldValue("trimestre_id", "");
    }
  }, [periodoSeleccionado, trimestres]);


  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="NUEVA UNIDAD CURRICULAR"
          link={
            <Create
              path="/unidad_curricular"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              {/* Input para nombre de unidad curricular */}
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.NAME}
                type="text"
                name="nombre"
                placeholder="NOMBRE"
                formik={formik}
              />
              {/* Input para unidad de credito */}
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.UNIDAD_CREDITO}
                type="text"
                name="unidad_credito"
                placeholder="UNIDAD CRÉDITO"
                formik={formik}
              />
              {/* Input para las horas academicas */}
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.HORA_TEORICA}
                type="text"
                name="hora_teorica"
                placeholder="HORA TEORÍCA"
                formik={formik}
              />
              {/* Input para el total de horas estimadas*/}
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.HORA_PRACTICA}
                type="text"
                name="hora_practica"
                placeholder="HORA PRÁCTICA"
                formik={formik}
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
              {/* Campo de descripcion  */}
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
                title="Guardar"
                text="Guardar"
              />
              <Buttom
                type="button"
                style="btn-danger ms-1"
                title="Cancelar"
                text="Cancelar"
                onClick={() => formik.resetForm()}
              />
            </>
          }
        />
      </form>
    </>
  );
}

export default UnidadCurricularCreate;
