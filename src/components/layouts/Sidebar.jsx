import React from "react";
import { Link, useLocation} from "react-router-dom";


export function Sidebar({toggleSidebar, isSidebarMinimized}) {

  const location = useLocation(); // Hook para obtener la ruta actual
  // Función para verificar si la ruta actual coincide con el enlace
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="sidebar toggled" data-background-color="dark">
        <div className="sidebar-logo">
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
                className="sidenav-toggler btn btn-toggle toggle-sidebar"
                onClick={toggleSidebar} // Llamar a la función toggleSidebar al hacer clic
              >
                <i className={`gg-menu-${isSidebarMinimized ? "left" : "right"}`}></i>
              </button>
            </div>
          </div>
        </div>
        <div className="sidebar-wrapper scrollbar scrollbar-inner">
          <div className="sidebar-content">
            <ul className="nav nav-secondary">
              <li className={`nav-item ${isActive("/panel") ? "active" : ""}`}>
                <Link to="/panel">
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

              <li className={`nav-item ${isActive("/usuarios") ? "active" : ""}`}>
                <Link to="/usuarios">
                  <i className="fas fa-users"></i>
                  <p>Usuarios</p>
                </Link>
              </li>

              <li className={`nav-item ${isActive("/roles") ? "active" : ""}`}>
                <Link to="/roles">
                  <i className="fas fa-user-shield"></i>
                  <p>Roles y Permisos</p>
                </Link>
              </li>

              <li className={`nav-item ${isActive("/pnf") ? "active" : ""}`}>
                <Link to="/pnf">
                  <i className="fas fa-book-open"></i>
                  <p>PNF</p>
                </Link>
              </li>

              <li className={`nav-item ${isActive("/sede") ? "active" : ""}`}>
                <Link to="/sede">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>Sede</p>
                </Link>
              </li>

              <li
                className={`nav-item ${
                  isActive("/lapso_academico") ? "active" : ""
                }`}
              >
                <Link to="/lapso_academico">
                  <i className="fas fa-calendar-alt"></i>
                  <p>Lapso Académico</p>
                </Link>
              </li>

              <li
                className={`nav-item ${
                  isActive("/tipo_matricula") ? "active" : ""
                }`}
              >
                <Link to="/tipo_matricula">
                  <i className="fas fa-clipboard-list"></i>
                  <p>Tipo Matricula</p>
                </Link>
              </li>

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

              <li className={`nav-item ${isActive("/bloques") ? "active" : ""}`}>
                <Link to="/bloques">
                  <i className="fas fa-stopwatch"></i>
                  <p>Bloques de horas</p>
                </Link>
              </li>

              <li className="nav-item">
                <a href="#">
                  <i className="fas fa-project-diagram"></i>
                  <p>Malla del PNF</p>
                </a>
              </li>

              <li className="nav-item">
                <a href="#">
                  <i className="fas fa-person"></i>
                  <p>Persona</p>
                </a>
              </li>

              <li className="nav-item">
                <a href="#">
                  <i className="fas fa-user-tie"></i>
                  <p>Coordinador Municipal</p>
                </a>
              </li>

              <li className="nav-item">
                <a href="#">
                  <i className="fas fa-clipboard-check"></i>
                  <p>Asistentes Administrativo</p>
                </a>
              </li>

              <li className="nav-item">
                <a href="#">
                  <i className="fas fa-bullhorn"></i>
                  <p>Voceros y Suplentes</p>
                </a>
              </li>

              <li className="nav-item">
                <a href="#">
                  <i className="fas fa-chart-line"></i>
                  <p>Estadísticas de Instrucción</p>
                </a>
              </li>

              <li className="nav-item">
                <a href="#">
                  <i className="fas fa-chart-bar"></i>
                  <p>Estadística de General</p>
                </a>
              </li>

              <li className="nav-item">
                <a data-bs-toggle="collapse" href="#confg">
                  <i className="fas fa-gear"></i>
                  <p>Configuración</p>
                  <span className="caret"></span>
                </a>
                <div className="collapse" id="confg">
                  <ul className="nav nav-collapse">
                    <li className={`nav-item ${isActive("/universidad") ? "active" : ""}`}>
                      <Link to="/universidad">
                        <span className="sub-item">Universidad</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
