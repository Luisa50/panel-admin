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
      <h2 className="m-0">Healthy</h2>
      <h4>Mind</h4>
      <div className="menu">
  
        <div className="menu-item" onClick={() => navigate("/inicio")}>
          <Home size={20} /> Dashboard
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

        <div className="menu-item" onClick={() => navigate("/soporte")}>
          <Wrench size={20} /> Soporte
        </div>

        <hr className="mt-5"/>
        <div className="menu-item" id="config" onClick={() => navigate("/configuracion")}>
          <Settings size={20} /> Configuración
        </div>
      </div>
    </div>
  );
};

export default BarraLateral;
