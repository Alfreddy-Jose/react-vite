import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { FORM_LABELS } from "../../constants/formLabels";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Create } from "../../components/Link";
import Api, { PostAll } from "../../services/Api";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import Warning from "../../img/icons_warning.png";

const initialValues = {
  nro_sede: "",
  nombre_sede: "",
  nombre_abreviado: "",
  direccion: "",
  municipio: "",
};
// Validando campos
const validationSchema = Yup.object({
  nro_sede: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[0-9]*$/, "Solo números permitidos"), // Solo Permitir Números
  nombre_sede: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), // Permite Solo Letras
  nombre_abreviado: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"),
  direccion: Yup.string().required("Este campo es obligatorio"),
  municipio: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"),
});

export function SedeCreate() {
  const navegation = useNavigate();
  const [universidad, setUniversidad] = useState();
  const [loading, setLoading] = useState(true); // Estado de carga

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/sede", navegation);
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
    //inicializar campos y campo universidad con el id
    initialValues: {
      ...initialValues,
      universidad_id: universidad ? universidad.id : "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getUniversidad = async () => {
      try {
        const response = await Api.get("/universidad");
          setUniversidad(response.data);
      } catch (error) {
        console.error("Error fetching universidad data:", error);
      } finally {
        setLoading(false); // Cambia el estado de carga a falso
      }
    };

    getUniversidad();
  }, []);

  // Mostrar Spinner mientras se obtienen los datos
  if (loading) {
    return <Spinner></Spinner>
  }


  if (
    universidad && (!Array.isArray(universidad) || (Array.isArray(universidad) && universidad.length > 0))
  ) {
    return (
      <form onSubmit={formik.handleSubmit}>
        <>
          <ContainerIput
            title="NUEVA SEDE"
            link={
              <Create
                path="/sede"
                text="Volver"
                style="btn btn-secondary mb-4"
              />
            }
            input={
              <>
                {/* Input para seleccionar universidad */}
                <InputLabel
                  type="text"
                  name="universidad_id"
                  placeholder="UNIVERSIDAD"
                  disabled={true}
                  hidden={true}
                  onBlur={formik.handleBlur}
                  value={formik.values}
                  formik={formik}
                />
                {/* Input para numero de SEDE */}
                <InputLabel
                  label={FORM_LABELS.SEDE.SEDE_NUMBER}
                  type="text"
                  name="nro_sede"
                  placeholder="NÚMERO DE SEDE"
                  onBlur={formik.handleBlur}
                  value={formik.values.codigo}
                  formik={formik}
                />
                {/* Input para nombre de SEDE */}
                <InputLabel
                  label={FORM_LABELS.USER.NAME}
                  type="text"
                  name="nombre_sede"
                  placeholder="INGRESE UN NOMBRE"
                  onBlur={formik.handleBlur}
                  value={formik.values.codigo}
                  formik={formik}
                />
                {/* Input para nombre abreviado de SEDE */}
                <InputLabel
                  label={FORM_LABELS.PNF.NAME_ABRE}
                  type="text"
                  name="nombre_abreviado"
                  placeholder="NOMBRE ABREVIADO"
                  onBlur={formik.handleBlur}
                  value={formik.values.codigo}
                  formik={formik}
                />
                {/* Input para dirección de SEDE */}
                <InputLabel
                  label={FORM_LABELS.SEDE.ADDRE}
                  type="text"
                  name="direccion"
                  placeholder="DIRECCIÓN"
                  onBlur={formik.handleBlur}
                  value={formik.values.codigo}
                  formik={formik}
                />
                {/* Input para dirección de SEDE */}
                <InputLabel
                  label={FORM_LABELS.SEDE.MUNICIPIO}
                  type="text"
                  name="municipio"
                  placeholder="MUNICIPIO"
                  onBlur={formik.handleBlur}
                  value={formik.values.codigo}
                  formik={formik}
                />
              </>
            }
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
                  onClick={() => formik.resetForm()}
                />
              </>
            }
          />
        </>
      </form>
    );
  } else {
    // Mostrar un mensaje si no hay universidad configurada
    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-center p-4">
        <img src={Warning} alt="imagen de alerta" />
        <h2 className="h4 text-dark mb-3">¡Configuración requerida!</h2>
        <p className="text-muted mb-4">
          No has configurado los datos de la universidad. <br />
          Por favor completa esta información para continuar.
        </p>
        <Link to="/universidad" className="btn btn-primary">
          Configurar Universidad
        </Link>
      </div>
    );
  }
}
