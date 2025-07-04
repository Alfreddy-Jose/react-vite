import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { GetAll, PostAll } from "../../services/Api";
import { useEffect, useState } from "react";
import SelectSearch from "../../components/SelectSearch";

const initialValues = {
  nombre_lapso: "",
  ano: "",
  tipo_lapso_id: "",
};

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

export function LapsoAcademicoCreate() {
  const navegation = useNavigate();
  const [tipoLapsos, setTipoLapsos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/lapsos", navegation);
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
    GetAll(setTipoLapsos, setLoading, "/get_tipoLapsos");
    setLoading(false);
  }, []);
  console.log(loading);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="NUEVO LAPSO ACADEMICO"
        link={
          <Create
            path="/lapsos"
            text="Volver"
            style="btn btn-secondary mb-4"
          />
        }
        input={
          <>
            {/* Input para nombre de LAPSO */}
            <InputLabel
              label={FORM_LABELS.LAPSO_ACADEMICO.NAME}
              type="text"
              name="nombre_lapso"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
            />
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
              type="reset"
              style="btn-danger ms-1"
            />
          </>
        }
      />
    </form>
  );
}
