import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Api, { PostAllWithFile, PutAllWithFile } from "../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import Alerta from "../../components/Alert";
import Spinner from "../../components/Spinner";
import { TextAreaLabel } from "../../components/TextAreaLabel";
import InputImage from "../../components/InputImage";

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

const validationSchema = Yup.object({
  rif_univ: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  nombre_univ: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") //Solo letras
    .required("Este campo es obligatorio"), // Campo obligatorio
  abreviado_univ: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), //Solo letras
  direccion: Yup.string().required("Este campo es obligatorio"), // Campo obligatorio
  logo: Yup.mixed()
    .nullable()
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

export function Universidad() {
  const [universidad, setUniversidad] = useState([]);
  const navegation = useNavigate();
  const location = useLocation();
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [logoPreview, setLogoPreview] = useState(null);
  const [initialValues, setInitialValues] = useState({
    rif_univ: "",
    nombre_univ: "",
    abreviado_univ: "",
    direccion: "",
    logo: null,
  });

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      // Enviando datos al backend y captando errores si no hay universidad
      if (universidad.length === 0) {
        const formData = new FormData();
        formData.append("rif_univ", values.rif_univ);
        formData.append("nombre_univ", values.nombre_univ);
        formData.append("abreviado_univ", values.abreviado_univ);
        formData.append("direccion", values.direccion);

        if (values.logo && typeof values.logo === "object") {
          formData.append("logo", values.logo);
        }
        await PostAllWithFile(formData, "/universidad", navegation);
      }
      // Si ya hay universidad, actualiza el registro
      else {
        const formData = new FormData();
        formData.append("rif_univ", values.rif_univ);
        formData.append("nombre_univ", values.nombre_univ);
        formData.append("abreviado_univ", values.abreviado_univ);
        formData.append("direccion", values.direccion);
        formData.append("_method", "PUT"); // Importante para Laravel en FormData

        // Si el usuario quiere eliminar el logo, enviar el campo remove_logo
        if (values.remove_logo) {
          formData.append("remove_logo", "1");
        }
        // Solo agregar logo si es un archivo nuevo (no null, no string, no undefined)
        if (values.logo && typeof values.logo === "object") {
          formData.append("logo", values.logo);
        }

        await PutAllWithFile(
          formData,
          `/universidad/${universidad[0].id}`,
          navegation,
          null,
          "/universidad"
        );
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Transforma los arrays de Laravel a strings para Formik
        const formikErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          formikErrors[key] = value[0];
        });
        setErrors(formikErrors);
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

  // Manejar cambio de archivo de logo
  const handleLogoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("logo", file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar logo seleccionado
  const handleRemoveLogo = () => {
    formik.setFieldValue("logo", null);
    // enviar un campo para eliminar el logo existente
    formik.setFieldValue("remove_logo", true);
    setLogoPreview(null);

    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  useEffect(() => {
    // Leer permisos cada vez que el componente se monta o el localStorage cambia
    const permisos = JSON.parse(localStorage.getItem("permissions")) || [];
    setPermisos(permisos);

    // Trayendo los datos del registro
    const getUniversidad = async () => {
      try {
        const response = await Api.get("/universidades");
        if (response.data.length > 0) {
          const univData = response.data[0];
          setInitialValues({
            rif_univ: univData.rif_univ || "",
            nombre_univ: univData.nombre_univ || "",
            abreviado_univ: univData.abreviado_univ || "",
            direccion: univData.direccion || "",
            logo: univData.logo || null,
          });

          // Establecer preview del logo existente
          if (univData.logo) {
            setLogoPreview(univData.logo);
          }
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

  // Sincronizar logoPreview con el logo original de la universidad cargada
  useEffect(() => {
    if (universidad.length > 0 && universidad[0]?.logo) {
      setLogoPreview(`${getBackendBaseUrl()}/storage/${universidad[0].logo}`);
    } else {
      setLogoPreview(null);
    }
  }, [universidad]);

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <Spinner />;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        /* cambiar title si ya hay universidad */
        title={
          universidad.length > 0
            ? "EDITAR UNIVERSIDAD"
            : "REGISTRAR UNIVERSIDAD"
        }
        input={
          <>
            {/* Input para rif de universidad */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.RIF}
              type="text"
              name="rif_univ"
              placeholder="RIF"
              formik={formik}
            />
            {/* Input para nombre de universidad */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.NAME}
              type="text"
              name="nombre_univ"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
            />
            {/* Input para nombre abreviado de universidad */}
            <InputLabel
              label={FORM_LABELS.UNIVERSIDAD.NAME_ABRE}
              type="text"
              name="abreviado_univ"
              placeholder="NOMBRE ABREVIADO"
              formik={formik}
            />
            {/* Input para direccion */}
            <TextAreaLabel
              name="direccion"
              placeholder="SANTA TERESA DE JESUS, AV. PRINCIPAL, CALLE 1, CASA 23"
              label={FORM_LABELS.UNIVERSIDAD.ADRRE}
              formik={formik}
              rows={3}
            />

            {/* Sección de Logo */}
            <InputImage
              imagePreview={logoPreview}
              formik={formik}
              label={FORM_LABELS.UNIVERSIDAD.LOGO}
              removeImage={handleRemoveLogo}
              name="logo"
              type="logo"
              onChange={handleLogoChange}
            />
          </>
        }
        // Botones para enviar y cancelar
        buttom={
          <>
            {/* cambiar texto a editar si ya hay universidad */}
            {(permisos.includes("universidad.crear") &&
              universidad.length <= 0) ||
            (permisos.includes("universidad.editar") &&
              universidad.length > 0) ? (
              <Buttom
                text={universidad.length > 0 ? "Editar" : "Guardar"}
                title={universidad.length > 0 ? "Editar" : "Guardar"}
                type="submit"
                style="btn btn-success"
              />
            ) : null}
            {(permisos.includes("universidad.crear") &&
              universidad.length <= 0) ||
            (permisos.includes("universidad.editar") &&
              universidad.length > 0) ? (
              <Buttom
                text="Limpiar"
                title="Limpiar"
                type="reset"
                style="btn btn-secondary ms-1"
                onClick={() => {
                  formik.resetForm();
                  // Restaurar preview original al limpiar - EXACTAMENTE COMO EN UsuarioEdit.jsx
                  if (universidad.length > 0 && universidad[0]?.logo) {
                    setLogoPreview(
                      `${getBackendBaseUrl()}/storage/${universidad[0].logo}`
                    );
                  } else {
                    setLogoPreview(null);
                  }
                }}
              />
            ) : null}
          </>
        }
      />
    </form>
  );
}
