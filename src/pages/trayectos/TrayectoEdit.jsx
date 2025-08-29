import { useFormik } from "formik";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import Api, { PostAll } from "../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Validaciones para cada campo
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[0-9]*$/, "Solo letras permitidas"), // Solo letras
});

function TrayectoEdit() {
  const navegation = useNavigate();
  const { id } = useParams();
  const [trayecto, setTrayecto] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/trayectos", navegation);
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

  useEffect(() => {
    // Trayendo los datos del registro
    const getTrayecto = async () => {
      const response = await Api.get(`/trayecto/${id}`);
      setTrayecto(response.data);
    };

    getTrayecto();
  }, [ id ]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: trayecto?.nombre || "",
    },
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="EDITAR TRAYECTO"
          link={
            <Create
              path="/trayectos"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              {/* Input para nombre del trayecto */}
              <InputLabel
                label={FORM_LABELS.TURNOS.NAME}
                type="text"
                name="nombre"
                placeholder="EJEMPLO: 1"
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

export default TrayectoEdit;
