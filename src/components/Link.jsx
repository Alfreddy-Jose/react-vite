import { Link } from "react-router-dom";

export function Create({
  path,
  style = "btn btn-primary mb-4",
  position = "d-flex justify-content-end",
  text = "Nuevo",
}) {
  return (
    <div className={position}>
      <Link className={style} to={path}>
        {text}
      </Link>
    </div>
  );
}
