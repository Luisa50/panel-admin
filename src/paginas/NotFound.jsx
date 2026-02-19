import { Link } from "react-router-dom";
import "../estilos/notfound.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <p className="notfound-mensaje">Página no encontrada</p>
        <p className="notfound-sub">La ruta que buscas no existe o ha cambiado.</p>
        <Link to="/" className="notfound-link">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
