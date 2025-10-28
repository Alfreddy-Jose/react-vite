import { Link } from "react-router-dom";

export function Create({
  path,
  style = "btn btn-primary mb-4",
  horario = false,
  position = "d-flex justify-content-end mb-4",
  positionHorario = "position-fixed mt-4 z-1 end-0 me-5 mb-4",
  text = "Nuevo",
  button = null,
}) {
  return (
    <div className={horario ? positionHorario : position}>
      {button}
      <Link className={`traslation ${style}`} to={path}>
        {text}
      </Link>
    </div>
  );
}
