import { useState } from "react";
import Api from "../../services/Api";

const ImportLaboratoriosModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importErrors, setImportErrors] = useState([]);

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
      const response = await Api.post("/import_laboratorios", formData, {
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

      if (response.data.success) {
        setImportMessage(response.data.message);

        // Limpiar formulario
        setExcelFile(null);
        document.getElementById("excel_file").value = "";

        // Llamar callback de éxito
        if (onImportSuccess) {
          onImportSuccess(response.data.imported_count);
        }

        // Cerrar modal después de 2 segundos si fue exitoso
        setTimeout(() => {
          if (response.data.errors && response.data.errors.length === 0) {
            onClose();
          }
        }, 2000);
      } else {
        setImportMessage(response.data.message);
        if (response.data.errors) {
          setImportErrors(response.data.errors);
        }
      }
    } catch (error) {
      console.error("Error al importar archivo:", error);

      if (error.response && error.response.data) {
        setImportMessage(
          error.response.data.message || "Error al procesar el archivo"
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

  // Función para descargar plantilla
  const downloadTemplate = async () => {
    try {
      const response = await Api.get("/descargar_plantilla_laboratorios", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "plantilla_laboratorios.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando plantilla:", error);
      setImportMessage("Error al descargar la plantilla");
    }
  };

  // Función para cerrar y limpiar el modal
  const handleClose = () => {
    setExcelFile(null);
    setImportMessage("");
    setImportErrors([]);
    setUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Importar Laboratorios desde Excel</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
              disabled={uploading}
            ></button>
          </div>

          <div className="modal-body">
            {/* Información de formato */}
            <div className="alert alert-info">
              <h6 className="alert-heading">Formato requerido:</h6>
              <p className="mb-1">
                El archivo Excel debe tener las siguientes columnas:
              </p>
              <ul className="mb-0">
                <li>
                  <strong>etapa</strong> (ej: A, B, C) - Máximo 1 carácter
                </li>
                <li>
                  <strong>sede</strong> (ej: SEDE CENTRAL, SEDE NORTE)
                </li>
                <li>
                  <strong>nombre</strong> (ej: SIMON BOLIVAR, EZEQUIEL ZAMORA)
                </li>
                <li>
                  <strong>abreviado</strong> (ej: SMB, EZQ)
                </li>
                <li>
                  <strong>equipos</strong> (ej: 101, 205, 310) - Solo números
                </li>
              </ul>
            </div>

            {/* Selección de archivo */}
            <div className="mb-3">
              <label htmlFor="excel_file" className="form-label">
                <strong>Seleccionar archivo Excel</strong>
              </label>
              <input
                id="excel_file"
                type="file"
                accept=".xls,.xlsx,.ods"
                onChange={handleFileChange}
                className="form-control"
                disabled={uploading}
              />
              <div className="form-text">
                Formatos aceptados: .xls, .xlsx, .ods (Tamaño máximo: 10MB)
              </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex gap-2 mb-3">
              <button
                type="button"
                onClick={handleImportExcel}
                disabled={uploading || !excelFile}
                className="btn btn-success"
              >
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Importando...
                  </>
                ) : (
                  "Importar Laboratorios"
                )}
              </button>

              <button
                type="button"
                onClick={downloadTemplate}
                disabled={uploading}
                className="btn btn-outline-danger"
              >
                Descargar Plantilla
              </button>

              <button
                type="button"
                onClick={handleClose}
                disabled={uploading}
                className="btn btn-secondary ms-auto"
              >
                Cancelar
              </button>
            </div>

            {/* Mensajes de resultado */}
            {importMessage && (
              <div
                className={`alert ${
                  importMessage.includes("éxito") ||
                  importMessage.includes("exitosa")
                    ? "alert-success"
                    : importMessage.includes("Error") ||
                      importMessage.includes("error")
                    ? "alert-danger"
                    : "alert-info"
                } mt-3`}
              >
                {importMessage}
              </div>
            )}

            {/* Lista de errores */}
            {importErrors.length > 0 && (
              <div className="alert alert-warning mt-3">
                <h6 className="alert-heading">Errores en la importación:</h6>
                <ul className="mb-0">
                  {importErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportLaboratoriosModal;
