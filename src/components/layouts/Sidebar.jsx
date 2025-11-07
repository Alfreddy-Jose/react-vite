import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../img/PNF.svg";

export function Sidebar({ toggleSidebar, isSidebarMinimized }) {
  const location = useLocation(); // Hook para obtener la ruta actual
  // Función para verificar si la ruta actual coincide con el enlace
  const isActive = (path) => location.pathname === path;

  // Leer permisos del localStorage
  const permisos = JSON.parse(localStorage.getItem("permissions")) || [];

  return (
    <>
      <div className="sidebar toggled" data-background-color="dark">
        <div className="sidebar-logo">
          <div className="logo-header" data-background-color="dark">
            <a href="#" className="logo">
              <img
                src={logo}
                alt="navbar brand"
                className="navbar-brand logo_pnfi"
              />
            </a>
            <div className="nav-toggle">
              <button
                className="sidenav-toggler btn btn-toggle toggle-sidebar"
                onClick={toggleSidebar} // Llamar a la función toggleSidebar al hacer clic
              >
                <i
                  className={`gg-menu-${isSidebarMinimized ? "left" : "right"}`}
                ></i>
              </button>
            </div>
          </div>
        </div>
        <div className="sidebar-wrapper scrollbar scrollbar-inner">
          <div className="sidebar-content">
            <ul className="nav nav-secondary">
              <li className={`nav-item ${isActive("/") ? "active" : ""}`}>
                <Link to="/panel">
                  <i className="fas fa-home"></i>
                  <p>Dashboard</p>
                </Link>
              </li>
              {/* Usuarios y Roles */}
              <li className="nav-section">
                <span className="sidebar-mini-icon">
                  <i className="fa fa-ellipsis-h"></i>
                </span>
                <h4 className="text-section">Opciones</h4>
              </li>
              <li className="nav-item">
                {permisos.includes("usuario.ver") ||
                permisos.includes("rol.ver") ? (
                  <a data-bs-toggle="collapse" href="#usuarios">
                    <i className="fas fa-user-shield"></i>
                    <p>Control de Usuarios</p>
                    <span className="caret"></span>
                  </a>
                ) : null}
                <div className="collapse" id="usuarios">
                  <ul className="nav nav-collapse">
                    {permisos.includes("rol.ver") ? (
                      <li
                        className={`nav-item ${
                          isActive("/roles") ? "active" : ""
                        }`}
                      >
                        <Link to="/roles">
                          <span className="sub-item">Roles y Permisos</span>
                        </Link>
                      </li>
                    ) : null}
                    {permisos.includes("usuario.ver") ? (
                      <li
                        className={`nav-item ${
                          isActive("/usuarios") ? "active" : ""
                        }`}
                      >
                        <Link to="/usuarios">
                          <span className="sub-item">Usuarios</span>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </li>
              <li className={`nav-item ${isActive("/lapsos") ? "active" : ""}`}>
                {permisos.includes("lapso.ver") ? (
                  <Link to="/lapsos">
                    <i className="fas fa-calendar-alt"></i>
                    <p>Lapso Académico</p>
                  </Link>
                ) : null}
              </li>
              <li className={`nav-item ${isActive("/sede") ? "active" : ""}`}>
                {permisos.includes("sede.ver") ? (
                  <Link to="/sede">
                    <i className="fas fa-map-marker-alt"></i>
                    <p>Sede</p>
                  </Link>
                ) : null}
              </li>
              <li className="nav-item">
                {permisos.includes("aula.ver") ||
                permisos.includes("laboratorio.ver") ? (
                  <a data-bs-toggle="collapse" href="#espacios">
                    <i className="fas fa-chalkboard-teacher"></i>
                    <p>Espacios</p>
                    <span className="caret"></span>
                  </a>
                ) : null}
                <div className="collapse" id="espacios">
                  <ul className="nav nav-collapse">
                    {permisos.includes("aula.ver") ? (
                      <li
                        className={`nav-item ${
                          isActive("/aula") ? "active" : ""
                        }`}
                      >
                        <Link to="/aula">
                          <span className="sub-item">Aulas</span>
                        </Link>
                      </li>
                    ) : null}
                    {permisos.includes("laboratorio.ver") ? (
                      <li
                        className={`nav-item ${
                          isActive("/laboratorio") ? "active" : ""
                        }`}
                      >
                        <Link to="/laboratorio">
                          <span className="sub-item">Laboratorios</span>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </li>
              <li
                className={`nav-item ${isActive("/secciones") ? "active" : ""}`}
              >
                {permisos.includes("seccion.ver") ? (
                  <Link to="/secciones">
                    <i className="fas fa-layer-group"></i>
                    <p>Secciones</p>
                  </Link>
                ) : null}
              </li>
              <li className="nav-item">
                {permisos.includes("persona.ver") ||
                permisos.includes("vocero.ver") ||
                permisos.includes("coordinador.ver") ||
                permisos.includes("docente.ver") ? (
                  <a data-bs-toggle="collapse" href="#persona">
                    <i className="fas fa-person"></i>
                    <p>Gestión de Personas</p>
                    <span className="caret"></span>
                  </a>
                ) : null}
                <div className="collapse" id="persona">
                  <ul className="nav nav-collapse">
                    {permisos.includes("persona.ver") ? (
                      <li
                        className={`nav-item ${
                          isActive("/persona") ? "active" : ""
                        }`}
                      >
                        <Link to="/persona">
                          <span className="sub-item">Crear persona</span>
                        </Link>
                      </li>
                    ) : null}
                    {permisos.includes("vocero.ver") ||
                    permisos.includes("coordinador.ver") ||
                    permisos.includes("docente.ver") ? (
                      <li>
                        <a data-bs-toggle="collapse" href="#tipos">
                          <span className="sub-item">Tipos</span>
                          <span className="caret"></span>
                        </a>
                        <div className="collapse" id="tipos">
                          <ul className="nav nav-collapse subnav">
                            {permisos.includes("coordinador.ver") ? (
                              <li
                                className={`nav-item ${
                                  isActive("/coordinador") ? "active" : ""
                                }`}
                              >
                                <Link to="/coordinador">
                                  <span className="sub-item">Coodinador</span>
                                </Link>
                              </li>
                            ) : null}
                            {permisos.includes("docente.ver") ? (
                              <li
                                className={`nav-item ${
                                  isActive("/docentes") ? "active" : ""
                                }`}
                              >
                                <Link to="/docentes">
                                  <span className="sub-item">Docente</span>
                                </Link>
                              </li>
                            ) : null}
                            {permisos.includes("vocero.ver") ? (
                              <li
                                className={`nav-item ${
                                  isActive("/voceros") ? "active" : ""
                                }`}
                              >
                                <Link to="/voceros">
                                  <span className="sub-item">Vocero</span>
                                </Link>
                              </li>
                            ) : null}
                          </ul>
                        </div>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </li>
              {permisos.includes("asistente.ver") ? (
                <li className="nav-item">
                  <a href="#">
                    <i className="fas fa-clipboard-check"></i>
                    <p>Asistentes Administrativo</p>
                  </a>
                </li>
              ) : null}
              {/* <li className="nav-item">
                {permisos.includes("ver estadisticas") && (permisos.includes("ver instrucciones") || permisos.includes("ver general")) ? (
                  <a data-bs-toggle="collapse" href="#estadisticas">
                    <i className="fas fa-person"></i>
                    <p>Estadísticas</p>
                    <span className="caret"></span>
                  </a>
                ) : null}
                <div className="collapse" id="estadisticas">
                  <ul className="nav nav-collapse">
                    {permisos.includes("ver instrucciones") ? (
                      <li>
                        <Link to="/estadistica_instruccion">
                          <span className="sub-item">Estadísticas de Instrucción</span>
                        </Link>
                      </li>
                    ) : null}
                    {permisos.includes("ver general") ? (
                      <li>
                        <Link to="/estadistica_general">
                          <span className="sub-item">Estadísticas General</span>
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              </li> */}
              {permisos.includes("pnf.ver") ||
              permisos.includes("Tipo Matricula.ver") ||
              permisos.includes("trayecto.ver") ||
              permisos.includes("unidad Curricular.ver") ||
              permisos.includes("turno.ver") ||
              permisos.includes("universidad.ver") ? (
                <li className="nav-item">
                  <a data-bs-toggle="collapse" href="#confg">
                    <i className="fas fa-gear"></i>
                    <p>Configuración</p>
                    <span className="caret"></span>
                  </a>
                  <div className="collapse" id="confg">
                    <ul className="nav nav-collapse">
                      {permisos.includes("pnf.ver") ? (
                        <li
                          className={`nav-item ${
                            isActive("/pnf") ? "active" : ""
                          }`}
                        >
                          <Link to="/pnf">
                            <span className="sub-item">PNF</span>
                          </Link>
                        </li>
                      ) : null}
                      {permisos.includes("Tipo Matricula.ver") ? (
                        <li
                          className={`nav-item ${
                            isActive("/matricula") ? "active" : ""
                          }`}
                        >
                          <Link to="/matricula">
                            <span className="sub-item">Tipo Matricula</span>
                          </Link>
                        </li>
                      ) : null}
                      {permisos.includes("trayecto.ver") ? (
                        <li
                          className={`nav-item ${
                            isActive("/trayectos") ? "active" : ""
                          }`}
                        >
                          <Link to="/trayectos">
                            <span className="sub-item">Trayectos</span>
                          </Link>
                        </li>
                      ) : null}
                      {permisos.includes("unidad Curricular.ver") ? (
                        <li
                          className={`nav-item ${
                            isActive("/unidad_curricular") ? "active" : ""
                          }`}
                        >
                          <Link to="/unidad_curricular">
                            <span className="sub-item">Unidad Curricular</span>
                          </Link>
                        </li>
                      ) : null}
                      {permisos.includes("turno.ver") ? (
                        <li
                          className={`nav-item ${
                            isActive("/turnos") ? "active" : ""
                          }`}
                        >
                          <Link to="/turnos">
                            <span className="sub-item">Turnos</span>
                          </Link>
                        </li>
                      ) : null}
                      {permisos.includes("universidad.ver") ? (
                        <li
                          className={`nav-item ${
                            isActive("/universidad") ? "active" : ""
                          }`}
                        >
                          <Link to="/universidad">
                            <span className="sub-item">Universidad</span>
                          </Link>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </li>
              ) : null}
              {permisos.includes("horario.ver") ||
              permisos.includes("horario_docente.ver") ? (
                <li className="nav-item">
                  <a data-bs-toggle="collapse" href="#horarios">
                    <i className="fa-solid fa-calendar"></i>
                    <p>Horarios</p>
                    <span className="caret"></span>
                  </a>
                  <div className="collapse" id="horarios">
                    <ul className="nav nav-collapse">
                      {permisos.includes("horario.ver") ? (
                        <li>
                          <Link to="/horarios">
                            <span className="sub-item">
                              Horarios por Sección
                            </span>
                          </Link>
                        </li>
                      ) : null}
                      {permisos.includes("horario_docente.ver") ? (
                        <li>
                          <Link to="/horarios/docente">
                            <span className="sub-item">
                              Horarios por Docente
                            </span>
                          </Link>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
