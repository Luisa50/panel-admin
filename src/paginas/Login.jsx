import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/login.css";


export default function Login() {
  const [role, setRole] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (role === "Admin" && user && password) {
      localStorage.setItem("logged", "true");
      localStorage.setItem("role", role);
      localStorage.setItem("user", user);

      navigate("/inicio");
    } else {
      alert("Completa todos los campos.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Inicio Admin</h2>

        <label>Rol *</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Seleccione</option>
          <option value="Admin">Administrador</option>
        </select>

        <label>Usuario *</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <label>Contraseña *</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
