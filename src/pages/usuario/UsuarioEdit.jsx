import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputContraseña, InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { Create } from "../../components/Link";
import Api, { GetAll, PutAll } from "../../services/Api";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FORM_LABELS } from "../../constants/formLabels";
import SelectSearch from "../../components/SelectSearch";

// Validando campos
const validationSchema = Yup.object({
  nombre: Yup.string().required("Este campo es obligatorio"),
  email: Yup.string()
    .email("Ingrese un email válido") // Validación de email
    .required("Este campo es obligatorio"), // Campo requerido
  rol: Yup.string().required("Debes seleccionar una opción"),
});

function UsuarioEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState();
  const [roles, setRoles] = useState([]);

  // Funcion para enviar datos al backend
    const onSubmit = async (values, { setErrors }) => {
    try {
      await PutAll(values, "/usuarios", navegation, id, "/usuarios");
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
    // Cargando los datos en los campos
    initialValues: {
      nombre: usuarios?.name || "",
      email: usuarios?.email || "",
      rol: usuarios?.rol || "",
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getUsuarios = async () => {
      const response = await Api.get(`/usuario/${id}`);
      setUsuarios(response.data);
    };
    // Obteniendo roles
    GetAll(setRoles, setLoading, "/get_roles");
    setLoading(false);

    getUsuarios();
  }, [id]);
  console.log(loading);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="EDITAR USUARIO"
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
              <SelectSearch
                label={FORM_LABELS.USER.ROL}
                name="rol"
                placeholder="SELECCIONE UNA OPCIÓN"
                options={roles}
                formik={formik}
                labelKey="name"
                valueKey="id"
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
      <FormPassword />
    </>
  );
}

export function FormPassword() {
  // Validando Contraseñas
  const validationSchema = Yup.object({
    current_password: Yup.string()
      .min(6, "Minimo 6 caracteres")
      .required("Este campo es obligatorio"),
    new_password: Yup.string()
      .min(6, "Minimo 6 caracteres")
      .required("Este campo es obligatorio"),
    new_password_confirmation: Yup.string()
      .min(6, "Minimo 6 caracteres")
      .oneOf(
        [Yup.ref("new_password"), undefined],
        "Las nuevas contraseñas no coinciden"
      )
      .required("Este campo es obligatorio"),
  });

  const { id } = useParams();
  const navegation = useNavigate();

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PutAll(values, "/password", navegation, id, "/usuarios");
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
    // Cargando los datos en los campos
    initialValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="EDITAR CONTRASEÑA"
          input={
            <>
              {/* Input para la contraseña de usuario */}
              <InputContraseña
                label={FORM_LABELS.USER.PASSWORD_ACTUAL}
                type="password"
                name="current_password"
                placeholder="CONTRASEÑA ACTUAL"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
                eye={true}
              />
              {/* Input para nueva contraseña de usuario */}
              <InputContraseña
                label={FORM_LABELS.USER.NEW_PASSWORD}
                type="password"
                name="new_password"
                placeholder="NUEVA CONTRASEÑA"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
                eye={true}
              />
              {/* Input para confirmar nueva contraseña de usuario */}
              <InputContraseña
                label={FORM_LABELS.USER.NEW_CONFIRM}
                type="password"
                name="new_password_confirmation"
                placeholder="CONFIRME CONTRASEÑA"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
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

export default UsuarioEdit;
