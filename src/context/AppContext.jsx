import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [reportes, setReportes] = useState([
    {
      id: 1,
      titulo: "Error al cargar dashboard",
      descripcion: "La página queda en blanco al iniciar sesión.",
      estado: "Pendiente",
      fecha: "2025-01-05",
    },
    {
      id: 2,
      titulo: "Demora en asignación de psicóloga",
      descripcion: "La plataforma tarda demasiado en asignar profesional.",
      estado: "Pendiente",
      fecha: "2025-01-06",
    },
  ]);

  const [notificaciones, setNotificaciones] = useState([]);

  const crearNotificacionReporte = (reporte) => {
    const nuevaNotificacion = {
      id: Date.now(),
      texto: `Nuevo reporte creado: ${reporte.titulo}`,
      fecha: new Date().toLocaleDateString(),
      referenciaId: reporte.id,
      leida: false,
    };

    setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
  };

  const agregarReporte = (nuevoReporte) => {
    const reporteConId = {
      ...nuevoReporte,
      id: Date.now(),
    };

    setReportes((prev) => [reporteConId, ...prev]);
    crearNotificacionReporte(reporteConId);
  };

  const marcarComoLeida = (id) => {
    setNotificaciones((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, leida: true } : n
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        reportes,
        setReportes,
        notificaciones,
        agregarReporte,
        marcarComoLeida, 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
