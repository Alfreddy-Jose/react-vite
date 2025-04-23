
export function Navbar() {
  return (
    <div className="main-header">
      <div className="main-header-logo">
        {/* Logo Header */}
        <div className="logo-header" data-background-color="white">
          <a href="{{ route('dashboard') }}" className="logo">
            <img
              src="#"
              alt="navbar brand"
              className="navbar-brand"
              height="20"
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
                  <span className="op-7">Hola, </span>
                  <span className="fw-bold">Admin</span>
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
                        <h4>Admin</h4>
                        <p className="text-muted">Admin@gmail.com</p>
                        <a
                          href="#"
                          className="btn btn-xs btn-secondary btn-sm"
                        >
                          Ver Perfil
                        </a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-divider"></div>
                    <form
                      id="logout-form"
                      action="#"
                    >
                      @csrf
                      <a
                        className="dropdown-item"
                        href="#"
                      >
                        Finalizar Sesión
                      </a>
                    </form>
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
