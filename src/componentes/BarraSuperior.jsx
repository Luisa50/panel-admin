import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Home, Users, FileText, Mail } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { logout } from "../services/auth";

export default function BarraSuperior() {
  const navigate = useNavigate();
  const { notificaciones, marcarComoLeida } = useContext(AppContext);

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notifAbiertas, setNotifAbiertas] = useState(false);

  const notifRef = useRef(null);

  const cerrarSesion = () => {
    logout();
    navigate("/");
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifAbiertas(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        background: "#1e1e2f",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        color: "#fff",
      }}
    >

      <div
        style={{
          fontWeight: "600",
          fontSize: "18px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/inicio")}
      >
        HealthyMind
      </div>


      <div
        style={{
          display: "flex",
          gap: "25px",
          alignItems: "center",
          fontSize: "14px",
        }}
      >
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/inicio")}>
          <Home size={16} style={{ marginRight: "6px" }} />
          Inicio
        </div>

        <div style={{ cursor: "pointer" }} onClick={() => navigate("/usuarios")}>
          <Users size={16} style={{ marginRight: "6px" }} />
          Aprendices
        </div>

        <div style={{ cursor: "pointer" }} onClick={() => navigate("/psicologos")}>
          <Users size={16} style={{ marginRight: "6px" }} />
          Psicólogos
        </div>

        <div style={{ cursor: "pointer" }} onClick={() => navigate("/fichas")}>
          <FileText size={16} style={{ marginRight: "6px" }} />
          Fichas
        </div>

        <div style={{ cursor: "pointer" }} onClick={() => navigate("/reportes")}>
          <Mail size={16} style={{ marginRight: "6px" }} />
          Reportes
        </div>

        <div style={{ cursor: "pointer" }} onClick={() => navigate("/informes")}>
          <FileText size={16} style={{ marginRight: "6px" }} />
          Informes
        </div>
      </div>

  
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        

        <div
          ref={notifRef}
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => {
            setNotifAbiertas(!notifAbiertas);
            setMenuAbierto(false);
          }}
        >
          <Bell size={18} />

          {noLeidas > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "#ff4d4f",
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
                width: "300px",
                background: "#fff",
                color: "#000",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                padding: "12px",
                zIndex: 1000,
              }}
            >
              <h4>Notificaciones</h4>

              {notificaciones.length === 0 && (
                <p>No tienes notificaciones</p>
              )}

              {notificaciones.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  onClick={() => marcarComoLeida(n.id)}
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    marginBottom: "6px",
                    background: n.leida ? "#fff" : "#eef2ff",
                    cursor: "pointer",
                  }}
                >
                  {n.texto}
                </div>
              ))}
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
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />

          {menuAbierto && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: "0",
                width: "200px",
                background: "#fff",
                color: "#000",
                borderRadius: "10px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                padding: "10px",
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <strong>Administrador</strong>
                <div style={{ fontSize: "12px", color: "#777" }}>
                  admin@sistema.com
                </div>
              </div>

              <div
                style={{ cursor: "pointer", marginBottom: "8px" }}
                onClick={() => navigate("/perfil")}
              >
                Perfil
              </div>

              <div
                style={{ cursor: "pointer", color: "red" }}
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}