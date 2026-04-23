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
import { useLanguage } from "../context/LanguageContext";
import "../estilos/barraLateral.css";

const BarraLateral = ({ expandida = false, onToggleSidebar }) => {
  const { t } = useLanguage();
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
          aria-label={t("nav.hamburger")}
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
            {expandida && <span>{t("nav.home")}</span>}

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
                {expandida && <span>{t("nav.userManagement")}</span>}
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
                  {t("nav.apprentices")}
                </div>

                <div
                  className={`menu-item ${
                    esActivo("/psicologos") ? "activo" : ""
                  }`}
                  onClick={() => navigate("/psicologos")}
                >
                  {t("nav.psychologists")}
                </div>
              </div>
            </div>

            <div className="menu-seccion">
              <div
                className="menu-titulo"
                onClick={() => expandida && toggleModulo("academico")}
              >
                <BookOpen size={18} />
                {expandida && <span>{t("nav.academicManagement")}</span>}
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
                  {t("nav.trainingProgram")}
                </div>
                <div className="menu-item" onClick={() => navigate("/fichas")}>
                  {t("nav.records")}
                </div>
                <div className="menu-item" onClick={() => navigate("/niveles")}>
                  {t("nav.trainingLevel")}
                </div>
                <div className="menu-item" onClick={() => navigate("/area")}>
                  {t("nav.area")}
                </div>
                <div className="menu-item" onClick={() => navigate("/centros")}>
                  {t("nav.center")}
                </div>
                <div
                  className="menu-item"
                  onClick={() => navigate("/regionales")}
                >
                  {t("nav.regional")}
                </div>
                <div className="menu-item" onClick={() => navigate("/ciudades")}>
                  {t("nav.city")}
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
                {expandida && <span>{t("nav.reports")}</span>}
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
                  {t("nav.users")}
                </div>
                <div
                  className={`menu-item ${
                    esActivo("/informes/psicologos") ? "activo" : ""
                  }`}
                  onClick={() => navigate("/informes/psicologos")}
                >
                  {t("nav.psychologists")}
                </div>
                <div
                  className={`menu-item ${
                    esActivo("/informes/general") ? "activo" : ""
                  }`}
                  onClick={() => navigate("/informes/general")}
                >
                  {t("nav.general")}
                </div>
              </div>
            </div>

            <div
              className={`menu-item ${esActivo("/reportes") ? "activo" : ""}`}
              onClick={() => navigate("/reportes")}
            >
              <Mail size={18} />
              {expandida && <span>{t("nav.mailReports")}</span>}
            </div>

            <div
              className={`menu-item ${
                esActivo("/configuracion") ? "activo" : ""
              }`}
              onClick={() => navigate("/configuracion")}
            >
              <Settings size={18} />
              {expandida && <span>{t("nav.settings")}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-perfil-btn"
          data-label={t("nav.myProfile")}
          onClick={() => setPerfilAbierto(true)}
          aria-label={t("nav.profileAria")}
        >
          <UserCircle size={22} strokeWidth={1.75} />
          {expandida && <span>{t("nav.myProfile")}</span>}
        </button>
        <button
          type="button"
          className="sidebar-perfil-btn"
          data-label={t("nav.logout")}
          onClick={() => {
            logout();
            navigate("/");
          }}
          aria-label={t("nav.logoutAria")}
        >
          <LogOut size={22} strokeWidth={1.75} />
          {expandida && <span>{t("nav.logout")}</span>}
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
