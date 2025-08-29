import { useTogglePassword } from "../funciones";
import { useEffect } from "react"; // Importar useEffect

export function InputLabel({
  type,
  name,
  placeholder,
  label,
  formik,
  disabled = false,
  hidden = false,
  value // Nuevo prop opcional
}) {
  // Sincronizar el valor externo con Formik cuando cambie
  useEffect(() => {
    if (value !== undefined && value !== formik.values[name]) {
      formik.setFieldValue(name, value);
    }
  }, [value, name, formik]);

  return (
    <div hidden={hidden} className="col-sm-6 col-xl-4">
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
        hidden={hidden}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
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
