import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../services/auth";
import "../estilos/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [correoPersonal, setCorreoPersonal] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ correoPersonal, password });
      navigate("/inicio");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <img src="/opcion1.png" alt="Login" />
        </div>

        <div className="login-form">
          <h2>ADMIN LOGIN</h2>

          <form onSubmit={handleLogin} autoComplete="off">
            <input type="text" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />

            <input
              type="email"
              name="correoPersonal"
              autoComplete="off"
              placeholder="Correo personal"
              className="login-input"
              value={correoPersonal}
              onChange={(e) => setCorreoPersonal(e.target.value)}
              required
            />

            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Contraseña"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
