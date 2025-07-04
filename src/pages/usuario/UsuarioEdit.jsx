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
  rol: Yup.string().required('Debes seleccionar una opción')
});

function UsuarioEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState();
  const [roles, setRoles] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = async (values) => {
    await PutAll(values, "/usuarios", navegation, id, "/usuarios");
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
    password: Yup.string()
      .min(4, "Minimo 4 caracteres")
      .max(8, "Maximo 8 caracteres")
      .required("Este campo es obligatorio"),
    confirm: Yup.string()
      .min(4, "Minimo 4 caracteres")
      .oneOf([Yup.ref("password"), undefined], "Las contraseñas no coinciden")
      .max(8, "Maximo 8 caracteres")
      .required("Este campo es obligatorio"),
    newPassword: Yup.string()
      .min(4, "Minimo 4 caracteres")
      .max(8, "Maximo 8 caracteres")
      .required("Este campo es obligatorio"),
    newConfirm: Yup.string()
      .min(4, "Minimo 4 caracteres")
      .oneOf(
        [Yup.ref("newPassword"), undefined],
        "Las nuevas contraseñas no coinciden"
      )
      .max(8, "Maximo 8 caracteres")
      .required("Este campo es obligatorio"),
  });

  const { id } = useParams();
  const navegation = useNavigate();

  // Funcion para enviar datos al backend
  const onSubmit = async (values) => {
    await PutAll(values, "/password", navegation, id, "/usuarios");
  };

  const formik = useFormik({
    enableReinitialize: true,
    // Cargando los datos en los campos
    initialValues: {
      password: "",
      confirm: "",
      newPassword: "",
      newConfirm: "",
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
                name="password"
                placeholder="CONTRASEÑA ACTUAL"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
                eye={true}
              />
              {/* Input para confirmar contraseña de usuario */}
              <InputContraseña
                label={FORM_LABELS.USER.CONFIRM}
                type="password"
                name="confirm"
                placeholder="CONFIRME CONTRASEÑA ACTUAL"
                onBlur={formik.handleBlur}
                value={formik.values.codigo}
                formik={formik}
              />
              {/* Input para nueva contraseña de usuario */}
              <InputContraseña
                label={FORM_LABELS.USER.NEW_PASSWORD}
                type="password"
                name="newPassword"
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
                name="newConfirm"
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
            </>
          }
        />
      </form>
    </>
  );
}

export default UsuarioEdit;
