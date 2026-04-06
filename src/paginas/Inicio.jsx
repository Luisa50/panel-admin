import React from "react";
import Monitoreo from "./Monitoreo";
import "../estilos/dashboard.css";

const Inicio = () => {
  return (
    <section
      className="dashboard-section dashboard-section--charts inicio-solo-estadisticas"
      aria-label="Estadísticas y gráficas"
    >
      <Monitoreo />
    </section>
  );
};

export default Inicio;
