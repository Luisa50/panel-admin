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
  FileText
} from "lucide-react";

import "../estilos/barraLateral.css";

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
          {abierto && <span>Aprendices</span>}
        </div>

        <div className="item" onClick={() => navigate("/psicologos")}>
          <UserCheck size={20} />
          {abierto && <span>Psicólogos</span>}
        </div>

        <div className="item" onClick={() => navigate("/fichas")}>
          <FileText size={20} />
          {abierto && <span>Fichas</span>}
        </div>

        <div className="item" onClick={() => navigate("/solicitudes")}>
          <Mail size={20} />
          {abierto && <span>Reportes</span>}
        </div>

        <hr id="config" className="border border-light border-0.5 opacity-50"/>

        <div className="item" id="config" onClick={() => navigate("/informes")}>
          <Wrench size={20} />
          {abierto && <span>Informes</span>}
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
