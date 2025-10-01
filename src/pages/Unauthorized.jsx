import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="card shadow">
            <div className="card-body py-5">
              <div className="mb-4">
                <i className="fas fa-ban fa-4x text-danger"></i>
              </div>
              <h1 className="display-6 text-danger mb-3">Acceso Denegado</h1>
              <p className="text-muted mb-4">
                No tienes los permisos necesarios para acceder a esta página.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Link to="/panel" className="btn btn-primary me-md-2 traslation">
                  <i className="fas fa-home me-2"></i>
                  Ir al Dashboard
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-outline-secondary traslation"
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Volver Atrás
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
