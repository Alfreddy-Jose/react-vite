import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Api, { GetAll, PutAll } from "../../services/Api";
import { useEffect, useMemo, useState } from "react";
import SelectSearch from "../../components/SelectSearch";

const validationSchema = Yup.object({
  nombre_lapso: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Solo números
    .required("Este campo es obligatorio"), // Campo obligatorio
  ano: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Validación mientras escribe
    .test("longitud", "Debe tener 4 dígitos", (val) => !val || val.length === 4) // Solo valida cuando tiene 4
    .test("no-futuro", "No puede ser un año futuro", (value) => {
      if (!value || value.length < 4) return true; // No valida futuro hasta tener año completo
      const añoActual = new Date().getFullYear();
      return parseInt(value) <= añoActual;
    })
    .required("Este campo es obligatorio"),
  tipo_lapso_id: Yup.string().required("Este campo es obligatorio"),
});

export function LapsoAcademicoEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [lapso, setLapso] = useState();
  const [tipoLapsos, setTipoLapsos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      console.log(values);

      await PutAll(values, "/lapso", navegation, id, "/lapsos");
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
      nombre_lapso: lapso?.nombre_lapso || "",
      ano: lapso?.ano || "",
      tipo_lapso_id: lapso?.tipo_lapso_id || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getLapso = async () => {
      const response = await Api.get(`lapso/${id}`);
      setLapso(response.data);

      GetAll(setTipoLapsos, setLoading, "/get_tipoLapsos");
      setLoading(false);
    };

    getLapso();
  }, [id]);
  console.log(loading);

  // Funcion para generar el nombre del LAPSO
  const nombreLapso = useMemo(() => {
    return `${formik.values.ano}${formik.values.tipo_lapso_id}`;
  }, [formik.values.ano, formik.values.tipo_lapso_id]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="EDITAR LAPSO ACADÉMICO"
        link={
          <Create path="/lapsos" text="Volver" style="btn btn-secondary mb-4" />
        }
        input={
          <>
            {/* Input para año del LAPSO */}
            <InputLabel
              label={FORM_LABELS.LAPSO_ACADEMICO.YEAR}
              type="text"
              name="ano"
              placeholder="INGRESE AÑO"
              formik={formik}
            />
            {/* Select para los tipos de lapsos */}
            <SelectSearch
              label={FORM_LABELS.LAPSO_ACADEMICO.TYPE}
              options={tipoLapsos}
              name="tipo_lapso_id"
              formik={formik}
            />
            {/* Input para nombre de LAPSO */}
            <InputLabel
              label={FORM_LABELS.LAPSO_ACADEMICO.NAME}
              type="text"
              name="nombre_lapso"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
              value={nombreLapso}
              useExternalValue={true}
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
