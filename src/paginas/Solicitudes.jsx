import React, { useState, useMemo } from "react";
import { AlertTriangle, Bug, Inbox, Wrench, Star } from "lucide-react";

export default function Solicitudes() {
  const solicitudes = [
    { id: 1, categoria: "fallos", titulo: "Error al cargar dashboard", descripcion: "La página queda en blanco al iniciar sesión.", fecha: "2025-01-05" },
    { id: 2, categoria: "quejas", titulo: "Demora en asignación de psicóloga", descripcion: "La plataforma tarda demasiado en asignar profesional.", fecha: "2025-01-06" },
    { id: 3, categoria: "mejoras", titulo: "Agregar modo oscuro", descripcion: "Sería útil tener un modo oscuro para trabajar de noche.", fecha: "2025-01-07" },
    { id: 4, categoria: "reclamos", titulo: "Error al guardar test emocional", descripcion: "El test se borra después de enviarlo.", fecha: "2025-01-03" },
    { id: 5, categoria: "fallos", titulo: "Botón de enviar no funciona", descripcion: "Al hacer clic no responde.", fecha: "2025-01-08" },
    { id: 6, categoria: "sugerencias", titulo: "Mejorar visual de sección Usuarios", descripcion: "Sería bueno mostrar estadísticas rápidas.", fecha: "2025-01-02" },
    { id: 7, categoria: "reclamos", titulo: "Notificaciones duplicadas", descripcion: "Aparecen 2 notificaciones iguales.", fecha: "2025-01-09" },
    { id: 8, categoria: "sugerencias", titulo: "Agregar filtros avanzados", descripcion: "Filtros por fecha, usuario o prioridad.", fecha: "2025-01-04" },
    { id: 9, categoria: "fallos", titulo: "Error en generación de reportes", descripcion: "Al generar PDF el archivo sale corrupto.", fecha: "2025-01-10" },
    { id: 10, categoria: "mejoras", titulo: "Agregar exportación Excel", descripcion: "Para poder manipular datos fuera de la plataforma.", fecha: "2025-01-11" },

  ];

  const categorias = {
    fallos: { nombre: "Fallos del sistema", color: "#dc3545", icono: <Bug size={16} /> },
    quejas: { nombre: "Quejas", color: "#ffc107", icono: <AlertTriangle size={16} /> },
    reclamos: { nombre: "Reclamos", color: "#0d6efd", icono: <Inbox size={16} /> },
    mejoras: { nombre: "Mejoras", color: "#0dcaf0", icono: <Wrench size={16} /> },
    sugerencias: { nombre: "Sugerencias", color: "#6f42c1", icono: <Star size={16} /> },
  };

  const [filtro, setFiltro] = useState("todas");
  const [page, setPage] = useState(1);
  const porPagina = 4;


  const filtradas = useMemo(() => {
    if (filtro === "todas") return solicitudes;
    return solicitudes.filter(s => s.categoria === filtro);
  }, [filtro, solicitudes]);

  const totalPages = Math.ceil(filtradas.length / porPagina);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const mostrar = filtro === "todas"
    ? filtradas.slice((page - 1) * porPagina, page * porPagina) 
    : filtradas; 

  return (
    <div className="solicitudes-container">
      <h2>Solicitudes del Sistema</h2>
      <p className="sub">Mensajes, reportes y notificaciones internas</p>


      <div className="categorias-container mb-3">
        <button
          className="categoria-pill"
          style={{ background: "#e0e0e0" }}
          onClick={() => { setFiltro("todas"); setPage(1); }}
        >
          Todas
        </button>
        {Object.entries(categorias).map(([key, value]) => (
          <button
            key={key}
            className="categoria-pill"
            style={{ background: value.color + "33", color: value.color }}
            onClick={() => setFiltro(key)}
          >
            {value.icono}
            {value.nombre}
          </button>
        ))}
      </div>


      <div className="lista-solicitudes" style={{ minHeight: "400px" }}>
        {mostrar.map(sol => {
          const cat = categorias[sol.categoria];
          return (
            <div key={sol.id} className="solicitud-item" style={{ borderLeft: `5px solid ${cat.color}`, fontSize: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "15px", margin: 0 }}>{sol.titulo}</h3>
                <span style={{ fontSize: "12px", color: "#555" }}>{sol.fecha}</span>
              </div>
              <p style={{ margin: "4px 0 0 0" }}>{sol.descripcion}</p>
            </div>
          );
        })}
      </div>

 
      {filtro === "todas" && (
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center mt-3">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>
                &laquo;
              </button>
            </li>

            {pages.map(p => (
              <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(p)}>{p}</button>
              </li>
            ))}

            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
