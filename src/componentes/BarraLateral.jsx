import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Users,
  Home,
  BookOpen,
  Mail,
  Wrench,
  ChevronDown,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";

import ModalPerfilCliente from "./ModalPerfilCliente";
import { logout } from "../services/auth.js";
import "../estilos/barraLateral.css";

const BarraLateral = ({ expandida = false, onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [inicioAbierto, setInicioAbierto] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  const [modulosAbiertos, setModulosAbiertos] = useState({
    usuarios: false,
    academico: false,
    informes: false,
  });

  const toggleInicio = () => setInicioAbierto(!inicioAbierto);

  const toggleModulo = (modulo) => {
    setModulosAbiertos({
      ...modulosAbiertos,
      [modulo]: !modulosAbiertos[modulo],
    });
  };

  const esActivo = (ruta) => location.pathname === ruta;

  return (
    <div className={`sidebar ${expandida ? "expandida" : "colapsada"}`}>
      <div className="sidebar-top">
        <button
          type="button"
          className="sidebar-hamburguesa hamburguesa"
          onClick={() => onToggleSidebar?.()}
          aria-label="Abrir o cerrar menú lateral"
          aria-expanded={expandida}
        >
          <Menu size={22} aria-hidden />
        </button>
        {expandida ? <span className="logo-texto">HealthyMind</span> : null}
      </div>

      <div className="sidebar-body">
        <div className="menu-seccion">
          <div
            className="menu-titulo"
            onClick={() => {
              navigate("/inicio");
              expandida && toggleInicio();
            }}
          >
            <Home size={20} />
            {expandida && <span>Inicio</span>}

            {expandida && (
              <ChevronDown
                size={16}
                className={`flecha ${inicioAbierto ? "rotar" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleInicio();
                }}
              />
            )}
          </div>

          <div
            className={`submenu ${expandida && inicioAbierto ? "abierto" : ""}`}
          >
            <div className="menu-seccion">
              <div
                className="menu-titulo"
                onClick={() => expandida && toggleModulo("usuarios")}
              >
                <Users size={18} />
                {expandida && <span>Gestión de Usuarios</span>}
                {expandida && (
                  <ChevronDown
                    size={14}
                    className={`flecha ${
                      modulosAbiertos.usuarios ? "rotar" : ""
                    }`}
                  />
                )}
              </div>

              <div
                className={`submenu ${
                  expandida && modulosAbiertos.usuarios ? "abierto" : ""
                }`}
              >
                <div
                  className={`menu-item ${
                    esActivo("/usuarios") ? "activo" : ""
                  }`}
                  onClick={() => navigate("/usuarios")}
                >
                  Aprendices
                </div>

                <div
                  className={`menu-item ${
                    esActivo("/psicologos") ? "activo" : ""
                  }`}
                  onClick={() => navigate("/psicologos")}
                >
                  Psicólogos
                </div>

                <div
                  className={`menu-item ${
                    esActivo("/accesos") ? "activo" : ""
                  }`}
                  onClick={() => navigate("/accesos")}
                >
                  Accesos
                </div>
              </div>
            </div>

            <div className="menu-seccion">
              <div
                className="menu-titulo"
                onClick={() => expandida && toggleModulo("academico")}
              >
                <BookOpen size={18} />
                {expandida && <span>Gestión Académica</span>}
                {expandida && (
                  <ChevronDown
                    size={14}
                    className={`flecha ${
                      modulosAbiertos.academico ? "rotar" : ""
                    }`}
                  />
                )}
              </div>

              <div
                className={`submenu ${
                  expandida && modulosAbiertos.academico ? "abierto" : ""
                }`}
              >
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
                <div
                  className="menu-item"
                  onClick={() => navigate("/regionales")}
                >
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
                onClick={() => {
                  navigate("/informes");
                  expandida && toggleModulo("informes");
                }}
              >
                <Wrench size={18} />
                {expandida && <span>Informes</span>}
                {expandida && (
                  <ChevronDown
                    size={14}
                    className={`flecha ${
                      modulosAbiertos.informes ? "rotar" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModulo("informes");
                    }}
                  />
                )}
              </div>

              <div
                className={`submenu ${
                  expandida && modulosAbiertos.informes ? "abierto" : ""
                }`}
              >
                <div
                  className={`menu-item ${
                    esActivo("/informes/usuarios") ? "activo" : ""
                  }`}
                  onClick={() => navigate("/informes/usuarios")}
                >
                  Usuarios
                </div>
                <div
                  className={`menu-item ${
                    esActivo("/informes/psicologos") ? "activo" : ""
                  }`}
                  onClick={() => navigate("/informes/psicologos")}
                >
                  Psicólogos
                </div>
                <div
                  className={`menu-item ${
                    esActivo("/informes/general") ? "activo" : ""
                  }`}
                  onClick={() => navigate("/informes/general")}
                >
                  General
                </div>
              </div>
            </div>

            <div
              className={`menu-item ${esActivo("/reportes") ? "activo" : ""}`}
              onClick={() => navigate("/reportes")}
            >
              <Mail size={18} />
              {expandida && <span>Reportes</span>}
            </div>

            <div
              className={`menu-item ${
                esActivo("/configuracion") ? "activo" : ""
              }`}
              onClick={() => navigate("/configuracion")}
            >
              <Settings size={18} />
              {expandida && <span>Configuración</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-perfil-btn"
          data-label="Mi perfil"
          onClick={() => setPerfilAbierto(true)}
          aria-label="Abrir perfil de la cuenta"
        >
          <UserCircle size={22} strokeWidth={1.75} />
          {expandida && <span>Mi perfil</span>}
        </button>
        <button
          type="button"
          className="sidebar-perfil-btn"
          data-label="Cerrar sesión"
          onClick={() => {
            logout();
            navigate("/");
          }}
          aria-label="Cerrar sesión"
        >
          <LogOut size={22} strokeWidth={1.75} />
          {expandida && <span>Cerrar sesión</span>}
        </button>
      </div>

      <ModalPerfilCliente
        open={perfilAbierto}
        onClose={() => setPerfilAbierto(false)}
      />
    </div>
  );
};

export default BarraLateral;
