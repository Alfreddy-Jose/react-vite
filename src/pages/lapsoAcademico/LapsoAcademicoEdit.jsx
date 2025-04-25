import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../services/Api";
import { useEffect, useState } from "react";


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
  tipo_lapso: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .required("Este campo es obligatorio"),
});

export function LapsoAcademicoEdit() {

  const {id} = useParams();
  const navegation = useNavigate();
  const [lapso, setLapso] = useState();

  // Funcion para enviar datos al backend
  const onSubmit = async (values) => {
    await Api.put(`/lapso/${id}`, values).then((response) => {
      navegation("/lapso_academico", { state: { message: response.data.message } });
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    // Cargando los datos en los campos
    initialValues: {
      nombre_lapso: lapso?.nombre_lapso || '',
      ano: lapso?.ano || '',
      tipo_lapso: lapso?.tipo_lapso || ''
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
      const getLapso = async () => {
      const response = await Api.get(`lapso/${id}`)
      setLapso(response.data);
    }

    getLapso();

  }, [id]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="EDITAR LAPSO ACADEMICO"
        link={
          <Create
            path="/lapso_academico"
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
            {/* Input para PNF abreviado */}
            <InputLabel
              label={FORM_LABELS.LAPSO_ACADEMICO.TYPE}
              type="text"
              name="tipo_lapso"
              placeholder="TIPO LAPSO"
              formik={formik}
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
