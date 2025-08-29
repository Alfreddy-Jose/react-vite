import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { GetAll, PostAll } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectSearch from "../../components/SelectSearch";

// Iniciando variables
const initialValues = {
  nombre: "",
  descripcion: "",
  unidad_credito: "",
  hora_teorica: "",
  hora_practica: "",
  periodo: "",
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
  trimestre_id: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  descripcion: Yup.string().max(255, "Máximo 255 caracteres"),
});

function UnidadCurricularCreate() {
  const navegation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trimestres, setTrimestres] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {

    values.hora_total_est = parseInt(values.hora_teorica) + parseInt(values.hora_practica);

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

  useEffect(() => {
    // Obtener todos los trimestres
    GetAll(setTrimestres, setLoading, "/get_trimestres");
  }, []);
  console.log(loading);

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
                placeholder="UNIDAD CREDITO"
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
