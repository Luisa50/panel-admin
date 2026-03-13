import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  Menu,
  Users,
  Home,
  BookOpen,
  Mail,
  Wrench,
  ChevronDown
} from "lucide-react";

import "../estilos/barraLateral.css";

const BarraLateral = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [expandida, setExpandida] = useState(true);

  const [inicioAbierto, setInicioAbierto] = useState(false);

  const [modulosAbiertos, setModulosAbiertos] = useState({
    usuarios: false,
    academico: false,
    informes: false
  });

  const toggleSidebar = () => setExpandida(!expandida);

  const toggleInicio = () => setInicioAbierto(!inicioAbierto);

  const toggleModulo = (modulo) => {
    setModulosAbiertos({
      ...modulosAbiertos,
      [modulo]: !modulosAbiertos[modulo]
    });
  };

  const esActivo = (ruta) => location.pathname === ruta;

  return (
    <div className={`sidebar ${expandida ? "expandida" : "colapsada"}`}>

   
      <div className="sidebar-top">
        <Menu size={22} onClick={toggleSidebar} className="hamburguesa" />
        {expandida && <span className="logo-texto">HealthyMind</span>}
      </div>


    
      <div className="menu-seccion">

        <div className="menu-titulo" onClick={toggleInicio}>
          <Home size={20} />
          {expandida && <span>Inicio</span>}
          {expandida && (
            <ChevronDown
              size={16}
              className={`flecha ${inicioAbierto ? "rotar" : ""}`}
            />
          )}
        </div>

      
        <div className={`submenu ${inicioAbierto ? "abierto" : ""}`}>

       
          <div className="menu-seccion">

            <div
              className="menu-titulo"
              onClick={() => toggleModulo("usuarios")}
            >
              <Users size={18} />
              {expandida && <span>Gestión de Usuarios</span>}
              {expandida && (
                <ChevronDown
                  size={14}
                  className={`flecha ${modulosAbiertos.usuarios ? "rotar" : ""}`}
                />
              )}
            </div>

            <div className={`submenu ${modulosAbiertos.usuarios ? "abierto" : ""}`}>

              <div
                className={`menu-item ${esActivo("/usuarios") ? "activo" : ""}`}
                onClick={() => navigate("/usuarios")}
              >
                Aprendices
              </div>

              <div
                className={`menu-item ${esActivo("/psicologos") ? "activo" : ""}`}
                onClick={() => navigate("/psicologos")}
              >
                Psicólogos
              </div>

              <div className="menu-item">Accesos</div>
              <div className="menu-item">Gestión</div>

            </div>

          </div>


       
          <div className="menu-seccion">

            <div
              className="menu-titulo"
              onClick={() => toggleModulo("academico")}
            >
              <BookOpen size={18} />
              {expandida && <span>Gestión Académica</span>}
              {expandida && (
                <ChevronDown
                  size={14}
                  className={`flecha ${modulosAbiertos.academico ? "rotar" : ""}`}
                />
              )}
            </div>

            <div className={`submenu ${modulosAbiertos.academico ? "abierto" : ""}`}>

              <div className="menu-item" onClick={() => navigate("/programas")}>
                Programa de formación
              </div>

              <div className="menu-item" onClick={() => navigate("/fichas")}>
                Fichas
              </div>

              <div className="menu-item" onClick={() => navigate("/niveles")}>
                Nivel de formación
              </div>

              <div className="menu-item" onClick={() => navigate("/area")}>
                Área
              </div>

              <div className="menu-item" onClick={() => navigate("/centros")}>
                Centro
              </div>

              <div className="menu-item" onClick={() => navigate("/regionales")}>
                Regional
              </div>

              <div className="menu-item" onClick={() => navigate("/ciudades")}>
                Ciudad
              </div>

            </div>

          </div>


          <div className="menu-seccion">

            <div
              className="menu-titulo"
              onClick={() => toggleModulo("informes")}
            >
              <Wrench size={18} />
              {expandida && <span>Informes</span>}
              {expandida && (
                <ChevronDown
                  size={14}
                  className={`flecha ${modulosAbiertos.informes ? "rotar" : ""}`}
                />
              )}
            </div>

            <div className={`submenu ${modulosAbiertos.informes ? "abierto" : ""}`}>
              <div className="menu-item">Usuarios</div>
              <div className="menu-item">Psicólogos</div>
              <div className="menu-item">General</div>
            </div>

          </div>


          {/* REPORTES */}
          <div
            className={`menu-item ${esActivo("/reportes") ? "activo" : ""}`}
            onClick={() => navigate("/reportes")}
          >
            <Mail size={18} />
            {expandida && <span>Reportes</span>}
          </div>

        </div>

      </div>

    </div>
  );
};

export default BarraLateral;