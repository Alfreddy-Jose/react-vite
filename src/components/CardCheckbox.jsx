import style from "../styles/roles.module.css";

export function CardCheckbox({ title, checkbox }) {
  return (
    <div className={style.modulo}>
      <h3>{title}</h3>
      {checkbox}
    </div>
  );
}

export function Checkbox({
  label,
  name,
  value,
  formik,
  disabled = false,
  onChange, 
  ...props
}) {
  return ( 
    <label>
      <input
        type="checkbox"
        name={name}
        value={value} // <-- Aquí agregas el value
        checked={formik.values[name]?.includes(value)} // Asegúrate de que el valor sea booleano
        onChange={onChange ? onChange : formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={disabled}
        {...props}
      />{" "}
      {label}
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-danger">{formik.errors[name]}</div>
      )}
    </label>
  );
}
