import Spinner from "./Spinner";

export function ContainerTable({ title, link, tabla, isLoading = false }) {


  return (
    <div className="row">
      <div className="col-12">
        {link}
        <div className="card p-4">
          <div className="card-header">
            <div className="card-title">{`LISTA DE ${title}`}</div>
          </div>
          { isLoading ? <Spinner /> : tabla}
        </div>
      </div>
    </div>
  );
}
