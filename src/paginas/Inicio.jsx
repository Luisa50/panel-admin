import React from "react";
import TarjetaResumen from "../componentes/TarjetaResumen";
import { Users, UserCheck, Mail, AlertTriangle } from "lucide-react";

const Inicio = () => {
  return (
    <>
   
      <div className="contenedor-tarjetas">
        <TarjetaResumen titulo="Usuarios Registrados" valor="230" icono={<Users />} />
        <TarjetaResumen titulo="Psicólogos Activos" valor="18" icono={<UserCheck />} />
        <TarjetaResumen titulo="Solicitudes Pendientes" valor="12" icono={<Mail />} />
  
      </div>


      <footer className="footer-sena">
        Servicio Nacional de Aprendizaje SENA © 2025 — Todos los derechos reservados.
      </footer>
    </>
  );
};

export default Inicio;

