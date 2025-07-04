import Select from "react-select";

function SelectSearch({
  name,
  label,
  options = [],
  formik,
  valueKey = "id",
  labelKey = "nombre",
  disabled = false,
  placeholder = "SELECCIONE UNA OPCIÓN",
}) {
  // Adaptar las opciones al formato que espera react-select
  const selectOptions = options.map((option) => ({
    value: option[valueKey],
    label: option[labelKey],
  }));

  // Obtener el valor seleccionado actual
  const selectedOption = selectOptions.find(
    (opt) => opt.value === formik.values[name]
  ) || null;

  return (
    <div className="col-sm-6 col-xl-4">
      <label className="mt-4">{label}</label>
      <Select
        id={name}
        name={name}
        classNamePrefix="react-select"
        value={selectedOption}
        options={selectOptions}
        isDisabled={disabled}
        placeholder={placeholder}
        onChange={(selected) => {
          const value = selected ? selected.value : "";
          formik.setFieldValue(name, value);
          formik.setFieldTouched(name, true, false);
        }}
        onBlur={() => formik.setFieldTouched(name, true, false)}
        isClearable
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger">{formik.errors[name]}</div>
      )}
    </div>
  );
}

export default SelectSearch;
