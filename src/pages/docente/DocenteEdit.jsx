import React, { useEffect, useState } from "react";
import { FORM_LABELS } from "../../constants/formLabels";
import { InputLabel } from "../../components/InputLabel";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Api, { PutAll } from "../../services/Api";
import * as Yup from "yup";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { Buttom } from "../../components/Buttom";
import SelectSearch from "../../components/SelectSearch";

// Validando campos
const validationSchema = Yup.object({
  persona_id: Yup.number().required("Este campo es obligatorio"), // Campo requerido
  //.matches(/^[0-9]*$/, "Solo números permitidos") // Solo números
  pnf_id: Yup.number().required("Este campo es obligatorio"), // Campo obligatorio
  categoria: Yup.string().required("Este campo es obligatorio"), // Campo requerido
  fecha_inicio: Yup.date().required("Este campo es obligatorio"),
  fecha_fin: Yup.date().required("Este campo es obligatorio"),
  dedicacion: Yup.string().required("Este campo es obligatorio"),
  tipo: Yup.string().required("Este campo es obligatorio"),
});

function DocenteEdit() {
  const { id } = useParams();
  const [docente, setDocente] = useState();
  const navegation = useNavigate();
  const [dataSelect, setDataSelect] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      //calcular el campo horas de dedicacion si es tiempo completo 18 horas sino 12
      values.horas_dedicacion =
        values.dedicacion === "TIEMPO COMPLETO" ? 18 : 12;
      console.log("Horas de dedicacion: ", values.horas_dedicacion);
      console.log("Dedicacion: " + values.dedicacion);

      await PutAll(values, "/docente", navegation, id, "/docentes");
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
    enableReinitialize: true,
    initialValues: {
      persona_id: docente?.persona_id || "",
      pnf_id: docente?.pnf?.id || "",
      categoria: docente?.categoria || "",
      fecha_inicio: docente?.condicion_contrato?.fecha_inicio || "",
      fecha_fin: docente?.condicion_contrato?.fecha_fin || "",
      dedicacion: docente?.condicion_contrato?.dedicacion || "",
      tipo: docente?.condicion_contrato?.tipo || "",
      unidad_curricular_id: docente?.unidades_curriculares
        ? docente.unidades_curriculares.map((item) => item.id)
        : [],
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    // Trayendo los datos del registro
    const getDataSelect = async () => {
      const response = await Api.get(`/docente/getDataSelect`);
      setDataSelect(response.data);
    };

    // Trayendo los datos del registro
    const getDocente = async () => {
      const response = await Api.get(`/docente/${id}`);
      setDocente(response.data);
    };

    getDocente();

    getDataSelect();
  }, [id]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="EDITAR DOCENTE"
        link={
          <Create
            path="/docentes"
            text="Volver"
            style="btn btn-secondary mb-4"
          />
        }
        input={
          <>
            {/* Input oculto para pnf_id */}
            <InputLabel 
              hidden={true} 
              name="pnf_id" 
              formik={formik}
            />

            <SelectSearch
              label={FORM_LABELS.DOCENTE.BUSCAR}
              name="persona_id"
              options={dataSelect.docentesEdit}
              formik={formik}
              disabled={true}
              labelKey="nombre"
              placeholder="BUSCAR PERSONA"
            />

            {/* Input para PNF de DOCENTE */}
            {/*             <SelectSearch
              label={FORM_LABELS.DOCENTE.PNF}
              name="pnf_id"
              options={dataSelect.pnf}
              formik={formik}
              valueKey="id"
              labelKey="nombre"
              placeholder="SELECCIONE UNA OPCIÓN"
            /> */}
            {/* Input para CATEGORIA del DOCENTE */}
            <SelectSearch
              label="CATEGORÍA"
              name="categoria"
              options={[
                { id: 1, nombre: "ASISTENTE" },
                { id: 2, nombre: "INSTRUCTOR" },
              ]}
              formik={formik}
              valueKey="nombre"
              labelKey="nombre"
              placeholder="SELECCIONE UNA OPCIÓN"
            />
            {/* Campo de fecha inicio */}
            <InputLabel
              name="fecha_inicio"
              label={FORM_LABELS.DOCENTE.FECHA_INICIO}
              type="date"
              formik={formik}
            />
            {/* Campo fecha fin */}
            <InputLabel
              name="fecha_fin"
              label={FORM_LABELS.DOCENTE.FECHA_FIN}
              type="date"
              formik={formik}
            />
            {/* Select para la dedicacion */}
            <SelectSearch
              label={FORM_LABELS.DOCENTE.DEDICACIÓN}
              name="dedicacion"
              options={[
                { id: 1, nombre: "TIEMPO COMPLETO" },
                { id: 2, nombre: "MEDIO TIEMPO" },
              ]}
              formik={formik}
              valueKey="nombre"
              labelKey="nombre"
              placeholder="SELECCIONE UNA OPCIÓN"
            />
            {/* Select para el tipo */}
            <SelectSearch
              label={FORM_LABELS.DOCENTE.TIPO}
              name="tipo"
              options={[
                { id: 1, nombre: "FIJO" },
                { id: 2, nombre: "CONTRATADO" },
              ]}
              formik={formik}
              valueKey="nombre"
              labelKey="nombre"
              placeholder="SELECCIONE UNA OPCIÓN"
            />

            <SelectSearch
              label={`UNIDADES CURRICULARES`}
              name="unidad_curricular_id"
              options={dataSelect.unidadesCurriculares}
              isMulti={true}
              formik={formik}
              placeholder="SELECCIONE UNA O +OPCIONES"
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
              onClick={() => formik.resetForm()}
            />
          </>
        }
      />
    </form>
  );
}

export default DocenteEdit;
