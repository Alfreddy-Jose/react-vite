import React from "react";

function InputImage({
  imagePreview,
  formik,
  label,
  removeImage,
  name = "avatar",
  onChange,
  type = "avatar", // "avatar" o "logo"
}) {
  // Estilos según el tipo
  const getContainerStyle = () => {
    return type === "logo"
      ? {
          width: "150px",
          height: "120px",
          backgroundColor: "#ffffff",
          border: "2px solid #e9ecef",
          borderRadius: "8px",
        }
      : {
          width: "100px",
          height: "100px",
          backgroundColor: "#f8f9fa",
          border: "2px dashed #dee2e6",
          borderRadius: "50%",
        };
  };

  const getImageStyle = () => {
    return type === "logo"
      ? {
          width: "150px",
          height: "120px",
          objectFit: "contain",
          border: "2px solid #dee2e6",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          padding: "8px",
        }
      : {
          width: "100px",
          height: "100px",
          objectFit: "cover",
          border: "2px solid #dee2e6",
          borderRadius: "50%",
        };
  };

  const getPlaceholderText = () => {
    return type === "logo" ? "Sin logo" : "Sin imagen";
  };

  const getPlaceholderIcon = () => {
    return type === "logo" ? "🖼️" : "👤";
  };

  return (
    <div className="mt-4 col-6">
      <label className="form-label fw-bold">{label}</label>
      <div className="d-flex align-items-center">
        <div className="image-section me-4">
          {imagePreview ? (
            <div className="position-relative">
              <img
                src={imagePreview}
                alt="Preview"
                className={`${type}-preview`}
                style={getImageStyle()}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                onClick={removeImage}
                style={{
                  transform: "translate(50%, -50%)",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <div
              className={`${type}-placeholder d-flex flex-column align-items-center justify-content-center`}
              style={getContainerStyle()}
            >
              <span
                style={{
                  fontSize: type === "logo" ? "24px" : "20px",
                  marginBottom: "4px",
                }}
              >
                {getPlaceholderIcon()}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#6c757d",
                  textAlign: "center",
                }}
              >
                {getPlaceholderText()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-grow-1">
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif"
            name={name}
            onChange={onChange}
            className="form-control"
          />
          {formik && formik.touched[name] && formik.errors[name] && (
            <div className="text-danger small mt-1">{formik.errors[name]}</div>
          )}
          <div className="form-text">
            Formatos soportados: JPEG, PNG, GIF. Tamaño máximo: 2MB
            {type === "logo" && " (Recomendado: relación 5:4)"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputImage;
