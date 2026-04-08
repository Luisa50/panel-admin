import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../estilos/informes.css";

export default function Informesss() {
  const navigate = useNavigate();

  const informes = [
    {
      tipo: "usuarios",
      titulo: "Informe de Usuarios",
      descripcion: "Listado completo de usuarios del sistema",
      color: "#27ae60",
      icono: "bi bi-people",
      ruta: "/informes/usuarios",
    },
    {
      tipo: "general",
      titulo: "Informe General",
      descripcion: "Estado global del sistema",
      color: "#2f80ff",
      icono: "bi bi-bar-chart",
      ruta: "/informes/general",
    },
    {
      tipo: "psicologos",
      titulo: "Informe de Psicólogos",
      descripcion: "Capacidad, carga y atención",
      color: "#9b51e0",
      icono: "bi bi-heart-pulse",
      ruta: "/informes/psicologos",
    },
    {
      tipo: "estadistico",
      titulo: "Informes Estratégicos",
      descripcion: "Rankings por centro, regional, programa y más",
      color: "#219ebc",
      icono: "bi bi-graph-up-arrow",
      ruta: "/informes/estadistico",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "5px" }}>Informes</h2>
      <p style={{ color: "#666", marginBottom: "25px" }}>
        Generación de informes y análisis del sistema
      </p>

      <div className="row g-4">
        {informes.map((inf, i) => (
          <div className="col-md-3" key={i}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(inf.ruta)}
              style={{
                cursor: "pointer",
                padding: "20px",
                borderRadius: "14px",
                background: "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                borderLeft: `6px solid ${inf.color}`,
                height: "100%",
              }}
            >
              <div style={{ fontSize: "26px", color: inf.color }}>
                <i className={inf.icono}></i>
              </div>

              <h5 style={{ marginTop: "10px", marginBottom: "6px" }}>
                {inf.titulo}
              </h5>

              <small style={{ color: "#666" }}>{inf.descripcion}</small>

              <div
                style={{
                  marginTop: "15px",
                  fontSize: "13px",
                  color: inf.color,
                  fontWeight: "500",
                }}
              >
                Generar informe →
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
