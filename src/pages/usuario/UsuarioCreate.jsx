import { useFormik } from "formik";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { FORM_LABELS } from "../../constants/formLabels";
import { Buttom } from "../../components/Buttom";
import * as Yup from "yup";

// Inicializando los campos
const initialValues = {
  nombre: "",
  email: "",
  password: "",
  confirm: "",
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  nombre: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas")
    .required("Este campo es obligatorio"),
  email: Yup.string()
    .email("Correo no válido")
    .required("Este campo es obligatorio"),
  password: Yup.string()
    .min(4, "Minimo 4 caracteres")
    .max(8, "Maximo 8 caracteres")
    .required("Este campo es obligatorio"),
  confirm: Yup.string()
    .min(4, "Minimo 4 caracteres")
    .oneOf([Yup.ref("password"), undefined], "Las contraseñas no coinciden")
    .max(8, "Maximo 8 caracteres")
    .required("Este campo es obligatorio"),
});

export function UsuarioCreate() {
  // Funcion para enviar datos al backend
  const onSubmit = (values) => {
    console.log(values);
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
          title="NUEVO USUARIO"
          link={
            <Create
              path="/usuarios"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          input={
            <>
              {/* Input para nombre de usuario */}
              <InputLabel
                label={FORM_LABELS.USER.NAME}
                type="text"
                name="nombre"
                placeholder="INGRESE UN NOMBRE"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
              />
              {/* Input para email de usuario */}
              <InputLabel
                label={FORM_LABELS.USER.EMAIL}
                type="email"
                name="email"
                placeholder="INGRESE UN EMAIL"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
              />
              {/* Input para contraseña de usuario */}
              <InputLabel
                label={FORM_LABELS.USER.PASSWORD}
                type="password"
                name="password"
                placeholder="***********"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
              />
              {/* Input para confirmar la contraseña de usuario */}
              <InputLabel
                label={FORM_LABELS.USER.CONFIRM}
                type="password"
                name="confirm"
                placeholder="************"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
              />
              <div className="col-sm-6 col-xl-4">
                <label className="mt-4" htmlFor="rol">ROL</label>
                <select className="form-control" name="rol" id="rol">
                  <option value="" selected disabled>SELECCIONE UN ROL</option>
                  <option value="">ADMINISTRADOR</option>
                  <option value="">SUPERVISOR</option>
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
                type="reset"
                style="btn-danger ms-1"
                title="Cancelar"
                text="Cancelar"
              />
            </>
          }
        />
      </form>
    </>
  );
}
