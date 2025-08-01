import Spinner from "./Spinner";

export function ContainerTable({
  title,
  link,
  tabla,
  isLoading = false,
  header_parametros = null,
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
            <div className="card-title">{`LISTA DE ${title}`}</div>
          </div>
          {isLoading ? <Spinner /> : tabla}
        </div>
      </div>
    </div>
  );
}
