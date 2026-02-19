import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import BarraLateral from "./BarraLateral";
import BarraSuperior from "./BarraSuperior";
import { Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/auth";
import "../estilos/layout.css";

function Layout() {
  const navigate = useNavigate();
  const autenticado = isAuthenticated();

  return (
    <div className="layout-contenedor">
      <BarraLateral />

      <div className="layout-derecha">
        <BarraSuperior />
        <div className="layout-contenido">
          <Outlet />
        </div>
        <footer className="footer-sena">
          Servicio Nacional de Aprendizaje SENA © 2025 — Todos los derechos reservados.
        </footer>
      </div>

      {!autenticado && (
        <div className="layout-overlay" role="alert" aria-live="assertive">
          <div className="layout-overlay-panel">
            <ShieldAlert className="layout-overlay-icon" size={64} strokeWidth={1.5} />
            <h2 className="layout-overlay-titulo">Sin acceso a esta plataforma</h2>
            <p className="layout-overlay-mensaje">
              Debes iniciar sesión para poder usar el panel de administración.
            </p>
            <button
              type="button"
              className="layout-overlay-boton"
              onClick={() => navigate("/")}
            >
              Ir al inicio de sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
