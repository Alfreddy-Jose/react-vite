import { FORM_LABELS } from "../../constants/formLabels";
import { InputLabel } from "../../components/InputLabel";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Api, { PostAll } from "../../services/Api";
import * as Yup from "yup";
import { ContainerIput } from "../../components/ContainerInput";
import { Create } from "../../components/Link";
import { Buttom } from "../../components/Buttom";
import SelectSearch from "../../components/SelectSearch";
import { TextAreaLabel } from "../../components/TextAreaLabel";
import { useState } from "react";

const initialValues = {
  cedula_persona: "",
  nombre: "",
  apellido: "",
  direccion: "",
  municipio: "",
  telefono: "",
  email: "",
  tipo_persona: "",
  grado_inst: "",
};
// Validando campos
const validationSchema = Yup.object({
  cedula_persona: Yup.string()
    .matches(/^[0-9]*$/, "Solo números permitidos") // Solo números
    .max(8, "Máximo 8 números")
    .min(7, "Mínimo 7 números")
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
  email: Yup.string().email("Correo no válido"),
  //.required("Este campo es obligatorio"),
  tipo_persona: Yup.string().required("Este campo es obligatorio"), // Campo requerido
  grado_inst: Yup.string().required("Este campo es obligatorio"), // Campo requerido
});

function PersonaCreate() {
  const navegation = useNavigate();
  const [excelFile, setExcelFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importErrors, setImportErrors] = useState([]);

  // Funcion para enviar datos al backend
  const onSubmit = async (values, { setErrors }) => {
    try {
      await PostAll(values, "/persona", navegation);
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

  // Función para manejar la selección del archivo Excel
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validar que sea un archivo Excel
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.oasis.opendocument.spreadsheet",
      ];

      if (
        !validTypes.includes(selectedFile.type) &&
        !selectedFile.name.match(/\.(xls|xlsx|ods)$/)
      ) {
        setImportMessage(
          "Por favor, sube un archivo Excel válido (.xls, .xlsx)"
        );
        setExcelFile(null);
        return;
      }

      setExcelFile(selectedFile);
      setImportMessage("");
      setImportErrors([]);
    }
  };

  // Función para importar el archivo Excel
  const handleImportExcel = async () => {
    if (!excelFile) {
      setImportMessage("Por favor, selecciona un archivo Excel");
      return;
    }

    setUploading(true);
    setImportMessage("");
    setImportErrors([]);

    const formData = new FormData();
    formData.append("excel_file", excelFile);

    try {
      const response = await Api.post("/api/import-personas", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setImportMessage(`Subiendo archivo: ${progress}%`);
        },
      });

      setImportMessage(
        `¡Importación exitosa! ${
          response.data.imported_count || 0
        } personas importadas correctamente.`
      );

      // Mostrar errores si existen
      if (response.data.errors && response.data.errors.length > 0) {
        setImportErrors(response.data.errors);
      }

      // Limpiar archivo después de importar
      setExcelFile(null);
      document.getElementById("excel-file").value = "";

      // Recargar la página después de 2 segundos para ver los nuevos registros
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al importar archivo:", error);

      if (error.response && error.response.data) {
        setImportMessage(
          `Error: ${
            error.response.data.message || "Error al procesar el archivo"
          }`
        );

        if (error.response.data.errors) {
          setImportErrors(
            Array.isArray(error.response.data.errors)
              ? error.response.data.errors
              : [error.response.data.errors]
          );
        }
      } else {
        setImportMessage("Error al procesar el archivo Excel");
      }
    } finally {
      setUploading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <ContainerIput
          title="NUEVA PERSONA"
          link={
            <Create
              path="/persona"
              text="Volver"
              style="btn btn-secondary mb-4"
            />
          }
          importar={
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title">IMPORTAR PERSONAS DESDE EXCEL</h5>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="excel-file" className="form-label">
                        SELECCIONAR ARCHIVO EXCEL
                      </label>
                      <input
                        id="excel-file"
                        type="file"
                        accept=".xls,.xlsx,.ods"
                        onChange={handleFileChange}
                        className="form-control"
                        disabled={uploading}
                        aria-label="Seleccionar archivo Excel"
                      />
                      <div className="form-text">
                        FORMATOS ACEPTADOS: .xls, .xlsx, .ods
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2 mb-3 align-items-center">
                      <button
                        type="button"
                        onClick={handleImportExcel}
                        disabled={uploading || !excelFile}
                        className="btn btn-success traslation"
                        aria-disabled={uploading || !excelFile}
                      >
                        {uploading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Importando...
                          </>
                        ) : (
                          "Importar Excel"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {importMessage && (
                  <div
                    className={`alert ${
                      importMessage.includes("éxito") ||
                      importMessage.includes("exitosa")
                        ? "alert-success"
                        : importMessage.includes("Error")
                        ? "alert-danger"
                        : "alert-info"
                    } mt-3`}
                  >
                    {importMessage}
                  </div>
                )}

                {importErrors.length > 0 && (
                  <div className="alert alert-warning mt-3">
                    <h6 className="alert-heading">
                      Errores en la importación:
                    </h6>
                    <ul className="mb-0">
                      {importErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          }
          input={
            <>
              {/* Input para CEDULA de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.CEDULA}
                type="text"
                name="cedula_persona"
                placeholder="INGRESE CÉDULA"
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
              {/* Input para grado de la PERSONA */}
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
              {/* Input para municipio de PERSONA */}
              <InputLabel
                label={FORM_LABELS.PERSONAS.MUNICIPIO}
                type="text"
                name="municipio"
                placeholder="MUNICIPIO"
                formik={formik}
              />
              {/* Input para direccion de PERSONA */}
              <TextAreaLabel
                name="direccion"
                label={FORM_LABELS.PERSONAS.ADRRE}
                placeholder="SAN JUAN DE LOS MORROS, CALLE 1 CASA 2"
                formik={formik}
                rows={3}
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
                onClick={() => formik.resetForm()}
              />
            </>
          }
        />
      </form>
    </div>
  );
}

export default PersonaCreate;
