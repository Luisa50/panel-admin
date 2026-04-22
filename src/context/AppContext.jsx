import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { fetchWithAuth, getToken } from "../services/auth";
import { API_URL } from "../config.js";

export const AppContext = createContext();

const LEIDAS_KEY = "healthymind_admin_notif_reportes_leidas";
const POLL_INTERVAL_MS = 60_000;

function cargarLeidas() {
  try {
    const raw = localStorage.getItem(LEIDAS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function persistirLeidas(set) {
  try {
    localStorage.setItem(LEIDAS_KEY, JSON.stringify(Array.from(set)));
  } catch {
    /* localStorage lleno o bloqueado: sin persistencia, sin ruido */
  }
}

export const AppProvider = ({ children }) => {
  const [reportes, setReportes] = useState([]);
  const [reportesActivos, setReportesActivos] = useState([]);
  const [leidas, setLeidas] = useState(cargarLeidas);

  const recargarReportesActivos = useCallback(async () => {
    if (!getToken()) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/Reporte?estado=creado`);
      if (!res || !res.ok) return;
      const data = await res.json();
      setReportesActivos(Array.isArray(data) ? data : []);
    } catch {
      /* ignorado: sin red, badge queda con el último valor conocido */
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial asíncrona; no bloquea el render
    void recargarReportesActivos();
    const onFocus = () => void recargarReportesActivos();
    window.addEventListener("focus", onFocus);
    window.addEventListener("healthymind-admin-token-refreshed", onFocus);
    const id = setInterval(recargarReportesActivos, POLL_INTERVAL_MS);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("healthymind-admin-token-refreshed", onFocus);
    };
  }, [recargarReportesActivos]);

  const notificaciones = useMemo(() => {
    return reportesActivos.map((r) => ({
      id: `reporte-${r.id}`,
      referenciaId: r.id,
      tipo: "reporte",
      titulo: "Nuevo reporte",
      texto: `Reporte #${r.id} — ${r.titulo ?? "Sin título"}`,
      mensaje: r.descripcion ?? "",
      fecha: r.fecha ?? "",
      leida: leidas.has(`reporte-${r.id}`),
    }));
  }, [reportesActivos, leidas]);

  const marcarComoLeida = useCallback((id) => {
    setLeidas((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      persistirLeidas(next);
      return next;
    });
  }, []);

  const marcarTodasComoLeidas = useCallback(() => {
    setLeidas((prev) => {
      const next = new Set(prev);
      notificaciones.forEach((n) => next.add(n.id));
      persistirLeidas(next);
      return next;
    });
  }, [notificaciones]);

  const cantidadNoLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <AppContext.Provider
      value={{
        reportes,
        setReportes,
        reportesActivos,
        recargarReportesActivos,
        notificaciones,
        marcarComoLeida,
        marcarTodasComoLeidas,
        cantidadNoLeidas,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
