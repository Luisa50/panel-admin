import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../estilos/notificaciones.css";

export default function Notificaciones() {
  const navigate = useNavigate();

  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      titulo: "Nuevo usuario registrado",
      mensaje: "Se ha registrado un nuevo usuario en el sistema.",
      leida: false,
      fecha: "Hace 5 minutos",
    },
    {
      id: 2,
      titulo: "Reporte generado",
      mensaje: "El informe mensual ha sido generado correctamente.",
      leida: false,
      fecha: "Hace 1 hora",
    },
    {
      id: 3,
      titulo: "Actualización del sistema",
      mensaje: "El sistema fue actualizado exitosamente.",
      leida: true,
      fecha: "Ayer",
    },
  ]);

  const marcarComoLeida = (id) => {
    setNotificaciones(
      notificaciones.map((notif) =>
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  };

  const marcarTodas = () => {
    setNotificaciones(
      notificaciones.map((notif) => ({ ...notif, leida: true }))
    );
  };

  return (
    <div className="notif-container">
      <div className="notif-header">
        <div>
          <h2>Notificaciones</h2>
          <p>Aquí puedes ver todas tus notificaciones</p>
        </div>

        <div className="notif-buttons">
          <button className="btn-leidas" onClick={marcarTodas}>
            Marcar todas como leídas
          </button>

          <button className="btn-volver" onClick={() => navigate("/inicio")}>
            ← Volver
          </button>
        </div>
      </div>

      <div className="notif-lista">
        {notificaciones.map((notif) => (
          <div
            key={notif.id}
            onClick={() => marcarComoLeida(notif.id)}
            className={`notif-card ${notif.leida ? "leida" : "no-leida"}`}
          >
            <div className="notif-top">
              <h4>{notif.titulo}</h4>
              <span>{notif.fecha}</span>
            </div>
            <p>{notif.mensaje}</p>
          </div>
        ))}
      </div>

      {notificaciones.length === 0 && (
        <div className="notif-vacio">
          No tienes notificaciones en este momento.
        </div>
      )}
    </div>
  );
}
