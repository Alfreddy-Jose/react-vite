import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GetAll, PutAll } from "../../services/Api";
import { useNavigate, useParams } from "react-router-dom";
import style from "../../styles/roles.module.css";
import { InputLabel } from "../../components/InputLabel";
import { FORM_LABELS } from "../../constants/formLabels";
import { CardCheckbox, Checkbox } from "../../components/CardCheckbox";
import { Buttom } from "../../components/Buttom";
import React, { useEffect, useState } from "react";

const moduleSuffix = {
  usuario: "usuario",
  roles: "rol",
  pnf: "pnf",
  sede: "sede",
  lapso: "lapso",
  trayecto: "trayecto",
  matricula: "matricula",
  seccion: "seccion",
  turno: "turno",
  malla: "malla",
  coordinador: "coordinador",
};

// Validaciones para cada campo
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required("Este campo es obligatorio") // Campo obligatorio
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), // Solo letras
});

function RolesEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  //const [permisos, setPermisos] = useState();
  const [rol, setRol] = useState();
  const [enabledModules, setEnabledModules] = useState({});
  const [loading, setLoading] = useState(true);

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
      console.log(values);

      await PutAll(values, "/rol", navegation, id, "/roles");
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
    enableReinitialize: true, // Permite que los valores iniciales se actualicen cuando cambie el rol
    // Cargando los datos en los campos
    initialValues: {
      nombre: rol?.role.name || "",
      permisos: rol?.rolePermissions || [],
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    GetAll(setRol, setLoading, `/rol/${id}/edit`);
  }, [id]);
  console.log(loading);

  // Inicializa enabledModules según los permisos asignados al rol
  useEffect(() => {
    if (rol && rol.rolePermissions) {
      const initialEnabled = {};
      Object.entries(moduleSuffix).forEach(([modulo, sufijo]) => {
        initialEnabled[modulo] = rol.rolePermissions.includes(`ver ${sufijo}`);
      });
      setEnabledModules(initialEnabled);
    }
  }, [rol]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title={"EDITAR ROL"}
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
                      value="ver usuario"
                      formik={formik}
                      // Habilitado siempre
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("usuario")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver usuario")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear usuario"
                      formik={formik}
                      disabled={!isModuleEnabled("usuario")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar usuario"
                      formik={formik}
                      disabled={!isModuleEnabled("usuario")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar usuario"
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
                      value="ver rol"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("roles")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver rol")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear rol"
                      formik={formik}
                      disabled={!isModuleEnabled("roles")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar rol"
                      formik={formik}
                      disabled={!isModuleEnabled("roles")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar rol"
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
                      value="ver pnf"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("pnf")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver pnf")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear pnf"
                      formik={formik}
                      disabled={!isModuleEnabled("pnf")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar pnf"
                      formik={formik}
                      disabled={!isModuleEnabled("pnf")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar pnf"
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
                      value="ver sede"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("sede")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver sede")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear sede"
                      formik={formik}
                      disabled={!isModuleEnabled("sede")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar sede"
                      formik={formik}
                      disabled={!isModuleEnabled("sede")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar sede"
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
                      value="ver lapso"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("lapso")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver lapso")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear lapso"
                      formik={formik}
                      disabled={!isModuleEnabled("lapso")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar lapso"
                      formik={formik}
                      disabled={!isModuleEnabled("lapso")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar lapso"
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
                      value="ver trayecto"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("trayecto")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver trayecto")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear trayecto"
                      formik={formik}
                      disabled={!isModuleEnabled("trayecto")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar trayecto"
                      formik={formik}
                      disabled={!isModuleEnabled("trayecto")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar trayecto"
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
                      value="ver matricula"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("matricula")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver matricula")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear matricula"
                      formik={formik}
                      disabled={!isModuleEnabled("matricula")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar matricula"
                      formik={formik}
                      disabled={!isModuleEnabled("matricula")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar matricula"
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
                      value="ver seccion"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("seccion")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver seccion")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear seccion"
                      formik={formik}
                      disabled={!isModuleEnabled("seccion")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar seccion"
                      formik={formik}
                      disabled={!isModuleEnabled("seccion")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar seccion"
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
                      value="ver turno"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("turno")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver turno")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear turno"
                      formik={formik}
                      disabled={!isModuleEnabled("turno")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar turno"
                      formik={formik}
                      disabled={!isModuleEnabled("turno")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar turno"
                      formik={formik}
                      disabled={!isModuleEnabled("turno")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="MALLA DEL PNF"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="ver malla"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("malla")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("ver malla")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear malla"
                      formik={formik}
                      disabled={!isModuleEnabled("malla")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar malla"
                      formik={formik}
                      disabled={!isModuleEnabled("malla")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar malla"
                      formik={formik}
                      disabled={!isModuleEnabled("malla")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="COORDINADOR MUNICIPAL"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="ver coordinador"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("coordinador")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes(
                        "ver coordinador"
                      )}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="crear coordinador"
                      formik={formik}
                      disabled={!isModuleEnabled("coordinador")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="editar coordinador"
                      formik={formik}
                      disabled={!isModuleEnabled("coordinador")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="eliminar coordinador"
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

export default RolesEdit;
