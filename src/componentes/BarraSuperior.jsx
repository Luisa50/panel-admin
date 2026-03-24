import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { logout } from "../services/auth";

export default function BarraSuperior() {
  const navigate = useNavigate();
  const { notificaciones, marcarComoLeida } = useContext(AppContext);

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notifAbiertas, setNotifAbiertas] = useState(false);

  const notifRef = useRef(null);
  const avatarRef = useRef(null);

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        notifRef.current && !notifRef.current.contains(e.target) &&
        avatarRef.current && !avatarRef.current.contains(e.target)
      ) {
        setNotifAbiertas(false);
        setMenuAbierto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="barra-superior">

     
      <div
        ref={notifRef}
        className="notificaciones-icono"
        onClick={() => {
          setNotifAbiertas(!notifAbiertas);
          setMenuAbierto(false);
        }}
      >
        <Bell size={20} className="icono-notif" />

        {noLeidas > 0 && (
          <span className="burbuja">{noLeidas}</span>
        )}

        {notifAbiertas && (
          <div className="menu-notificaciones">
            <h4>Notificaciones</h4>

            {notificaciones.length === 0 && (
              <p>No tienes notificaciones</p>
            )}

            <div>
              {notificaciones.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  onClick={() => marcarComoLeida(n.id)}
                  className={`notif-item ${!n.leida ? "no-leida" : ""}`}
                >
                  <div>{n.texto}</div>
                  <small>{n.fecha}</small>
                </div>
              ))}
            </div>

            <div className="menu-item" onClick={() => navigate("/notificaciones")}>
              Ver todas
            </div>
          </div>
        )}
      </div>

      <div
        ref={avatarRef}
        className="avatar-contenedor"
        onClick={() => {
          setMenuAbierto(!menuAbierto);
          setNotifAbiertas(false);
        }}
      >
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Usuario"
          className="avatar-img"
        />

        {menuAbierto && (
          <div className="menu-usuario">
            <div className="menu-header">
              <div>Administrador</div>
              <small>admin@sistema.com</small>
            </div>

            <div className="menu-item" onClick={() => navigate("/perfil")}>
              Perfil
            </div>

            <div className="menu-item salir" onClick={cerrarSesion}>
              Cerrar sesión
            </div>
          </div>
        )}
      </div>

    </div>
  );
}