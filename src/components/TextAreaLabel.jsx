export function TextAreaLabel({
  name,
  placeholder,
  label,
  formik,
  disabled = false,
  hidden = false,
  rows = 4, // Nuevo prop para definir el número de filas
}) {
  return (
    <div hidden={hidden} className="col-sm-6 col-xl-4">
      <label htmlFor={name} className="mt-4">
        {label}
      </label>
      <textarea
        className={`form-control ${
          formik.touched[name] && formik.errors[name] ? "border-danger" : ""
        }`}
        name={name}
        id={name}
        hidden={hidden}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        rows={rows}
        onChange={(e) => {
          const upperCaseValue = e.target.value.toUpperCase();
          formik.setFieldValue(name, upperCaseValue);
          formik.setFieldTouched(name, true, false);
        }}
        onBlur={formik.handleBlur}
        value={formik.values[name]} // Siempre usar el valor de Formik
      />
      {formik.touched[name] && formik.errors[name] ? (
        <div className="text-danger">{formik.errors[name]}</div>
      ) : null}
    </div>
  );
}
