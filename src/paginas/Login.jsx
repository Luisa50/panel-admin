import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../estilos/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("admin");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Rol seleccionado:", role);
    navigate("/inicio");
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

            <select
              className="login-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
            </select>

            <input
              type="text"
              name="fake-user"
              autoComplete="off"
              placeholder="Username"
              className="login-input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />

            <input
              type="password"
              name="fake-password"
              autoComplete="new-password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-button">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
