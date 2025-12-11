import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut } from "lucide-react";

export default function BarraSuperior() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notifAbiertas, setNotifAbiertas] = useState(false);

  const cerrarSesion = () => {
    localStorage.removeItem("logged");
    navigate("/");
  };

  const notificaciones = [
    { id: 1, texto: "Nuevo usuario registrado", fecha: "Hoy, 10:00 AM" },
    { id: 2, texto: "Reporte semanal generado", fecha: "Hoy, 09:30 AM" },
    { id: 3, texto: "Alerta de sistema: actualización pendiente", fecha: "Ayer, 05:15 PM" },
  ];

  return (
    <div className="barra-superior" style={{ position: "relative", display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem 1rem", backgroundColor: "#fff", borderBottom: "1px solid #ccc" }}>

      {/* Icono de notificaciones */}
      <div 
        className="notificaciones-icono"
        style={{ position: "relative", cursor: "pointer" }}
        onClick={() => {
          setNotifAbiertas(!notifAbiertas);
          setMenuAbierto(false);
        }}
      >
        <Bell size={20} />
        <span className="burbuja" style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          backgroundColor: "red",
          color: "white",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "10px"
        }}>
          {notificaciones.length}
        </span>
      </div>

      {/* Icono de usuario */}
      <div
        className="avatar-contenedor"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setMenuAbierto(!menuAbierto);
          setNotifAbiertas(false);
        }}
      >
        <div className="avatar-icono" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <User size={20} />
          <span className="nombre">Admin</span>
        </div>
      </div>

      {/* Modal de notificaciones */}
      {notifAbiertas && (
        <div className="modal-notificaciones" style={{
          position: "absolute",
          top: "40px",
          right: "50px",
          width: "300px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
          overflow: "hidden"
        }}>
          {/* Icono de cierre */}
          <div 
            style={{
              position: "absolute",
              top: "5px",
              right: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              color: "#555"
            }}
            onClick={() => setNotifAbiertas(false)}
          >
            ✖
          </div>

          <div style={{ padding: "10px 15px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
            Notificaciones
          </div>

          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {notificaciones.map(n => (
              <div key={n.id} style={{ padding: "10px 15px", borderBottom: "1px solid #f1f1f1" }}>
                <div>{n.texto}</div>
                <div style={{ fontSize: "12px", color: "#777" }}>{n.fecha}</div>
              </div>
            ))}
            {notificaciones.length === 0 && (
              <div style={{ padding: "10px 15px", color: "#777" }}>No hay notificaciones</div>
            )}
          </div>
        </div>
      )}

      {menuAbierto && (
        <div className="menu-usuario" style={{
          position: "absolute",
          top: "40px",
          right: "10px",
          width: "200px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          zIndex: 1000
        }}>
          <div className="menu-user-info" style={{ padding: "10px 15px", borderBottom: "1px solid #eee" }}>
            <span className="nombre">Administrador</span><br/>
            <span className="correo" style={{ fontSize: "12px", color: "#777" }}>admin@sistema.com</span>
          </div>
          <div className="item-menu-usuario" style={{ padding: "10px 15px", cursor: "pointer" }} onClick={() => { setMenuAbierto(false); navigate("/perfil"); }}>
            Perfil
          </div>
          <div className="item-menu-usuario item-salir" style={{ padding: "10px 15px", cursor: "pointer", borderTop: "1px solid #eee" }} onClick={cerrarSesion}>
            Cerrar sesión
          </div>
        </div>
      )}
    </div>
  );
}
