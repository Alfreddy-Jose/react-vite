import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faClock,
  faBook,
  faUserTie,
  faChalkboard,
} from "@fortawesome/free-solid-svg-icons";
import img from "../img/universitarios.jpg";
import { Footer } from "../components/layouts/Footer";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Encabezado con gradiente azul */}
      <header
        className="bg-primary text-white text-center py-5"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
        }}
      >
        <div className="container">
          <h1 className="fw-bold display-4 mb-3">
            Sistema de Gestión Académica
          </h1>
          <p className="lead fs-4">
            Optimiza la planificación de horarios para estudiantes y profesores
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow-1 py-5">
        <div className="container">
          {/* Sección de imagen y botón */}
          <div className="row align-items-center mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="rounded shadow overflow-hidden">
                <img
                  src={img}
                  alt="Estudiantes en campus universitario"
                  className="img-fluid"
                  style={{
                    objectFit: "cover",
                    height: "100%",
                    minHeight: "300px",
                  }}
                />
              </div>
            </div>
            <div className="col-lg-6 text-center text-lg-start">
              <h2 className="fw-bold mb-4">
                Bienvenido al sistema sobre gestión de horarios
              </h2>
              <p className="lead mb-4">
                Nuestra plataforma simplifica la administración académica,
                permitiendo una gestión eficiente de horarios, aulas y recursos
                educativos.
              </p>
              <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                <Link
                  to="/login"
                  className="btn btn-success btn-lg px-4 py-3 fw-bold traslation"
                >
                  <FontAwesomeIcon
                    icon={faClock}
                    className="me-2 fa-icon-fix"
                  />
                  Acceder al Sistema
                </Link>
              </div>
            </div>
          </div>

          {/* Tarjetas de características */}
          <div className="row g-4 py-5">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  size="lg"
                  className="text-primary mb-3"
                  style={{ fontSize: "2rem" }}
                />
                <h4 className="fw-bold mb-3">Gestión de Horarios</h4>
                <p className="text-muted">
                  Crea, modifica y optimiza horarios académicos de manera
                  intuitiva y sin conflictos.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4">
                <FontAwesomeIcon
                  icon={faBook}
                  size="lg"
                  className="text-success mb-3"
                  style={{ fontSize: "2rem" }}
                />
                <h4 className="fw-bold mb-3">Planificación Académica</h4>
                <p className="text-muted">
                  Organiza asignaturas, créditos y programas de estudio de forma
                  centralizada.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4">
                <FontAwesomeIcon
                  icon={faUserTie}
                  size="lg"
                  className="text-info mb-3"
                  style={{ fontSize: "2rem" }}
                />
                <h4 className="fw-bold mb-3">Asignación de Profesores</h4>
                <p className="text-muted">
                  Asigna docentes a cursos según disponibilidad y
                  especialización.
                </p>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm p-4">
                <FontAwesomeIcon
                  icon={faChalkboard}
                  size="lg"
                  className="text-warning mb-3"
                  style={{ fontSize: "2rem" }}
                />
                <h4 className="fw-bold mb-3">Control de Aulas</h4>
                <p className="text-muted">
                  Gestiona la disponibilidad de espacios físicos y recursos
                  educativos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <div className="text-dark">
        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
