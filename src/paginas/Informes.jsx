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
    <div className="informes-hub-page px-2 px-sm-3 py-3">
      <h2 className="informes-hub-page__title">Informes</h2>
      <p className="informes-hub-page__lead mb-4">
        Generación de informes y análisis del sistema
      </p>

      <div className="row g-4">
        {informes.map((inf, i) => (
          <div className="col-md-3" key={i}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(inf.ruta)}
              className="informes-tarjeta"
              style={{
                borderLeft: `6px solid ${inf.color}`,
              }}
            >
              <div
                className="informes-tarjeta__icono"
                style={{ color: inf.color }}
              >
                <i className={inf.icono}></i>
              </div>

              <h5 className="informes-tarjeta__titulo">{inf.titulo}</h5>

              <small className="informes-tarjeta__desc">{inf.descripcion}</small>

              <div
                className="informes-tarjeta__cta"
                style={{ color: inf.color }}
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
