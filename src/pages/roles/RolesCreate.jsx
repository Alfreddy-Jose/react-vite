import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PostAll } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import style from "../../styles/roles.module.css";
import { InputLabel } from "../../components/InputLabel";
import { FORM_LABELS } from "../../constants/formLabels";
import { CardCheckbox, Checkbox } from "../../components/CardCheckbox";
import { Buttom } from "../../components/Buttom";
import React, { useState } from "react";

// Iniciando variables
const initialValues = {
  nombre: "",
  permisos: [],
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), // Solo letras
});

function RolesCreate() {
  const navegation = useNavigate();
  const [enabledModules, setEnabledModules] = useState({});

  // Función para manejar el cambio del primer checkbox de cada módulo
  const handleModuleToggle = (module) => (e) => {
    setEnabledModules((prev) => ({
      ...prev,
      [module]: e.target.checked,
    }));
    // Si desmarcas el primero, también desmarca los secundarios en formik
    if (!e.target.checked) {
      const permisosFiltrados = formik.values.permisos.filter(
        (permiso) => !permiso.includes(module) || permiso === `ver ${module}`
      );
      formik.setFieldValue("permisos", permisosFiltrados);
    }
  };

  // Helper para saber si el primer checkbox está activo
  const isModuleEnabled = (module) => !!enabledModules[module];

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/roles", navegation);
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
    initialValues,
    validationSchema,
    onSubmit,
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title={"NUEVO ROL"}
        link={
          <Create path="/roles" text="Volver" style="btn btn-secondary mb-4" />
        }
        input={
          <>
            <div className="card-header">
              <InputLabel
                label={FORM_LABELS.ROLES_PERMISOS.NOMBRE_ROL}
                type="text"
                name="nombre"
                placeholder="INGRESE NOMBRE DEL ROL"
                formik={formik}
              />
            </div>

            <div className={style.permisos}>
              <CardCheckbox
                title="USUARIO"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="usuario.ver"
                      formik={formik}
                      // Habilitado siempre
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("usuario")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("usuario.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="usuario.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("usuario")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="usuario.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("usuario")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="usuario.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("usuario")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="ROL"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="rol.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("roles")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("rol.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="rol.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("roles")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="rol.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("roles")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="rol.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("roles")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="PNF"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="pnf.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("pnf")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("pnf.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="pnf.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("pnf")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="pnf.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("pnf")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="pnf.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("pnf")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="pnf.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("pnf")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="SEDE"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="sede.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("sede")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("sede.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="sede.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("sede")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="sede.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("sede")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="sede.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("sede")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="sede.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("sede")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="LAPSO ACADEMICO"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="lapso.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("lapso")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("lapso.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="lapso.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("lapso")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="lapso.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("lapso")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="lapso.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("lapso")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ESTADO}
                      value="lapso.cambiar estado"
                      formik={formik}
                      disabled={!isModuleEnabled("lapso")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="lapso.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("lapso")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="TRAYECTOS"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="trayecto.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("trayecto")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("trayecto.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="trayecto.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("trayecto")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="trayecto.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("trayecto")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="trayecto.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("trayecto")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="TIPO MATRICULA"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="Tipo Matricula.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("matricula")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("Tipo Matricula.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="Tipo Matricula.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("matricula")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="Tipo Matricula.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("matricula")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="Tipo Matricula.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("matricula")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="matricula.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("matricula")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="SECCIONES"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="seccion.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("seccion")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("seccion.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="seccion.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("seccion")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="seccion.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("seccion")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="seccion.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("seccion")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="seccion.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("seccion")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="TURNO"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="turno.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("turno")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("turno.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="turno.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("turno")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="turno.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("turno")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="turno.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("turno")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="COORDINADOR"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="coordinador.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("coordinador")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("coordinador.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="coordinador.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("coordinador")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="coordinador.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("coordinador")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="coordinador.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("coordinador")}
                    />
                  </>
                }
              />
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
  );
}

export default RolesCreate;
