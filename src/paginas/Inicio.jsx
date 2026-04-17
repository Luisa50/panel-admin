import React from "react";
import Monitoreo from "./Monitoreo";
import { useLanguage } from "../context/LanguageContext";
import "../estilos/dashboard.css";

const Inicio = () => {
  const { t } = useLanguage();
  return (
    <section
      className="dashboard-section dashboard-section--charts inicio-solo-estadisticas"
      aria-label={t("inicio.aria")}
    >
      <Monitoreo />
    </section>
  );
};

export default Inicio;
