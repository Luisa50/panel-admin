import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import BarraLateral from "./BarraLateral";
import BarraSuperior from "./BarraSuperior";
import { Outlet } from "react-router-dom";
import {
  isAuthenticated,
  bootstrapSession,
  refreshSession,
  scheduleProactiveRefresh,
  getToken,
  isAccessExpired,
} from "../services/auth";
import { useLanguage } from "../context/LanguageContext";
import "../estilos/layout.css";

function Layout() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const autenticado = isAuthenticated();
  /** Sin token no hace falta esperar bootstrap; con token evita overlay de “no autenticado” mientras se intenta refrescar. */
  const [sessionBootstrapped, setSessionBootstrapped] = useState(
    () => !getToken()
  );
  const [sidebarExpandida, setSidebarExpandida] = useState(false);
  const ocultarFooter = pathname === "/inicio";

  const toggleSidebar = () => setSidebarExpandida((v) => !v);

  useEffect(() => {
    if (!getToken()) return;
    void bootstrapSession().finally(() => setSessionBootstrapped(true));
  }, []);

  useEffect(() => {
    if (!isAuthenticated() || !sessionBootstrapped) return;
    const onVis = () => {
      if (document.visibilityState !== "visible") return;
      const t = getToken();
      if (t && isAccessExpired(t, 150)) {
        void refreshSession().then((ok) => {
          if (ok) scheduleProactiveRefresh();
        });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [sessionBootstrapped]);

  return (
    <div className="layout-contenedor">
      <BarraLateral
        expandida={sidebarExpandida}
        onToggleSidebar={toggleSidebar}
      />

      <div className="layout-derecha">
        <BarraSuperior />
        <div className="layout-contenido">
          <Outlet />
        </div>
        {!ocultarFooter ? (
          <footer className="footer-sena">{t("layout.footer")}</footer>
        ) : null}
      </div>

      {!autenticado && sessionBootstrapped && (
        <div className="layout-overlay" role="alert" aria-live="assertive">
          <div className="layout-overlay-panel">
            <ShieldAlert
              className="layout-overlay-icon"
              size={64}
              strokeWidth={1.5}
            />
            <h2 className="layout-overlay-titulo">
              {t("layout.overlayTitle")}
            </h2>
            <p className="layout-overlay-mensaje">
              {t("layout.overlayMessage")}
            </p>
            <button
              type="button"
              className="layout-overlay-boton"
              onClick={() => navigate("/")}
            >
              {t("layout.overlayButton")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
