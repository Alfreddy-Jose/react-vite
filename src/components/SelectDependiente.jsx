import React, { useEffect } from "react";
import Select from "react-select";

export default function SelectControl({
  styles = '',
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
  disabled = false,
  className = "col-sm-6 col-xl-4",
}) {
  useEffect(() => {
    if (onValueChange && value) {
      onValueChange(value);
    }

  }, [value]);

  return (
    <div hidden={hidden} className={className}>
      <label htmlFor={name} className="mt-4">
        {label}
      </label>
      <Select
        isDisabled={disabled}
        name={name}
        value={value}
        styles={styles}
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
