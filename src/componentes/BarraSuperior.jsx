import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { AppContext } from "../context/AppContext";

export default function BarraSuperior() {
  const navigate = useNavigate();
  const { notificaciones, marcarComoLeida } = useContext(AppContext);

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notifAbiertas, setNotifAbiertas] = useState(false);

  const notifRef = useRef(null);

  const cerrarSesion = () => {
    localStorage.removeItem("logged");
    navigate("/");
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifAbiertas(false);
      }
    }
    document.addEventListener("", handleClickOutside);
    return () =>
      document.removeEventListener("", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "1rem",
        padding: "0.5rem 1.5rem",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f0f0f0",
      }}
    >

      <div
        ref={notifRef}
        style={{ position: "relative", cursor: "pointer" }}
        onClick={() => {
          setNotifAbiertas(!notifAbiertas);
          setMenuAbierto(false);
        }}
      >
        <Bell size={20} />

        {noLeidas > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              backgroundColor: "#ff4d4f",
              color: "white",
              borderRadius: "50%",
              padding: "2px 6px",
              fontSize: "10px",
              fontWeight: "bold",
            }}
          >
            {noLeidas}
          </span>
        )}

        {notifAbiertas && (
          <div
            style={{
              position: "absolute",
              top: "35px",
              right: "0",
              width: "320px",
              background: "#fff",
              borderRadius: "14px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              padding: "15px",
              zIndex: 1000,
              cursor: "default",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ marginBottom: "12px" }}>Notificaciones</h4>

            {notificaciones.length === 0 && (
              <p style={{ fontSize: "14px", color: "#777" }}>
                No tienes notificaciones
              </p>
            )}

            <div style={{ maxHeight: "260px", overflowY: "auto" }}>
              {notificaciones.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  onClick={() => marcarComoLeida(n.id)}
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    background: n.leida ? "#fff" : "#eef2ff",
                    transition: "0.2s",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: n.leida ? "normal" : "600",
                    }}
                  >
                    {n.texto}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      marginTop: "4px",
                    }}
                  >
                    {n.fecha}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "10px",
                borderTop: "1px solid #eee",
                paddingTop: "10px",
                textAlign: "center",
              }}
            >
              <button
                onClick={() => {
                  setNotifAbiertas(false);
                  navigate("/notificaciones");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4a6cf7",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Ver todas
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="Usuario"
          onClick={() => {
            setMenuAbierto(!menuAbierto);
            setNotifAbiertas(false);
          }}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />

        {menuAbierto && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: "0",
              width: "220px",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              padding: "8px 0",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #f3f3f3",
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "14px" }}>
                Administrador
              </div>
              <div style={{ fontSize: "12px", color: "#888" }}>
                admin@sistema.com
              </div>
            </div>

            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => {
                setMenuAbierto(false);
                navigate("/perfil");
              }}
            >
              Perfil
            </div>

            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: "14px",
                color: "#e53935",
              }}
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
