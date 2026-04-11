import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { AppContext } from "../context/AppContext";
import "../estilos/sidebar-notificaciones.css";

/**
 * @param {{ variant?: "sidebar" | "header" }} props
 * - sidebar: barra lateral (junto al logo)
 * - header: barra superior, campana a la derecha; panel bajo la campana
 */
export default function SidebarNotificaciones({ variant = "sidebar" }) {
  const esHeader = variant === "header";
  const navigate = useNavigate();
  const { notificaciones, marcarComoLeida } = useContext(AppContext);

  const [abierto, setAbierto] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const actualizarPosicion = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const anchoPanel = 320;
    const margen = 12;

    if (esHeader) {
      let left = r.right - anchoPanel;
      left = Math.max(
        margen,
        Math.min(left, window.innerWidth - anchoPanel - margen)
      );
      setPos({ top: r.bottom + 8, left });
    } else {
      let left = r.right + margen;
      if (left + anchoPanel > window.innerWidth - margen) {
        left = Math.max(margen, r.left - anchoPanel - margen);
      }
      setPos({ top: r.top, left });
    }
  }, [esHeader]);

  useEffect(() => {
    if (!abierto) return;
    actualizarPosicion();
    const onResize = () => actualizarPosicion();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [abierto, actualizarPosicion]);

  useEffect(() => {
    if (!abierto) return;
    function handlePointerDown(e) {
      const t = e.target;
      if (
        triggerRef.current?.contains(t) ||
        panelRef.current?.contains(t)
      ) {
        return;
      }
      setAbierto(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    function onKey(e) {
      if (e.key === "Escape") setAbierto(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  const rootClass = esHeader
    ? "sidebar-notif-root sidebar-notif-root--header notificaciones-icono"
    : "sidebar-notif-root";

  return (
    <div className={rootClass}>
      <button
        type="button"
        ref={triggerRef}
        className={
          esHeader
            ? "sidebar-notif-trigger sidebar-notif-trigger--header"
            : "sidebar-notif-trigger"
        }
        aria-label="Notificaciones"
        aria-expanded={abierto}
        aria-haspopup="true"
        onClick={(e) => {
          e.stopPropagation();
          setAbierto((v) => !v);
        }}
      >
        <Bell
          size={10}
          strokeWidth={2}
          className={esHeader ? "icono-notif" : undefined}
          aria-hidden
        />
        {noLeidas > 0 ? (
          <span className="sidebar-notif-badge" aria-hidden>
            {noLeidas > 99 ? "99+" : noLeidas}
          </span>
        ) : null}
      </button>

      {abierto ? (
        <div
          ref={panelRef}
          className="sidebar-notif-panel"
          role="dialog"
          aria-label="Panel de notificaciones"
          style={{
            top: pos.top,
            left: pos.left,
          }}
        >
          <div className="sidebar-notif-panel-header">
            <span className="sidebar-notif-panel-title">Notificaciones</span>
            {noLeidas > 0 ? (
              <span className="sidebar-notif-panel-count">{noLeidas} sin leer</span>
            ) : null}
          </div>

          <div className="sidebar-notif-panel-body">
            {notificaciones.length === 0 ? (
              <p className="sidebar-notif-empty">No tienes notificaciones</p>
            ) : (
              <ul className="sidebar-notif-list">
                {notificaciones.slice(0, 8).map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      className={`sidebar-notif-item ${
                        n.leida ? "sidebar-notif-item--leida" : "sidebar-notif-item--nueva"
                      }`}
                      onClick={() => marcarComoLeida(n.id)}
                    >
                      <div className="sidebar-notif-item-main">
                        {!n.leida ? (
                          <span className="sidebar-notif-dot" aria-hidden />
                        ) : (
                          <span className="sidebar-notif-dot sidebar-notif-dot--placeholder" aria-hidden />
                        )}
                        <span className="sidebar-notif-item-texto">{n.texto}</span>
                      </div>
                      {n.fecha ? (
                        <span className="sidebar-notif-item-fecha">{n.fecha}</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sidebar-notif-panel-footer">
            <button
              type="button"
              className="sidebar-notif-ver-todas"
              onClick={() => {
                setAbierto(false);
                navigate("/notificaciones");
              }}
            >
              Ver todas
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
