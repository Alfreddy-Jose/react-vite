import styles from "../styles/login.module.css";

export function Login() {
  return (
    <>
    <div className={styles.img}>

      <div className={styles.centrar}>
        <div className={styles.contenedor_login}>

            {/* Session Status */}
            <form method="POST" action="">

                <h1>Inicio Sesión</h1>

                <div className={styles.input_box}>
                    <input type="text" placeholder="Email" name="email" />
                </div>

                <div className={styles.input_box}>
                    <input type="password" placeholder="Contraseña" name="password" />
                </div>

                <div className={styles.input_box}>
                    <button type="submit" className={styles.btn}>Iniciar</button>
                </div>
            </form>
        </div>
    </div>
    </div>
    </>
  );
}
