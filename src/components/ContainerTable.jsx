export function ContainerTable({ title, link, tabla }) {


  return (
    <div className="row">
      <div className="col-12">
        {link}
        <div className="card p-4">
          <div className="card-header">
            <div className="card-title">{`LISTA DE ${title}`}</div>
          </div>
          {tabla}
        </div>
      </div>
    </div>
  );
}
