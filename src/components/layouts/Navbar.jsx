import { useAuth } from "../../context/AuthContext";
import { LogoutButton } from "../Logout";
import logo from "../../img/PNF.svg";
import { Link } from "react-router-dom";
import LapsoSelector from "../LapsoSelect";
import Api from "../../services/Api";

const getBackendBaseUrl = () => {
  let url = Api.defaults.baseURL || "";
  // Elimina /api si está al final
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  // Elimina barra final si existe
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
};

export function Navbar() {
  const { user } = useAuth();

  const getAvatarUrl = (user) => {
    if (user.avatar) {
      // Si el avatar ya es una URL completa
      if (user.avatar.startsWith("http")) {
        return user.avatar;
      }
      // Si es una ruta relativa, construir la URL completa usando la baseURL del backend
      return `${getBackendBaseUrl()}/storage/${user.avatar}`;
    }
    // Avatar por defecto si no tiene
    return "/default-avatar.png"; // Asegúrate de tener esta imagen en tu public folder
  };
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
            {/* Select para lapsos */}
            <li>
              <div className="me-3">
                <label
                  htmlFor="lapso"
                  className="form-label text-center fw-bold mb-0"
                >
                  LAPSO ACADÉMICO
                </label>
                <LapsoSelector />
              </div>
            </li>
            {/* End Select */}

            <li className="nav-item topbar-user dropdown hidden-caret">
              <a
                className="dropdown-toggle profile-pic"
                data-bs-toggle="dropdown"
                href="#"
                aria-expanded="false"
              >
                <div className="avatar-sm">
                  <img
                    src={getAvatarUrl(user)}
                    alt={`Avatar de ${user.name}`}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      border: "2px solid #dee2e6",
                    }}
                    onError={(e) => {
                      // Si la imagen falla al cargar, mostrar una por defecto
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>
                <span className="profile-username">
                  <span className="op-7">HOLA, </span>
                  <span className="fw-bold">{user?.name || ""}</span>
                </span>
              </a>
              <ul className="dropdown-menu dropdown-user animated fadeIn">
                <div className="dropdown-user-scroll scrollbar-outer">
                  <li>
                    <div className="user-box">
                      <div className="avatar-lg">
                        <img
                          src={getAvatarUrl(user)}
                          alt={`Avatar de ${user.name}`}
                          className="avatar-img rounded"
                          onError={(e) => {
                            // Si la imagen falla al cargar, mostrar una por defecto
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                      <div className="u-text">
                        <h4>{user?.name || ""}</h4>
                        <p className="text-muted">{user?.email || ""}</p>
                        <Link
                          to={`/usuario/${user?.id}/edit`}
                          className="btn btn-xs btn-secondary btn-sm"
                        >
                          Ver Perfil
                        </Link>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-divider"></div>
                    <LogoutButton />
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
