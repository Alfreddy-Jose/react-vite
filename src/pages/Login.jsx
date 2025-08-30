import { useFormik } from "formik";
import styles from "../styles/login.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Api from "../services/Api";
import { AlertaError } from "../components/Alert";
import { getCsrfToken } from "../services/auth";
import { useTogglePassword } from "../funciones";
import Swal from "sweetalert2";

export function Login() {
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { passwordType, togglePasswordVisibility } = useTogglePassword();
  const from = location.state?.from?.pathname || "/panel";

  const onSubmit = async (values) => {
    let cerrar = true;
    try {
      // obtener token Csrf
      await getCsrfToken();

      // Mostrando loader mientras se procesa
      Swal.fire({
        title: "Validando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Enviar las credenciales al backend
      const response = await Api.post("/login", values);

      // Si la autenticación es exitosa, guardar el usuario y redirigir
      if (response.status === 200) {
        signIn(response.data); // Guardar el usuario en el contexto y en localStorage
        navigate(
          from,
          { state: { message: response.data.message } },
          { replace: true }
        );

        window.location.reload(); // refresca la página
      }
    } catch (err) {
      // Manejar el error de autenticación
      if (err.response && err.response.status === 401) {
        AlertaError("Credenciales incorrectas");
      } else {
        console.error("Error inesperado:", err);
        AlertaError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
      cerrar = false; // Cambia a false si hay error
    } finally {
      // cerrar loader en caso de exito
      if (cerrar) {
        Swal.close();
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit,
  });

  return (
    <>
      <div className={styles.img}>
        <div className={styles.centrar}>
          <div className={styles.contenedor_login}>
            <form onSubmit={formik.handleSubmit}>
              <h1>Iniciar Sesión</h1>

              <div className={styles.input_box}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </div>

              <div className={styles.input_box}>
                <input
                  type={passwordType}
                  name="password"
                  id="pass"
                  autoComplete="off"
                  placeholder="Contraseña"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </div>

              <div className={styles.div_checkbox}>
                <label htmlFor="verPassword">
                  <input
                    type="checkbox"
                    id="verPassword"
                    className={styles.checkbox}
                    onClick={togglePasswordVisibility}
                  />{" "}
                  <span className="text-white">
                    {passwordType === "password"
                      ? "Mostrar Contraseña"
                      : "Ocultar Contraseña"}
                  </span>
                </label>
              </div>

              <div className={styles.input_box}>
                <button type="submit" className={styles.btn}>
                  Iniciar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
