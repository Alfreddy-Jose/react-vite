import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputContraseña, InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import { Create } from "../../components/Link";
import Api, { GetAll, PutAll, PutAllWithFile } from "../../services/Api";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FORM_LABELS } from "../../constants/formLabels";
import SelectSearch from "../../components/SelectSearch";
import InputImage from "../../components/InputImage";
import { useAuth } from "../../context/AuthContext";

// Utilidad para obtener la baseURL del backend (sin /api al final)
const getBackendBaseUrl = () => {
  let url = Api.defaults.baseURL || "";
  // Elimina /api si está al final
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  // Elimina barra final si existe
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
};

// Validando campos
const validationSchema = Yup.object({
  nombre: Yup.string().required("Este campo es obligatorio"),
  email: Yup.string()
    .email("Ingrese un email válido")
    .required("Este campo es obligatorio"),
  rol: Yup.string().required("Debes seleccionar una opción"),
  avatar: Yup.mixed()
    .test("fileSize", "La imagen es muy pesada (máx. 2MB)", (value) => {
      if (!value || typeof value === "string") return true; // No validar si es null o string (URL existente)
      return value && value.size <= 2048 * 1024;
    })
    .test("fileType", "Formato no soportado (JPEG, PNG, GIF)", (value) => {
      if (!value || typeof value === "string") return true; // No validar si es null o string (URL existente)
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          value.type
        )
      );
    }),
});

function UsuarioEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState();
  const [roles, setRoles] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const { updateUser, user: authUser } = useAuth();

  // Función para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      const formData = new FormData();
      formData.append("nombre", values.nombre);
      formData.append("email", values.email);
      formData.append("rol", values.rol);
      formData.append("_method", "PUT"); // Importante para Laravel en FormData

      // Si el usuario quiere eliminar el avatar, enviar el campo remove_avatar
      if (values.remove_avatar) {
        formData.append("remove_avatar", "1");
      }
      // Solo agregar avatar si es un archivo nuevo (no null, no string, no undefined)
      if (values.avatar && typeof values.avatar === "object") {
        formData.append("avatar", values.avatar);
      }
      // Si el valor es null o string, NO agregar el campo avatar (así el backend no lo recibe como null)

      await PutAllWithFile(
        formData,
        `/usuarios/${id}`,
        navegation,
        null,
        "/usuarios"
      );

      // Si el usuario editado es el mismo que el autenticado, actualizar el contexto
      if (authUser && String(authUser.id) === String(id)) {
        // Obtener los datos actualizados del usuario
        const response = await Api.get(`/usuario/${id}`);
        updateUser(response.data);
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const formikErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          formikErrors[key] = value[0];
        });
        setErrors(formikErrors);
      }
    }
  };

  // Manejar cambio de archivo de avatar
  const handleAvatarChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("avatar", file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar avatar seleccionado
  const handleRemoveAvatar = () => {
    formik.setFieldValue("avatar", null);
    setAvatarPreview(null);
    // También podrías enviar un campo para eliminar el avatar existente
    formik.setFieldValue("remove_avatar", true);

    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      nombre: usuarios?.name || "",
      email: usuarios?.email || "",
      rol: usuarios?.rol || "",
      avatar: usuarios?.avatar || null,
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getUsuarios = async () => {
      const response = await Api.get(`/usuario/${id}`);
      setUsuarios(response.data);

      // Establecer preview del avatar existente
      if (response.data.avatar) {
        setAvatarPreview(response.data.avatar);
      }
    };

    // Obteniendo roles
    GetAll(setRoles, setLoading, "/get_roles");
    getUsuarios();
    setLoading(false);
  }, [id]);

  // Sincronizar avatarPreview con el avatar original del usuario cargado
  useEffect(() => {
    if (usuarios?.avatar) {
      setAvatarPreview(`${getBackendBaseUrl()}/storage/${usuarios.avatar}`);
    } else {
      setAvatarPreview(null);
    }
  }, [usuarios]);

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
                value={formik.values.nombre}
                formik={formik}
              />
              {/* Input para email de usuario */}
              <InputLabel
                label={FORM_LABELS.USER.EMAIL}
                type="email"
                name="email"
                placeholder="INGRESE UN CORREO"
                onBlur={formik.handleBlur}
                value={formik.values.email}
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
              {/* Sección de Avatar */}
              <InputImage
                imagePreview={avatarPreview}
                formik={formik}
                label={FORM_LABELS.USER.AVATAR}
                removeImage={handleRemoveAvatar}
                name="avatar"
                onChange={handleAvatarChange}
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
                style="btn-secondary ms-1"
                title="Limpiar"
                text="Limpiar"
                onClick={() => {
                  formik.resetForm();
                  setAvatarPreview(usuarios?.avatar_url || null); // Restaurar preview original
                }}
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

  // Función para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PutAll(values, "/password", navegation, id, "/usuarios");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const formikErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          formikErrors[key] = value[0];
        });
        setErrors(formikErrors);
      }
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
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
                value={formik.values.current_password}
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
                value={formik.values.new_password}
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
                value={formik.values.new_password_confirmation}
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
                style="btn-secondary ms-1"
                title="Limpiar"
                text="Limpiar"
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
