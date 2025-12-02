import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Api, { PutAllWithFile } from "../../services/Api";
import { useEffect, useState } from "react";
import InputImage from "../../components/InputImage";

// Utilidad para obtener la baseURL del backend
const getBackendBaseUrl = () => {
  let url = Api.defaults.baseURL || "";
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
};

// Validando campos
const validationSchema = Yup.object({
  nombre: Yup.string().required("Este campo es obligatorio"),
  codigo: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[0-9]*$/, "Solo números permitidos"),
  abreviado: Yup.string()
    .min(4, "Minimo 4 carácteres")
    .required("Este campo es obligatorio"),
  abreviado_coord: Yup.string()
    .min(3, "Minimo 3 carácteres")
    .required("Este campo es obligatorio"),
  logo: Yup.mixed()
    .nullable()
    .test("fileSize", "La imagen es muy pesada (máx. 2MB)", (value) => {
      if (!value || typeof value === "string") return true;
      return value && value.size <= 2048 * 1024;
    })
    .test("fileType", "Formato no soportado (JPEG, PNG, GIF, SVG)", (value) => {
      if (!value || typeof value === "string") return true;
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg+xml"].includes(value.type)
      );
    }),
});

function PnfEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [pnf, setPnf] = useState();
  const [logoPreview, setLogoPreview] = useState(null);
  // const [permisos, setPermisos] = useState([]);

  // Función para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      const formData = new FormData();
      formData.append("codigo", values.codigo);
      formData.append("nombre", values.nombre);
      formData.append("abreviado", values.abreviado);
      formData.append("abreviado_coord", values.abreviado_coord);
      formData.append("_method", "PUT"); // Importante para Laravel en FormData

      // Si el usuario quiere eliminar el logo, enviar el campo remove_logo
      if (values.remove_logo) {
        formData.append("remove_logo", "1");
      }
      
      // Solo agregar logo si es un archivo nuevo (no null, no string, no undefined)
      if (values.logo && typeof values.logo === "object") {
        formData.append("logo", values.logo);
      }

      await PutAllWithFile(formData, `/pnf/${id}`, navegation, null, "/pnf");
      
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

  // Manejar cambio de archivo de logo
  const handleLogoChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("logo", file);
      formik.setFieldValue("remove_logo", false); // Resetear la bandera de eliminar

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
    setLogoPreview(null);
    // Enviar campo para eliminar el logo existente
    formik.setFieldValue("remove_logo", true);

    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"][name="logo"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      codigo: pnf?.codigo || "",
      nombre: pnf?.nombre || "",
      abreviado: pnf?.abreviado || "",
      abreviado_coord: pnf?.abreviado_coord || "",
      logo: pnf?.logo || null,
      remove_logo: false,
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getPnf = async () => {
      try {
        const response = await Api.get(`pnf/${id}`);
        setPnf(response.data);
      } catch (error) {
        console.error("Error al cargar el PNF:", error);
      }
    };

    getPnf();
  }, [id]);

  // Sincronizar logoPreview con el logo original del PNF cargado
  useEffect(() => {
    if (pnf?.logo) {
      // Si el logo es una ruta relativa, construir la URL completa
      if (pnf.logo.startsWith('pnf_logos/')) {
        setLogoPreview(`${getBackendBaseUrl()}/storage/${pnf.logo}`);
      } else if (pnf.logo_url) {
        // Si viene la URL completa del backend
        setLogoPreview(pnf.logo_url);
      } else {
        // Si es solo el nombre del archivo
        setLogoPreview(`${getBackendBaseUrl()}/storage/pnf_logos/${pnf.logo}`);
      }
    } else {
      setLogoPreview(null);
    }
  }, [pnf]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="EDITAR PNF"
        link={
          <Create path="/pnf" text="Volver" style="btn btn-secondary mb-4" />
        }
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
            {/* Input para PNF abreviado coordinación */}
            <InputLabel
              label={FORM_LABELS.PNF.COORDINACION}
              type="text"
              name="abreviado_coord"
              placeholder="INGRESE ABREVIADO DE COORDINACIÓN"
              formik={formik}
            />

            {/* Sección de Logo */}
            <InputImage
              imagePreview={logoPreview}
              formik={formik}
              label={FORM_LABELS.PNF.LOGO}
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
            <Buttom
              text="Editar"
              title="Editar"
              type="submit"
              style="btn-success"
            />

            <Buttom
              text="Limpiar"
              title="Limpiar"
              type="button"
              style="btn-secondary ms-1"
              onClick={() => {
                formik.resetForm();
                // Restaurar preview original al limpiar
                if (pnf?.logo) {
                  if (pnf.logo.startsWith('pnf_logos/')) {
                    setLogoPreview(`${getBackendBaseUrl()}/storage/${pnf.logo}`);
                  } else if (pnf.logo_url) {
                    setLogoPreview(pnf.logo_url);
                  }
                } else {
                  setLogoPreview(null);
                }
                formik.setFieldValue("remove_logo", false);
              }}
            />
          </>
        }
      />
    </form>
  );
}

export default PnfEdit;