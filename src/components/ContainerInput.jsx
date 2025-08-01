// Container para Formularios
export function ContainerIput({ title, link, input, buttom }) {
  return (
    <div className="row">
      <div className="col-12">

        {/* Link para Volver */}
        {link}
        
        <div className="card p-4">

          {/* Titulo del Formulario  */}
          <div className="card-header">
            <div className="card-title">{title}</div>
          </div>

          {/* Inputs */}
          <div className="row">{input}</div>

          {/* Botones */}
          <div className="card-action mt-4 d-flex justify-content-start aling-content-center">
            {buttom}
          </div>
        </div>
      </div>
    </div>
  );
}
