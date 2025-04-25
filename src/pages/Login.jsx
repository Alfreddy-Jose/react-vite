

export function Login() {
  return (
    <>
      <div className="centrar">
        <div className="contenedor-login">

            {/* Session Status */}
            <form method="POST" action="">

                <h1>Inicio Sesión</h1>

                <div className="input-box">
                    <input type="text" placeholder="Email" name="email" />
                </div>

                <div className="input-box">
                    <input type="password" placeholder="Contraseña" name="password" />
                </div>

                <div className="input-box">
                    <button type="submit" className="btn">Iniciar</button>
                </div>
            </form>
        </div>
    </div>
    </>
  );
}
