import { useFormik } from "formik";
import { Buttom } from "../../components/Buttom";
import { ContainerIput } from "../../components/ContainerInput";
import { InputLabel } from "../../components/InputLabel";
import { Create } from "../../components/Link";
import { FORM_LABELS } from "../../constants/formLabels";
import * as Yup from "yup";
import { PostAllWithFile } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InputImage from "../../components/InputImage";

const initialValues = {
  codigo: "",
  nombre: "",
  abreviado: "",
  abreviado_coord: "",
  logo: null,
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
      if (!value) return true; // Opcional
      return value && value.size <= 2048 * 1024;
    })
    .test("fileType", "Formato no soportado (JPEG, PNG, GIF, SVG)", (value) => {
      if (!value) return true; // Opcional
      return (
        value && 
        ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg+xml"].includes(value.type)
      );
    }),
});

export function PnfCreate() {
  const navegation = useNavigate();
  const [logoPreview, setLogoPreview] = useState(null);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {  
    try {
      const formData = new FormData();
      formData.append("codigo", values.codigo);
      formData.append("nombre", values.nombre);
      formData.append("abreviado", values.abreviado);
      formData.append("abreviado_coord", values.abreviado_coord);

      if (values.logo) {
        formData.append("logo", values.logo);
      }

      await PostAllWithFile(formData, "/pnf", navegation);
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
    setLogoPreview(null);
    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"][name="logo"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="NUEVO PNF"
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
              text="Guardar"
              title="Guardar"
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
                setLogoPreview(null);
              }}
            />
          </>
        }
      />
    </form>
  );
}