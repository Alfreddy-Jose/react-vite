export function InputLabel({
  type,
  name,
  placeholder,
  label,
  formik,
  disabled = false
}) {
  return (
    <div className="col-sm-6 col-xl-4">
      <label htmlFor={name} className="mt-4">{label}</label>
      <input
        className={`form-control ${formik.touched[name] && formik.errors[name] ? "border-danger" : ""}`}
        type={type}
        name={name}
        id={name}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          const upperCaseValue = e.target.value.toUpperCase(); // Convertir a mayúsculas
          formik.setFieldValue(name, upperCaseValue); // Actualizar el valor en Formik
          formik.setFieldTouched(name, true, false); // Marcar el campo como tocado
        }}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
      />
      {formik.touched[name] && formik.errors[name] ? (
        <div className="text-danger">{formik.errors[name]}</div>
      ) : null}
    </div>
  );
}
