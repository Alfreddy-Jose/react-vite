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
  div_style = "col-sm-6 col-xl-4",
  isMulti = false,
}) {
  // Adaptar las opciones al formato que espera react-select
  const selectOptions = options.map((option) => ({
    value: option[valueKey],
    label: option[labelKey],
    ...option,
  }));

  // Obtener el valor seleccionado actual
/*     const selectedOption = selectOptions.find(
    (opt) => opt.value === formik.values[name]
  ) || null; */

  // Manejo de valores para modo simple/múltiple
  const getSelectedValues = () => {
    if (isMulti) {
      return selectOptions.filter((opt) =>
        formik.values[name]?.includes(opt.value)
      );
    }
    return (
      selectOptions.find((opt) => opt.value === formik.values[name]) || null
    );
  };

  const handleChange = (selected) => {
    if (isMulti) {
      const values = selected ? selected.map((opt) => opt.value) : [];
      formik.setFieldValue(name, values);
    } else {
      const value = selected ? selected.value : "";
      formik.setFieldValue(name, value);
    }
    formik.setFieldTouched(name, true, false);
  };

  return (
    <div className={div_style}>
      <label className="mt-4">{label}</label>
      <Select
        id={name}
        name={name}
        classNamePrefix="react-select"
        value={getSelectedValues()}
        options={selectOptions}
        isDisabled={disabled}
        placeholder={placeholder}
        onChange={handleChange}
        isMulti={isMulti}
        onBlur={() => formik.setFieldTouched(name, true, false)}
        isClearable
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger">{formik.errors[name]}</div>
      )}
    </div>
  );
}

export default SelectSearch;
