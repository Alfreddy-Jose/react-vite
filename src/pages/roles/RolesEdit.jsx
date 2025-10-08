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
  coordinador: "coordinador",
  aula: "aula",
  laboratorio: "laboratorio",
  persona: "persona",
  vocero: "vocero",
  docente: "docente",
  universidad: "universidad",
  unidadCurricular: "unidad Curricular",
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
                title="LAPSO ACADÉMICO"
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
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="lapso.pdf"
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
                title="UNIDAD CURRICULAR"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="unidad Curricular.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("unidad Curricular")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes(
                        "unidad Curricular.ver"
                      )}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="unidad Curricular.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("unidad Curricular")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="unidad Curricular.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("unidad Curricular")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="unidad Curricular.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("unidad Curricular")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="unidad Curricular.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("unidad Curricular")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="TIPO MATRÍCULA"
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
                      checked={formik.values.permisos.includes(
                        "Tipo Matricula.ver"
                      )}
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
                      value="Tipo Matricula.pdf"
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
                title="AULA"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="aula.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("aula")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("aula.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="aula.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("aula")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="aula.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("aula")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="aula.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("aula")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="aula.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("aula")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="LABORATORIO"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="laboratorio.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("laboratorio")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes(
                        "laboratorio.ver"
                      )}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="laboratorio.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("laboratorio")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="laboratorio.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("laboratorio")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="laboratorio.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("laboratorio")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="laboratorio.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("laboratorio")}
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
                      checked={formik.values.permisos.includes(
                        "coordinador.ver"
                      )}
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

              <CardCheckbox
                title="PERSONA"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="persona.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("persona")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("persona.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="persona.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("persona")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="persona.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("persona")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="persona.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("persona")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="persona.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("persona")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="DOCENTE"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="docente.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("docente")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("docente.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="docente.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("docente")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="docente.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("docente")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="docente.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("docente")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="docente.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("docente")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="VOCERO"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="vocero.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("vocero")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes("vocero.ver")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="vocero.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("vocero")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="vocero.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("vocero")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.ELIMINAR}
                      value="vocero.eliminar"
                      formik={formik}
                      disabled={!isModuleEnabled("vocero")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.PDF}
                      value="vocero.pdf"
                      formik={formik}
                      disabled={!isModuleEnabled("vocero")}
                    />
                  </>
                }
              />

              <CardCheckbox
                title="UNIVERSIDAD"
                checkbox={
                  <>
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.VER}
                      value="universidad.ver"
                      formik={formik}
                      disabled={false}
                      onChange={(e) => {
                        handleModuleToggle("universidad")(e);
                        formik.handleChange(e);
                      }}
                      checked={formik.values.permisos.includes(
                        "universidad.ver"
                      )}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.CREAR}
                      value="universidad.crear"
                      formik={formik}
                      disabled={!isModuleEnabled("universidad")}
                    />
                    <Checkbox
                      name="permisos"
                      label={FORM_LABELS.ROLES_PERMISOS.EDITAR}
                      value="universidad.editar"
                      formik={formik}
                      disabled={!isModuleEnabled("universidad")}
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
  );
}

export default RolesEdit;
