import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Api, { PostAll, PutAll } from "../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import Alerta from "../../components/Alert";
import Spinner from "../../components/Spinner";

const validationSchema = Yup.object({
  rif_univ: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  nombre_univ: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") //Solo letras
    .required("Este campo es obligatorio"), // Campo obligatorio
  abreviado_univ: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), //Solo letras
  direccion: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
});

export function Universidad() {
  const [universidad, setUniversidad] = useState([]);
  const navegation = useNavigate();
  const location = useLocation();
  const[loading, setLoading] = useState(true); // Estado de carga
  const [initialValues, setInitialValues] = useState({
    rif_univ: "",
    nombre_univ: "",
    abreviado_univ: "",
    direccion: "",
  });

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      // Enviando datos al backend y captando errores si no hay universidad
      if (universidad.length === 0) {
        await PostAll(values, "/universidad", navegation);
      }
      // Si ya hay universidad, actualiza el registro
      else {
        await PutAll(values, "/universidad", navegation, universidad[0].id, "/universidad");
      }
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
    // enableReinitialize si los valores si hay universidad
    enableReinitialize: true,
    // iniciar valores en cero si no hay universidad
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getUniversidad = async () => {
      try {
        const response = await Api.get("/universidades");
        if (response.data.length > 0) {
          setInitialValues({
            rif_univ: response.data[0].rif_univ,
            nombre_univ: response.data[0].nombre_univ,
            abreviado_univ: response.data[0].abreviado_univ,
            direccion: response.data[0].direccion,
          });
        }
        setUniversidad(response.data);
      } catch (error) {
        console.error("Error fetching universidad data:", error);
      } finally {
        setLoading(false); // Cambia el estado de carga a falso
      }
    };

    // Motrar Alerta al registrar un nuevo PNF
    if (location.state?.message) {
      Alerta(location.state.message);
    }

    // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
    window.history.replaceState({}, "");

    getUniversidad();
  }, [location.state]);

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <Spinner></Spinner>
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
      /* cambiar title si ya hay universidad */
        title={universidad.length > 0 ? "EDITAR UNIVERSIDAD" : "REGISTRAR UNIVERSIDAD"}
        input={
          <>
            {/* Input para nombre de LAPSO */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.RIF}
              type="text"
              name="rif_univ"
              placeholder="RIF"
              formik={formik}
            />
            {/* Input para año del LAPSO */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.NAME}
              type="text"
              name="nombre_univ"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
            />
            {/* Input para PNF abreviado */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.NAME_ABRE}
              type="text"
              name="abreviado_univ"
              placeholder="NOMBRE ABREVIADO"
              formik={formik}
            />
            {/* Input para PNF abreviado */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.ADRRE}
              type="text"
              name="direccion"
              placeholder="DIRECCIÓN"
              formik={formik}
            />
          </>
        }
        // Botones para enviar y cancelar
        buttom={
          <>
          {/* cambiar texto a editar si ya hay universidad */}
            <Buttom
              text={universidad.length > 0 ? "Editar" : "Guardar"}
              title={universidad.length > 0 ? "Editar" : "Guardar"}
              type="submit"
              style="btn btn-success"
            />
            {/* Si no hay universidad, muestra el botón de cancelar */}
            {universidad.length === 0 ? (
            <Buttom
              text="Cancelar"
              title="Cancelar"
              type="reset"
              style="btn btn-danger ms-1"
              onClick={() => formik.resetForm()}
            />
            ) : null}
          </>
        }
      />
    </form>
  );
}
