import React, { useEffect, useState } from "react";
import * as Yup from 'yup';
import { FORM_LABELS } from "../../constants/formLabels";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Api, { PutAll } from "../../services/Api";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { InputLabel } from "../../components/InputLabel";
import { Buttom } from "../../components/Buttom";


// Validando campos
const validationSchema = Yup.object({
  cedula_persona: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Solo números
    .required("Este campo es obligatorio"), // Campo requerido
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
});



function PersonaEdit() {
  const {id} = useParams();
  const navegation = useNavigate()
  const [personas, setPersona] = useState();



  // Funcion para enviar datos al backend
  const onSubmit = (values) => {
    console.log(values);
    PutAll(values, `/persona/${id}`, navegation);
    };

  const formik = useFormik({
    enableReinitialize: true,
    // Cargando los datos en los campos
    initialValues: {
      nombre: personas?.nombre || '',
      apellido: personas?.apellido || '',
      direccion: personas?.direccion || '',
      municipio: personas?.municipio || '',
      telefono: personas?.telefono || '',
      email: personas?.email || '',
      tipo_persona: personas?.tipo_persona || '',
      grado_inst: personas?.grado_inst || '',
    },
    validationSchema,
    onSubmit,
  });


  useEffect(() => {
    // Trayendo los datos del registro
    const getPersonas = async () => {
      const response = await Api.get(`persona/${id}`)
      setPersona(response.data);
    }

    getPersonas();

  }, [id]);



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
              {/* Input para direccion de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.ADRRE}
                type="text"
                name="direccion"
                placeholder="DIRECCIÓN"
                formik={formik}
              />
              {/* Input para municipio de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.MUNICIPIO}
                type="text"
                name="municipio"
                placeholder="MUNICIPIO"
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
              {/* Input para tipo de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.TYPE}
                type="text"
                name="tipo_persona"
                placeholder="TIPO PERSONA"
                formik={formik}
              />
              {/* Input para grado de la PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.GRADO}
                type="text"
                name="grado_inst"
                placeholder="GRADO INSTITUCIONAL"
                formik={formik}
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
            </>
          }
        />
      </form>
      );
    };


export default PersonaEdit;