import { useFormik } from "formik";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputContraseña, InputLabel } from "../../components/InputLabel";
import { FORM_LABELS } from "../../constants/formLabels";
import { Buttom } from "../../components/Buttom";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { GetAll, PostAllWithFile } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import SelectSearch from "../../components/SelectSearch";
import InputImage from "../../components/InputImage";

// Inicializando los campos
const initialValues = {
  nombre: "",
  email: "",
  password: "",
  confirm: "",
  rol: "",
  avatar: null,
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
    .min(6, "Minimo 6 caracteres")
    .required("Este campo es obligatorio"),
  confirm: Yup.string()
    .min(6, "Minimo 6 caracteres")
    .oneOf([Yup.ref("password"), undefined], "Las contraseñas no coinciden")
    .required("Este campo es obligatorio"),
  avatar: Yup.mixed()
    .nullable()
    .test("fileSize", "La imagen es muy pesada (máx. 2MB)", (value) => {
      if (!value) return true; // Opcional
      return value && value.size <= 2048 * 1024;
    })
    .test("fileType", "Formato no soportado (JPEG, PNG, GIF)", (value) => {
      if (!value) return true; // Opcional
      return (
        value && 
        ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
          value.type
        )
      );
    }),
});

export function UsuarioCreate() {
  const navegation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      const formData = new FormData();
      formData.append("nombre", values.nombre);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("password_confirmation", values.confirm); // importante para Laravel
      formData.append("rol", values.rol);

      if (values.avatar) {
        formData.append("avatar", values.avatar);
      }
      await PostAllWithFile(formData, "/usuarios", navegation);
      //await PostAll(formData, "/usuarios", navegation);
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
    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    GetAll(setRoles, setLoading, "/get_roles");
    setLoading(false);
  }, []);
  console.log(loading);

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
                value={formik.values.codigo}
                formik={formik}
              />
              {/* Input para contraseña de usuario */}
              <InputContraseña
                label={FORM_LABELS.USER.PASSWORD}
                type="password"
                name="password"
                placeholder="***********"
                onBlur={formik.handleBlur}
                value={formik.values.email}
                formik={formik}
                // Añadiendo el icono de ojo para mostrar/ocultar contraseña
                eye={true}
              />
              {/* Input para confirmar la contraseña de usuario */}
              <InputContraseña
                label={FORM_LABELS.USER.CONFIRM}
                type="password"
                name="confirm"
                placeholder="************"
                onBlur={formik.handleBlur}
                value={formik.values.password}
                formik={formik}
              />
              <SelectSearch
                name="rol"
                label={FORM_LABELS.USER.ROL}
                options={roles}
                formik={formik}
                labelKey="name"
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
                title="Guardar"
                text="Guardar"
              />
              <Buttom
                type="button"
                style="btn-secondary ms-1"
                title="Limpiar"
                text="Limpiar"
                onClick={() => {
                  formik.resetForm();
                  setAvatarPreview(null);
                }}
              />
            </>
          }
        />
      </form>
    </>
  );
}