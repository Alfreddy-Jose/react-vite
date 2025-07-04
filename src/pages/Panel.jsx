import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Alerta from "../components/Alert";
import { useLocation } from "react-router-dom";

export function Panel() {
    const { user } = useAuth();
    const location = useLocation();
      useEffect(() => {
    
        // Motrar Alerta al iniciar sesión
        if (location.state?.message) {
          Alerta(location.state.message);
        }
    
        // Limpiar el estado de navegacion para no mostrar el mensaje nuevamente
        window.history.replaceState({}, "");
      }, [location.state]);
      
    return (
      <>
        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
          <div>
            <h3 className="fw-bold mb-3">Dashboard</h3>
            <h6 className="op-7 mb-2">
              Bienvendo { user?.name } al sistema sobre creación de horarios
            </h6>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6 col-md-3">
            <div className="card card-stats card-round">
              <div className="card-body traslation">
                <div className="row align-items-center">
                  <div className="col-icon">
                    <div className="icon-big text-center icon-primary bubble-shadow-small">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                  <div className="col col-stats ms-3 ms-sm-0">
                    <div className="numbers">
                      <p className="card-category">Usuarios</p>
                      <h4 className="card-title">8</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3 ">
            <div className="card card-stats card-round">
              <div className="card-body traslation">
                <div className="row align-items-center">
                  <div className="col-icon">
                    <div className="icon-big text-center icon-info bubble-shadow-small">
                      <i className="fas fa-user-check"></i>
                    </div>
                  </div>
                  <div className="col col-stats ms-3 ms-sm-0">
                    <div className="numbers">
                      <p className="card-category">Docentes</p>
                      <h4 className="card-title">23</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card card-stats card-round">
              <div className="card-body traslation">
                <div className="row align-items-center">
                  <div className="col-icon">
                    <div className="icon-big text-center icon-success bubble-shadow-small">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                  </div>
                  <div className="col col-stats ms-3 ms-sm-0">
                    <div className="numbers">
                      <p className="card-category">Horarios</p>
                      <h4 className="card-title">15</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card card-stats card-round">
              <div className="card-body traslation">
                <div className="row align-items-center">
                  <div className="col-icon">
                    <div className="icon-big text-center icon-secondary bubble-shadow-small">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                  </div>
                  <div className="col col-stats ms-3 ms-sm-0">
                    <div className="numbers">
                      <p className="card-category">Sedes</p>
                      <h4 className="card-title">9</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}
