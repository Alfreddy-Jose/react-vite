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



// Validando los campos
const validationSchema = Yup.object({
  nombre: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  tipo: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") //Solo letras
    .required("Este campo es obligatorio"), // Campo obligatorio
});

export function TipoMatriculaEdit() {
  const {id} = useParams();
  const navegation = useNavigate()
  const [matricula, setMatricula] = useState();

  // Funcion para enviar datos al backend
  const onSubmit = async (values) => {
    await Api.put(`/matricula/${id}`, values).then((response) => {
      console.log(response)
      navegation("/tipo_matricula", { state: { message: response.data.message } });
    })
  };


  const formik = useFormik({
    enableReinitialize: true,
    // Cargando los datos en los campos
    initialValues: {
      nombre: matricula?.nombre || '',
      tipo: matricula?.tipo || '',
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getMatricula = async () => {
      const response = await Api.get(`matricula/${id}`)
      setMatricula(response.data);
    }

    getMatricula();

  }, [id]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="EDITAR TIPO DE MATRICULA"
        link={
          <Create
            path="/tipo_matricula"
            text="Volver"
            style="btn btn-secondary mb-4"
          />
        }
        input={
          <>
            {/* Input para nombre del TIPO DE MATRICULA  */}
            <InputLabel
              label={FORM_LABELS.TIPO_MATRICULA.NAME}
              type="text"
              name="nombre"
              placeholder="INGRESE UN NOMBRE"
              onBlur={formik.handleBlur}
              value={formik.values.codigo}
              formik={formik}
            />
            {/* Input para el TIPO DE MATRICULA */}
            <InputLabel
              label={FORM_LABELS.TIPO_MATRICULA.TYPE}
              type="text"
              name="tipo"
              placeholder="TIPO"
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