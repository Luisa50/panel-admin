import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../estilos/notificaciones.css";

export default function Notificaciones() {
  const navigate = useNavigate();
  const { notificaciones, marcarComoLeida, marcarTodasComoLeidas } = useApp();

  const abrirNotificacion = (notif) => {
    marcarComoLeida(notif.id);
    if (notif.tipo === "reporte") {
      navigate("/reportes");
    }
  };

  return (
    <div className="notif-container">
      <div className="notif-header">
        <div>
          <h2>Notificaciones</h2>
          <p>Aquí puedes ver todas tus notificaciones</p>
        </div>

        <div className="notif-buttons">
          <button className="btn-leidas" onClick={marcarTodasComoLeidas}>
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
            onClick={() => abrirNotificacion(notif)}
            className={`notif-card ${notif.leida ? "leida" : "no-leida"}`}
          >
            <div className="notif-top">
              <h4>{notif.titulo}</h4>
              <span>{notif.fecha}</span>
            </div>
            <p>{notif.texto}</p>
            {notif.mensaje ? (
              <p className="notif-mensaje-detalle">{notif.mensaje}</p>
            ) : null}
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
