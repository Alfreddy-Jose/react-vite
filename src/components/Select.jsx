function Select({
  name,
  label,
  options = [],
  formik,
  valueKey = "id",
  labelKey = "nombre",
  disabled = false,
}) {
  return (
    <div className="col-sm-6 col-xl-4">
      <label className="mt-4">{label}</label>
      <select
        id={name}
        className="form-control"
        name={name}
        value={formik.values[name] ?? ""}
        disabled={disabled}
        onChange={(e) => {
          const selectedValue = e.target.value;
          formik.setFieldValue(name, selectedValue);
          formik.setFieldTouched(name, true, false);
        }}
      >
        <option value="" disabled>
          SELECCIONE UNA OPCIÓN
        </option>
        {options.map((option) => (
          <option key={option[valueKey]} value={option[valueKey]}>
            {option[labelKey]}
          </option>
        ))}
      </select>
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger">{formik.errors[name]}</div>
      )}
    </div>
  );
}

export default Select;
