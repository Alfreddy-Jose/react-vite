
function LapsoSelector({
  name,
  label,
  options = [],
  formik,
  valueKey = "id",
  labelKey = "nombre",
  placeholder = "SELECCIONE UNA OPCIÓN",
  }) {
// Adaptar las opciones al formato que espera react-select
  const selectOptions = options.map((option) => ({
    value: option[valueKey],
    label: option[labelKey],
    ...option,
  }));

  // Obtener el valor seleccionado actual
    const selectedOption = selectOptions.find(
    (opt) => opt.value === formik.values[name]
  ) || null;



  const handleChange = (selected) => {
    if (selected) {
      const value = selected ? selected.value : "";
      formik.setFieldValue(name, value);
    }
    formik.setFieldTouched(name, true, false);
  };

  return (
    <>
      <label className="mt-4">{label}</label>
      <Select
        id={name}
        name={name}
        classNamePrefix="react-select"
        value={selectedOption}
        options={selectOptions}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={() => formik.setFieldTouched(name, true, false)}
        isClearable
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </>
  );
}

export default LapsoSelector;