
export function InputLabel({
  type,
  name,
  placeholder,
  label,
  formik
}) {
  return (
    <div className="col-sm-6 col-xl-4">
      <label className="mt-4">{label}</label>
      <input
        className={ `form-control ${formik.touched[name] && formik.errors[name] ? "border-danger" : ""}`}
        // className={formik.touched[name] && formik.errors[name]}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={(e) => {
          formik.handleChange(e);
          formik.setFieldTouched(e.target.name, true, false);
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
