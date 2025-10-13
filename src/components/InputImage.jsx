import React from "react";

function InputImage({
  imagePreview,
  formik,
  label,
  removeImage,
  name = "avatar",
  onChange,
}) {
  return (
    <div className="mt-4 col-6">
      <label className="form-label fw-bold">{label}</label>
      <div className="d-flex align-items-center">
        <div className="avatar-section me-4">
          {imagePreview ? (
            <div className="position-relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="avatar-preview rounded-circle"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  border: "2px solid #dee2e6",
                }}
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
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <div
              className="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "100px",
                height: "100px",
                backgroundColor: "#f8f9fa",
                border: "2px dashed #dee2e6",
                color: "#6c757d",
              }}
            >
              Sin imagen
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputImage;
