import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Home,
  Users,
  UserCheck,
  Mail,
  BarChart2,
  Wrench,
  Settings,
  Menu,
} from "lucide-react";

import "../estilos/principal.css";


const BarraLateral = () => {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);

  return (
    <div className={`sidebar ${abierto ? "expandida" : "colapsada"}`}>

      <div className="sidebar-top">
        <button
          className="btn btn-light boton-hamburguesa"
          onClick={() => setAbierto(!abierto)}
        >
          <Menu size={22} />
        </button>

        {abierto && <span className="logo-texto">HealthyMind</span>}
      </div>


      <div className="sidebar-menu">
        <div className="item" onClick={() => navigate("/inicio")}>
          <Home size={20} />
          {abierto && <span>Inicio</span>}
        </div>

        <div className="item" onClick={() => navigate("/usuarios")}>
          <Users size={20} />
          {abierto && <span>Usuarios</span>}
        </div>

        <div className="item" onClick={() => navigate("/psicologos")}>
          <UserCheck size={20} />
          {abierto && <span>Psicólogas</span>}
        </div>

        <div className="item" onClick={() => navigate("/solicitudes")}>
          <Mail size={20} />
          {abierto && <span>Solicitudes</span>}
        </div>

        <div className="item" onClick={() => navigate("/monitoreo")}>
          <BarChart2 size={20} />
          {abierto && <span>Monitoreo</span>}
        </div>

        <hr id="config" className="border border-light border-0.5 opacity-50"/>
        <div className="item" id="config" onClick={() => navigate("/soporte")}>
          <Wrench size={20} />
          {abierto && <span>Soporte</span>}
        </div>


        <div className="item" id="config" onClick={() => navigate("/configuracion")}>
          <Settings size={20} />
          {abierto && <span>Configuración</span>}
        </div>
      </div>
    </div>
  );
};

export default BarraLateral;

