import { Link } from "react-router-dom";
import styles from "../styles/Page404.module.css";
import error404 from "../img/404.svg";

function NotPage() {
  return (
    <>
      <div className={styles.error_page}>
        {/* Puedes reemplazar con el logo de Kiadmin o una imagen personalizada  */}
        <img src={error404} alt="Error 404" className={styles.error_image}/>

        {/* <div className={styles.error_code}>404</div> */}
        <h1 className={styles.error_message}>¡Página no encontrada!</h1>
        <p className={styles.error_description}>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
          Por favor, verifica la URL o navega usando el menú principal.
        </p>
        <Link to='/panel' className={styles.btn_kiadmin}>
          <i className="ki ki-home"></i> Volver al inicio
        </Link>
      </div>
    </>
  );
}

export default NotPage;
