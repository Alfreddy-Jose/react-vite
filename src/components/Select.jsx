import React from "react";

function Select({ name, label, options, formik }) {
  return (
    <div className="col-sm-6 col-xl-4">
      <label className="mt-4">{label}</label>
      <select
        className="form-control"
        name={name}
        value = {formik.values[name]}
        onChange={(e) => {
          const selectedValue = e.target.value;
          formik.setFieldValue(name, selectedValue);
          formik.setFieldTouched(name, true, false);
        }}
      >
        <option value="" disabled>{label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
