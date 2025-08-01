import React, { useEffect } from "react";
import Select from "react-select";

export default function SelectControl({
  label,
  value,
  options,
  onChange,
  placeholder = "SELECCIONE UNA OPCIÓN",
  onValueChange,
  isClearable = true,
  classNamePrefix = "react-select",
  hidden = false,
  name,
}) {
  useEffect(() => {
    if (onValueChange && value) {
      onValueChange(value);
    }

  }, [value]);

  return (
    <div hidden={hidden} className="col-sm-6 col-xl-4">
      <label htmlFor={name} className="mt-4">
        {label}
      </label>
      <Select
        name={name}
        value={value}
        id={name}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        classNamePrefix={classNamePrefix}
        isClearable={isClearable}
      />
    </div>
  );
}
