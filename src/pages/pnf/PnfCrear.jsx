import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import Api, { PostAll, PutAll } from "../../services/Api";
import Alerta from "../../components/Alert";
import { ContainerIput } from "../../components/ContainerInput";
import Spinner from "../../components/Spinner";
// import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";

// Validando campos
const validationSchema = Yup.object({
  nombre: Yup.string().required("Este campo es obligatorio"),
  codigo: Yup.string()
    .required("Este campo es obligatorio") // Campo requerido
    .matches(/^[0-9]*$/, "Solo números permitidos"), // Solo números
  abreviado: Yup.string()
    .min(4, "Minimo 4 carácteres") // Minimo 4 carácteres
    .required("Este campo es obligatorio"), // Campo requerido
  abreviado_coord: Yup.string()
    .min(3, "Minimo 3 carácteres") // Minimo 3 carácteres
    .required("Este campo es obligatorio"), // Campo requerido
});

function PnfCrear() {
  const [pnf, setPnf] = useState([]);
  const navegation = useNavigate();
  const location = useLocation();
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    codigo: "",
    nombre: "",
    abreviado: "",
    abreviado_coord: "",
  });

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      // Enviando datos al backend y captando errores si no hay pnf
      if (pnf.length === 0) {
        await PostAll(values, "/pnf", navegation);
      }
      // Si ya hay pnf, actualiza el registro
      else {
        await PutAll(values, "/pnf", navegation, pnf[0].id, "/pnf");
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
    // enableReinitialize si los valores si hay pnf
    enableReinitialize: true,
    // iniciar valores en cero si no hay pnf
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Leer permisos cada vez que el componente se monta o el localStorage cambia
    const permisos = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisos);

    // Trayendo los datos del registro
    const getPnf = async () => {
      try {
        const response = await Api.get("/pnf");
        if (response.data.length > 0) {
          setInitialValues({
            codigo: response.data[0].codigo,
            nombre: response.data[0].nombre,
            abreviado: response.data[0].abreviado,
            abreviado_coord: response.data[0].abreviado_coord,
          });
        }
        setPnf(response.data);
      } catch (error) {
        console.error("Error fetching pnf data:", error);
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

    getPnf();
  }, [location.state]);

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <Spinner></Spinner>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        /* cambiar title si ya hay pnf */
        title={pnf.length > 0 ? "EDITAR PNF" : "REGISTRAR PNF"}
        input={
          <>
            {/* Input para codigo de PNF */}
            <InputLabel
              label={FORM_LABELS.PNF.CODIGO}
              type="text"
              name="codigo"
              placeholder="INGRESE CÓDIGO"
              formik={formik}
            />
            {/* Input para nombre de PNF */}
            <InputLabel
              label={FORM_LABELS.USER.NAME}
              type="text"
              name="nombre"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
            />
            {/* Input para PNF abreviado */}
            <InputLabel
              label={FORM_LABELS.PNF.ABREVIADO}
              type="text"
              name="abreviado"
              placeholder="INGRESE ABREVIADO"
              formik={formik}
            />
            {/* Input para PNF abreviado coodinacion */}
            <InputLabel
              label={FORM_LABELS.PNF.COORDINACION}
              type="text"
              name="abreviado_coord"
              placeholder="INGRESE ABREVIADO DE COORDINACIÓN"
              formik={formik}
            />
          </>
        }
        // Botones para enviar y cancelar
        buttom={
          <>
            {/* cambiar texto a editar si ya hay pnf */}
            {(permisos.includes("pnf.crear") && pnf.length <= 0) ||
            (permisos.includes("pnf.editar") && pnf.length > 0) ? (
              <Buttom
                text={pnf.length > 0 ? "Editar" : "Guardar"}
                title={pnf.length > 0 ? "Editar" : "Guardar"}
                type="submit"
                style="btn btn-success"
              />
            ) : null}
            {(permisos.includes("pnf.crear") && pnf.length <= 0) ||
            (permisos.includes("pnf.editar") && pnf.length > 0) ? (
              <Buttom
                text="Limpiar"
                title="Limpiar"
                type="reset"
                style="btn btn-secondary ms-1"
                onClick={() => formik.resetForm()}
              />
            ) : null}
          </>
        }
      />
    </form>
  );
}

export default PnfCrear;
