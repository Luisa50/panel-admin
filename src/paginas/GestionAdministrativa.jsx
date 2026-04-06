import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ENLACES_ADMIN = [
  { label: "Programas de formación", ruta: "/programas" },
  { label: "Fichas", ruta: "/fichas" },
  { label: "Nivel de formación", ruta: "/niveles" },
  { label: "Área", ruta: "/area" },
  { label: "Centro", ruta: "/centros" },
  { label: "Regional", ruta: "/regionales" },
  { label: "Ciudad", ruta: "/ciudades" },
];

export default function GestionAdministrativa() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid p-4" style={{ maxWidth: 720 }}>
      <h3 className="fw-bold mb-2">Gestión</h3>
      <p className="text-muted mb-4">
        Administración de catálogos y estructura académico‑organizativa del
        sistema. Elija un módulo para abrir su vista correspondiente.
      </p>
      <div className="list-group shadow-sm">
        {ENLACES_ADMIN.map((item) => (
          <button
            key={item.ruta}
            type="button"
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            onClick={() => navigate(item.ruta)}
          >
            <span>{item.label}</span>
            <span className="text-muted small" aria-hidden>
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
