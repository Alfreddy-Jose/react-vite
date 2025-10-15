import Spinner from "./Spinner";

export function ContainerTable({
  title,
  link,
  tabla,
  isLoading = false,
  header_parametros = null,
  button_pdf = null,
  button_modal = null,
}) {
  return (
    <div className="row">
      <div className="col-12">
        {link}
        <div className="card p-4">
          <div className="card-header">
            {header_parametros ? (
              <div className="card-title">BUSCAR POR:</div>
            ) : null}
            {header_parametros}
            {/* BOTON PDF */}
            {button_pdf}
            {button_modal}
            <div className="card-title mb-4">{`LISTA DE ${title}`}</div>
            {/* EL BUSCADOR AHORA ESTÁ INTEGRADO EN LA TABLA */}
          </div>
          {isLoading ? <Spinner /> : tabla}
        </div>
      </div>
    </div>
  );
}