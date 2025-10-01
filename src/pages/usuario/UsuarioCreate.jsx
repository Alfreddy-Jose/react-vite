import { useFormik } from "formik";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputContraseña, InputLabel } from "../../components/InputLabel";
import { FORM_LABELS } from "../../constants/formLabels";
import { Buttom } from "../../components/Buttom";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { GetAll, PostAll } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import SelectSearch from "../../components/SelectSearch";

// Inicializando los campos
const initialValues = {
  nombre: "",
  email: "",
  password: "",
  confirm: "",
  rol: "",
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
});

export function UsuarioCreate() {
  const navegation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = (values) => {
    PostAll(values, '/usuarios', navegation);
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
                value={formik.values.codigo}
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
                value={formik.values.codigo}
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
                value={formik.values.codigo}
                formik={formik}
              />
              <SelectSearch
                name='rol'
                label={FORM_LABELS.USER.ROL}
                options={roles}
                formik={formik}
                labelKey="name"
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
                onClick={() => formik.resetForm()}
              />
            </>
          }
        />
      </form>
    </>
  );
}
