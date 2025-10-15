import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FORM_LABELS } from "../../constants/formLabels";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Api, { PutAll } from "../../services/Api";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";
import Swal from "sweetalert2";
import SelectSearch from "../../components/SelectSearch";
import { TextAreaLabel } from "../../components/TextAreaLabel";

// Validando campos
const validationSchema = Yup.object({
  nombre: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // solo letras permitidas
    .required("Este campo es obligatorio"), // Campo obligatorio
  apellido: Yup.string()
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas") // solo letras permitidas
    .required("Este campo es obligatorio"), // Campo requerido
  direccion: Yup.string().required("Este campo es obligatorio"), // Campo requerido
  municipio: Yup.string().required("Este campo es obligatorio"), // Campo requerido
  telefono: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Solo números
    .required("Este campo es obligatorio") // Campo requerido
    .min(11, "Mínimo 11 números") // Mínimo 11 números
    .max(11, "Máximo 11 números"), // Máximo 11 números
  email: Yup.string()
    .email("Correo no válido")
    .required("Este campo es obligatorio"),
  tipo_persona: Yup.string()
    .required("Este campo es obligatorio") // Campo requerido
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), // solo letras permitidas
  grado_inst: Yup.string()
    .required("Este campo es obligatorio") // Campo requerido
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "Solo letras permitidas"), // solo letras permitidas
  estado_id: Yup.string().required("Este campo es obligatorio"),
  municipio_id: Yup.string().required("Este campo es obligatorio"),
});

function PersonaEdit() {
  const { id } = useParams();
  const navegation = useNavigate();
  const [personas, setPersona] = useState();
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  // Función para cargar municipios basados en el estado seleccionado
  const cargarMunicipios = async (estadoId) => {
    if (!estadoId) {
      setMunicipios([]);
      return;
    }

    setLoadingMunicipios(true);
    try {
      const response = await Api.get(`/sede/getMunicipios/${estadoId}`);
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error al cargar Municipios:", error);
      setMunicipios([]);
    } finally {
      setLoadingMunicipios(false);
    }
  };

  // Funcion para enviar datos al backend
  const onSubmit = async (values) => {
    PutAll(values, "/persona", navegation, id, "/persona");
  };

  const formik = useFormik({
    enableReinitialize: true,
    // Cargando los datos en los campos
    initialValues: {
      cedula_persona: personas?.cedula_persona || "",
      nombre: personas?.nombre || "",
      apellido: personas?.apellido || "",
      direccion: personas?.direccion || "",
      estado_id: personas?.municipio.estado.id_estado || "",
      municipio_id: personas?.municipio.id_municipio || "",
      telefono: personas?.telefono || "",
      email: personas?.email || "",
      tipo_persona: personas?.tipo_persona || "",
      grado_inst: personas?.grado_inst || "",
    },
    validationSchema,
    onSubmit,
  });

  // Efecto para cargar estados al montar el componente
  useEffect(() => {
    const getEstados = async () => {
      try {
        const response = await Api.get(`/sede/getEstados`);
        setEstados(response.data);
      } catch (error) {
        console.error("Error al cargar Estados:", error);
        setEstados([]);
      }
    };

    getEstados();
  }, []);

  useEffect(() => {
    // Trayendo los datos del registro
    const getPersonas = async () => {
      try {
        const response = await Api.get(`persona/${id}`);
        setPersona(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error(
          "Error al cargar los datos:",
          error.response?.data || error.message
        );
        Swal.fire({
          icon: "error",
          title: "ERROR...",
          text: "Error al cargar los datos",
          confirmButtonText: "Cerrar", // Cambia el texto del botón
          customClass: {
            confirmButton: "btn btn-danger", // Aplica clases personalizadas al botón
          },
          buttonsStyling: false, // Desactiva los estilos predeterminados de SweetAlert2
        });
      }
    };

    getPersonas();
  }, [id]);

  // Efecto para cargar municipios cuando cambia el estado seleccionado
  useEffect(() => {
    if (formik.values.estado_id) {
      cargarMunicipios(formik.values.estado_id);
    } else {
      setMunicipios([]);
      formik.setFieldValue("municipio_id", "");
    }
  }, [formik.values.estado_id]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <ContainerIput
        title="EDITAR PERSONA"
        link={
          <Create
            path="/persona"
            text="Volver"
            style="btn btn-secondary mb-4"
          />
        }
        input={
          <>
            {/* Input para cedula de PERSONA */}
            <InputLabel
              label={FORM_LABELS.PERSONAS.CEDULA}
              type="text"
              name="cedula_persona"
              placeholder="CÉDULA"
              disabled={true}
              formik={formik}
            />
            {/* Input para nombre de PERSONA */}
            <InputLabel
              label={FORM_LABELS.PERSONAS.NAME}
              type="text"
              name="nombre"
              placeholder="INGRESE UN NOMBRE"
              formik={formik}
            />
            {/* Input para apellido de PERSONA */}
            <InputLabel
              label={FORM_LABELS.PERSONAS.LASTNAME}
              type="text"
              name="apellido"
              placeholder="INGRESE UN APELLIDO"
              formik={formik}
            />
            {/* Input para telefono de PERSONA */}
            <InputLabel
              label={FORM_LABELS.PERSONAS.TELEFONO}
              type="text"
              name="telefono"
              placeholder="TELÉFONO"
              formik={formik}
            />
            {/* Input para correo de PERSONA */}
            <InputLabel
              label={FORM_LABELS.PERSONAS.EMAIL}
              type="email"
              name="email"
              placeholder="CORREO"
              formik={formik}
            />
            {/* Select para tipo de PERSONA */}
            <SelectSearch
              label={FORM_LABELS.PERSONAS.TYPE}
              name="tipo_persona"
              options={[
                { id: "ESTUDIANTE", nombre: "ESTUDIANTE" },
                { id: "DOCENTE", nombre: "DOCENTE" },
                { id: "ADMINISTRATIVO", nombre: "ADMINISTRATIVO" },
              ]}
              formik={formik}
            />
            {/* Select para grado de la PERSONA */}
            <SelectSearch
              label={FORM_LABELS.PERSONAS.GRADO}
              name="grado_inst"
              formik={formik}
              options={[
                { id: "INGENIERO", nombre: "INGENIERO" },
                { id: "LICENCIADO", nombre: "LICENCIADO" },
                { id: "DOCTOR", nombre: "DOCTOR" },
                { id: "TECNICO SUPERIOR", nombre: "TECNICO SUPERIOR" },
                { id: "BACHILLER", nombre: "BACHILLER" },
              ]}
            />
            {/* Select para estado */}
            <SelectSearch
              label={FORM_LABELS.SEDE.ESTADO}
              name="estado_id"
              placeholder="SELECCIONE UN ESTADO"
              options={estados}
              labelKey="estado"
              valueKey="id_estado"
              formik={formik}
            />

            {/* Select para municipio */}
            <SelectSearch
              label={FORM_LABELS.SEDE.MUNICIPIO}
              name="municipio_id"
              placeholder={
                !formik.values.estado_id
                  ? "PRIMERO SELECCIONE UN ESTADO"
                  : loadingMunicipios
                  ? "CARGANDO MUNICIPIOS..."
                  : municipios.length === 0
                  ? "NO HAY MUNICIPIOS"
                  : "SELECCIONE UN MUNICIPIO"
              }
              options={municipios}
              labelKey="municipio"
              valueKey="id_municipio"
              value={formik.values.municipio_id}
              formik={formik}
              disabled={
                !formik.values.estado_id ||
                loadingMunicipios ||
                municipios.length === 0
              }
            />
            {/* Input para direccion de PERSONA */}
            <TextAreaLabel
              label={FORM_LABELS.PERSONAS.ADRRE}
              name={"direccion"}
              placeholder="SAN JUAN DE LOS MORROS, CALLE 1 CASA 2"
              formik={formik}
              rows={3}
            />
          </>
        }
        // Botones para enviar
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

export default PersonaEdit;
