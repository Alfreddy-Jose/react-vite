import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { GetAll, PutAll } from "../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectSearch from "../../components/SelectSearch";

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
  trimestre_id: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  descripcion: Yup.string().max(255, "Máximo 255 caracteres"),
});

function UnidadCurricularEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trimestres, setTrimestres] = useState([]);
  const [unidadCurricular, setUnidadCurricular] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {

    values.hora_total_est = parseInt(values.hora_teorica) + parseInt(values.hora_practica);

    try {
      await PutAll(values, "/unidad_curricular", navegation, id, "/unidad_curricular");
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
    enableReinitialize: true, // Permite que los valores iniciales se actualicen
    initialValues : {
      nombre: unidadCurricular?.nombre || "",
      descripcion: unidadCurricular?.descripcion || "",
      unidad_credito: unidadCurricular?.unidad_credito || "",
      hora_teorica: unidadCurricular?.hora_teorica || "",
      hora_practica: unidadCurricular?.hora_practica || "",
      periodo: unidadCurricular?.periodo || "",
      trimestre_id: unidadCurricular?.trimestre_id || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Obtener todos los trimestres
    GetAll(setTrimestres, setLoading, "/get_trimestres");

    GetAll(setUnidadCurricular, setLoading, `/unidad_curricular/${id}`);

  }, [id]); 
  console.log(loading);

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
                placeholder="UNIDAD CREDITO"
                formik={formik}
              />
              {/* Input para las horas academicas */}
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.HORA_TEORICA}
                type="text"
                name="hora_teorica"
                placeholder="HORA TEORICA"
                formik={formik}
              />
              {/* Input para el total de horas estimadas*/}
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.HORA_PRACTICA}
                type="text"
                name="hora_practica"
                placeholder="HORA PRACTICA"
                formik={formik}
              />
              <SelectSearch
                name="periodo"
                options={[
                  { id: "1", nombre: "1 TRIMESTRE" },
                  { id: "2", nombre: "2 TRIMESTRES" },
                  { id: "3", nombre: "3 TRIMESTRES" },
                ]}
                label="PERÍODO"
                formik={formik}
              />
              <SelectSearch
                name="trimestre_id"
                options={trimestres}
                label="TRIMESTRE"
                formik={formik}
              />
              {/* Campo de descripcion  */}
              <InputLabel
                label={FORM_LABELS.UNIDAD_CURRICULAR.DESCRIPCION}
                type="text"
                name="descripcion"
                placeholder="DESCRIPCIÓN"
                formik={formik}
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
            </>
          }
        />
      </form>
    </>
  );
}

export default UnidadCurricularEdit;
