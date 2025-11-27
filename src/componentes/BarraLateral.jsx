import { useNavigate } from "react-router-dom";

import {
  Home,
  Users,
  UserCheck,
  Mail,
  ClipboardList,
  BarChart2,
  Wrench,
  Settings,
} from "lucide-react";

import "../estilos/principal.css";

const BarraLateral = () => {
  const navigate = useNavigate();

  return (
    <div className="barra-lateral">
      <h2>HealthyMind</h2>

      <div className="menu">
  
        <div className="menu-item" onClick={() => navigate("/inicio")}>
          <Home size={20} /> Inicio
        </div>


        <div className="menu-item" onClick={() => navigate("/usuarios")}>
          <Users size={20} /> Usuarios
        </div>


        <div className="menu-item" onClick={() => navigate("/psicologos")}>
          <UserCheck size={20} /> Psicólogas
        </div>


       <div className="menu-item" onClick={() => navigate("/solicitudes")}>
          <Mail size={20} /> Solicitudes
      </div>


        <div className="menu-item" onClick={() => navigate("/monitoreo")}>
          <BarChart2 size={20} /> Monitoreo
        </div>


        <div className="menu-item" onClick={() => navigate("/soporte")}>
          <Wrench size={20} /> Soporte
        </div>


        <div className="menu-item" onClick={() => navigate("/configuracion")}>
          <Settings size={20} /> Configuración
        </div>
      </div>
    </div>
  );
};

export default BarraLateral;
