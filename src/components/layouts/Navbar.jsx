import { useAuth } from "../../context/AuthContext";
import { LogoutButton } from "../Logout";
import logo from "../../img/logo_pnf.svg";
import { Link } from "react-router-dom";

export function Navbar() {
  const { user } = useAuth();

  return (
    <div className="main-header"> 
      <div className="main-header-logo">
        {/* Logo Header */}
        <div className="logo-header" data-background-color="dark">
          <a href="#" className="logo">
            <img
              src={logo}
              alt="navbar brand"
              className="navbar-brand ml-3 logo_pnfi"
            />
          </a>
          <div className="nav-toggle">
            <button className="btn btn-toggle toggle-sidebar">
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

      {/* Navbar Header */}
      <nav className="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
        <div className="container-fluid">
          <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex"></nav>

          <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
            <li className="nav-item topbar-user dropdown hidden-caret">
              <a
                className="dropdown-toggle profile-pic"
                data-bs-toggle="dropdown"
                href="#"
                aria-expanded="false"
              >
                <div className="avatar-sm">
                  <i className="fa fa-user icon-user"></i>
                </div>
                <span className="profile-username">
                  <span className="op-7">HOLA, </span>
                  <span className="fw-bold">{user?.name || ''}</span>
                </span>
              </a>
              <ul className="dropdown-menu dropdown-user animated fadeIn">
                <div className="dropdown-user-scroll scrollbar-outer">
                  <li>
                    <div className="user-box">
                      <div className="avatar-lg">
                        <i className="fa fa-user icon-user-bottom"></i>
                      </div>
                      <div className="u-text">
                        <h4>{user?.name || ''}</h4>
                        <p className="text-muted">{user?.email || ''}</p>
                        <Link 
                          to={`/usuario/${user?.id}/edit`}
                          className="btn btn-xs btn-secondary btn-sm">Ver Perfil</Link>
{/*                         <a
                          href="#"
                          className="btn btn-xs btn-secondary btn-sm"
                        >
                          Ver Perfil
                        </a> */}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-divider"></div>
                      <LogoutButton />
{/*                       <a
                        className="dropdown-item"
                        href="#"
                      >
                        Finalizar Sesión
                      </a> */}
                  </li>
                </div>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </div>
  );
}
