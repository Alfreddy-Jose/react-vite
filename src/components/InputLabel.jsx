import { useTogglePassword } from "../funciones";

export function InputLabel({
  type,
  name,
  placeholder,
  label,
  formik,
  disabled = false,
}) {
  return (
    <div className="col-sm-6 col-xl-4">
      <label htmlFor={name} className="mt-4">
        {label}
      </label>
      <input
        className={`form-control ${
          formik.touched[name] && formik.errors[name] ? "border-danger" : ""
        }`}
        type={type}
        name={name}
        id={name}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => {
          const upperCaseValue = e.target.value.toUpperCase();
          formik.setFieldValue(name, upperCaseValue);
          formik.setFieldTouched(name, true, false);
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

export function InputContraseña({
  //type = "password",
  name,
  placeholder,
  label,
  formik,
  disabled = false,
  eye = false,
}) {
  const { passwordType, togglePasswordVisibility } = useTogglePassword();

  return (
    <div className="col-sm-6 col-xl-4">
      <label htmlFor={name} className="mt-4">
        {label}
      </label>
      <div className="formulario__grupo-input">
        {eye ? (
          <div className="position-relative">
            <button
              type="button"
              className="position-absolute end-0 z-5 btn text-dark"
              id={`ojo${name}`}
              tabIndex={-1}
              onClick={togglePasswordVisibility}
            >
              <i className="fa-regular fa-eye fa-fade"></i>
            </button>
          </div>
        ) : null}
        <input
          className={`form-control ${
            formik.touched[name] && formik.errors[name] ? "border-danger" : ""
          }`}
          type={passwordType}
          name={name}
          id={name}
          disabled={disabled}
          placeholder={placeholder}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
          autoComplete="off"
        />
      </div>
      {formik.touched[name] && formik.errors[name] ? (
        <div className="text-danger">{formik.errors[name]}</div>
      ) : null}
    </div>
  );
}
