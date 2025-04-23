import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <>
        <div className="sidebar" data-background-color="dark">
          <div className="sidebar-logo">
            {/* Logo Header */}
            <div className="logo-header" data-background-color="white">
              <a href="#" className="logo">
                <img
                  src="#"
                  alt="navbar brand"
                  className="navbar-brand"
                  height="60"
                />
              </a>
              <div className="nav-toggle">
                <button
                  className={`sidenav-toggler btn btn-toggle toggle-sidebar`}
                >
                  <i className="gg-menu-right"></i>
                </button>
                <button className="btn btn-toggle sidenav-toggler">
                  <i className="gg-menu-left"></i>
                </button>
              </div>
              <button className="topbar-toggler more">
                <i className="gg-more-vertical-alt"></i>
              </button>
            </div>
            {/* End Logo Header */}
          </div>
          <div className="sidebar-wrapper scrollbar scrollbar-inner">
            <div className="sidebar-content">
              <ul className="nav nav-secondary">
                {/* Dashboard  */}
                <li className="nav-item active">
                  <Link to="/">
                    <i className="fas fa-home"></i>
                    <p>Dashboard</p>
                  </Link>
                </li>

                <li className="nav-section">
                  <span className="sidebar-mini-icon">
                    <i className="fa fa-ellipsis-h"></i>
                  </span>
                  <h4 className="text-section">Opciones</h4>
                </li>

                {/* Usuarios  */}
                <li className="nav-item">
                  <Link to="/usuarios">
                    <i className="fas fa-users"></i>
                    <p>Usuarios</p>
                  </Link>
                </li>

                {/* Roles y Permisos  */}
                <li className="nav-item">
                  <Link to="/panel">
                    <i className="fas fa-user-shield"></i>
                    <p>Roles y Permisos</p>
                  </Link>
                </li>

                {/* PNF */}
                <li className="nav-item">
                  <Link to="/pnf">
                    <i className="fas fa-book-open"></i>
                    <p>PNF</p>
                  </Link>
                </li>

                {/* Sede  */}
                <li className="nav-item">
                  <Link to="/sede">
                    <i className="fas fa-map-marker-alt"></i>
                    <p>Sede</p>
                  </Link>
                </li>

                {/* Lapso Academico */}
                <li className="nav-item">
                  <Link to="/lapso_academico">
                    <i className="fas fa-calendar-alt"></i>
                    <p>Lapso Académico</p>
                  </Link>
                </li>

                {/* Tipo Matricula */}
                <li className="nav-item">
                  <Link to="tipo_matricula">
                    <i className="fas fa-clipboard-list"></i>
                    <p>Tipo Matricula</p>
                  </Link>
                </li>

                {/* Secciones */}
                <li className="nav-item">
                  <a data-bs-toggle="collapse" href="#seccion">
                    <i className="fas fa-layer-group"></i>
                    <p>Secciones</p>
                    <span className="caret"></span>
                  </a>
                  <div className="collapse" id="seccion">
                    <ul className="nav nav-collapse">
                      <li>
                        <Link to="secciones">
                          <span className="sub-item">Secciones</span>
                        </Link>
                      </li>
                      <li>
                        <a href="#">
                          <span className="sub-item">Secciones por Sede</span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span className="sub-item">
                            Secciones por Trayecto
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* Espacios  */}
                <li className="nav-item">
                  <a data-bs-toggle="collapse" href="#espacios">
                    <i className="fas fa-chalkboard-teacher"></i>
                    <p>Espacios</p>
                    <span className="caret"></span>
                  </a>
                  <div className="collapse" id="espacios">
                    <ul className="nav nav-collapse">
                      <li>
                        <Link to="/aula">
                          <span className="sub-item">Aulas</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/laboratorio">
                          <span className="sub-item">Laboratorios</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* Bloques de horas */}
                <li className="nav-item">
                  <Link to="/bloques">
                    <i className="fas fa-stopwatch"></i>
                    <p>Bloques de horas</p>
                  </Link>
                </li>

                {/* Malla del PNF */}
                <li className="nav-item">
                  <a href="#">
                    <i className="fas fa-project-diagram"></i>
                    <p>Malla del PNF</p>
                  </a>
                </li>

                {/* Personas */}
                <li className="nav-item">
                  <a href="#">
                    <i className="fas fa-person"></i>
                    <p>Persona</p>
                  </a>
                </li>

                {/* Coordinador Municipal  */}
                <li className="nav-item">
                  <a href="#">
                    <i className="fas fa-user-tie"></i>
                    <p>Coordinador Municipal</p>
                  </a>
                </li>

                {/* Asistentes Administrativo  */}
                <li className="nav-item">
                  <a href="#">
                    <i className="fas fa-clipboard-check"></i>
                    <p>Asistentes Administrativo</p>
                  </a>
                </li>

                {/* Voceros y Suplentes  */}
                <li className="nav-item">
                  <a href="#">
                    <i className="fas fa-bullhorn"></i>
                    <p>Voceros y Suplentes</p>
                  </a>
                </li>

                {/* Estadísticas de Instrucción  */}
                <li className="nav-item">
                  <a href="#">
                    <i className="fas fa-chart-line"></i>
                    <p>Estadísticas de Instrucción</p>
                  </a>
                </li>

                {/* Estadística de General  */}
                <li className="nav-item">
                  <a href="#">
                    <i className="fas fa-chart-bar"></i>
                    <p>Estadística de General</p>
                  </a>
                </li>

                {/* Configuracion  */}
                <li className="nav-item">
                  <a data-bs-toggle="collapse" href="#confg">
                    <i className="fas fa-gear"></i>
                    <p>Configuración</p>
                    <span className="caret"></span>
                  </a>
                  <div className="collapse" id="confg">
                    <ul className="nav nav-collapse">
                      {/* Universidad  */}
                      <li className="nav-item">
                        <a href="#">
                          <span className="sub-item">Universidad</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      {/* End Sidebar */}
    </>
  );
}
