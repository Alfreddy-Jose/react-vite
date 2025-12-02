import { useUniversityInfo } from "../../context/UniversityInfoContext";
import { toCapitalize } from "../../funciones";

export function Footer() {
  const { nombre_univ, loading, error } = useUniversityInfo();

  if (loading) {
    return <p>Cargando información universitaria...</p>;
  }

  if (error) {
    return <small>Error al cargar información</small>;
  }

  if (!nombre_univ) {
    return (
      <footer className="footer">
        <div className="container-fluid d-flex justify-content-between">
          <div className="copyright">
            2025, Desarrollado Por <a href="#">Vargas/Jaimes</a>.
          </div>
          <div>
            Distribuido por
            <a target="_blank" href="#">
              XXXXX
            </a>
            .
          </div>
        </div>
      </footer>
    );
  } else {
    return (
      // footer
      <footer className="footer">
        <div className="container-fluid d-flex justify-content-between">
          <div className="copyright">
            © 2025 {toCapitalize(nombre_univ)} - Todos los derechos reservados
          </div>
        </div>
      </footer>
    );
  }
}
