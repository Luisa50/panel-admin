import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { getAuth } from "../services/auth";
import "../estilos/dashboard.css";

/**
 * Modal con datos de la cuenta conectada (administrador).
 * La información proviene del almacenamiento local tras el login.
 */
export default function ModalPerfilCliente({ open, onClose }) {
  const panelRef = useRef(null);
  const auth = getAuth();

  const correo = auth?.correoPersonal ?? "—";
  const inicial = correo !== "—" ? correo.trim().charAt(0).toUpperCase() : "?";
  const nombreVisible =
    correo !== "—" ? correo.split("@")[0].replace(/\./g, " ") : "Usuario";

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-perfil-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="modal-perfil-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-perfil-titulo"
      >
        <div className="modal-perfil-header">
          <h2 id="modal-perfil-titulo">Tu cuenta</h2>
          <button
            type="button"
            className="modal-perfil-close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>

        <div className="modal-perfil-body">
          <div className="modal-perfil-avatar">
            <div className="modal-perfil-avatar-circle" aria-hidden>
              {inicial}
            </div>
            <div className="modal-perfil-avatar-meta">
              <strong>{nombreVisible}</strong>
              <span>Administrador · HealthyMind</span>
            </div>
          </div>

          <div className="modal-perfil-field">
            <label htmlFor="perfil-correo">Correo electrónico</label>
            <input id="perfil-correo" type="email" readOnly value={correo} />
          </div>

          <div className="modal-perfil-field">
            <label>Rol en el panel</label>
            <div className="modal-perfil-value">Administrador general</div>
          </div>

          <div className="modal-perfil-field">
            <label>Sesión</label>
            <div className="modal-perfil-value">
              Conectado con credenciales guardadas de forma segura en este
              navegador.
            </div>
          </div>

          <div className="modal-perfil-actions">
            <button
              type="button"
              className="modal-perfil-btn modal-perfil-btn--secondary"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
