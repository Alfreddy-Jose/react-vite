import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { PostAll } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import SelectSearch from "../../components/SelectSearch";

// Iniciando variables
const initialValues = {
  nombre: "",
  inicio: "",
  inicio_periodo: "AM",
  final: "",
  final_periodo: "AM",
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), // Solo letras
  inicio: Yup.string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (ej: 07:30, 12:15)") // Solo números
    .required("Este campo es obligatorio"), // Campo obligatorio
  inicio_periodo: Yup.string().oneOf(["AM", "PM"]).required(),
  final: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (ej: 7:30, 12:15)"), // Solo números
  final_periodo: Yup.string().oneOf(["AM", "PM"]).required(),
});

function TurnoCreate() {
  const navegation = useNavigate();


/*   const onSubmit = (values) => {
    PostAll(values, "/turnos", navegation);
    console.log(values);
  }; */

  // Funcion para enviar datos al backend

  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/turnos", navegation);
      console.log(values);
      
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

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="NUEVO TURNO"
          link={
            <Create
              path="/turnos"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              {/* Select para nombre del turno */}
              <SelectSearch
                label={FORM_LABELS.TURNOS.NAME}
                name="nombre"
                options={[
                  { id: "MAÑANA", nombre: "MAÑANA" },
                  { id: "TARDE", nombre: "TARDE" },
                  { id: "NOCHE", nombre: "NOCHE" },
                ]}
                placeholder="NOMBRE"
                formik={formik}
              />

              {/* Input para el inicio */}
              <InputLabel
                label={FORM_LABELS.TURNOS.INICIO}
                type="text"
                name="inicio"
                placeholder="HORA DE INICIO"
                formik={formik}
              />
              <div className="col-sm-2 col-xl-2">
                <label htmlFor="inicio_periodo" className="mt-4">
                  PERÍODO
                </label>
                <select
                  name="inicio_periodo"
                  id="inicio_periodo"
                  onChange={formik.handleChange}
                  value={formik.values.inicio_periodo}
                  className="form-select mb2"
                  style={{ maxWidth: 100, height: 40 }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              {/* Input para el final */}
              <InputLabel
                label={FORM_LABELS.TURNOS.FINAL}
                type="text"
                name="final"
                placeholder="HORA DE FINAL"
                formik={formik}
              />
              <div className="col-sm-2 col-xl-2">
                <label htmlFor="final_periodo" className="mt-4">
                  PERÍODO
                </label>
                <select
                  name="final_periodo"
                  id="final_periodo"
                  onChange={formik.handleChange}
                  className="form-select mb-2"
                  value={formik.values.final_periodo}
                  style={{ maxWidth: 100, height: 40 }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
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

export default TurnoCreate;
