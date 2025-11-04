import { Link } from "react-router-dom";

export function Create({
  path,
  style = "btn btn-primary mb-4",
  position = "d-flex justify-content-end mb-4",
  text = "Nuevo",
  button = null,
}) {
  return (
    <div className={position}>
      {button}
      <Link className={`traslation ${style}`} to={path}>
        {text}
      </Link>
    </div>
  );
}
