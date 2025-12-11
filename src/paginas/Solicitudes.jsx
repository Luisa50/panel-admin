import React, { useState, useMemo } from "react";

export default function Reportes() {
  const [reportes, setReportes] = useState([
    { id: 1, titulo: "Error al cargar dashboard", descripcion: "La página queda en blanco al iniciar sesión.", fecha: "2025-01-05", estado: "pendiente", historial: ["Reporte creado"] },
    { id: 2, titulo: "Demora en asignación de psicóloga", descripcion: "La plataforma tarda demasiado en asignar profesional.", fecha: "2025-01-06", estado: "pendiente", historial: ["Usuario envió reporte"] },
    { id: 3, titulo: "Agregar modo oscuro", descripcion: "Sería útil tener un modo oscuro.", fecha: "2025-01-07", estado: "proceso", historial: [] },
    { id: 4, titulo: "Error al guardar test emocional", descripcion: "El test se borra después de enviarlo.", fecha: "2025-01-03", estado: "pendiente", historial: ["Error replicado"] },
    { id: 5, titulo: "Botón de enviar no funciona", descripcion: "Al hacer clic no responde.", fecha: "2025-01-08", estado: "proceso", historial: [] },
    { id: 6, titulo: "Mejorar sección Usuarios", descripcion: "Mostrar estadísticas rápidas.", fecha: "2025-01-02", estado: "pendiente", historial: [] },
    { id: 7, titulo: "Notificaciones duplicadas", descripcion: "Aparecen 2 notificaciones iguales.", fecha: "2025-01-09", estado: "resuelto", historial: [] },
    { id: 8, titulo: "Agregar filtros avanzados", descripcion: "Filtros por fecha o prioridad.", fecha: "2025-01-04", estado: "resuelto", historial: [] },
    { id: 9, titulo: "Error generando reportes PDF", descripcion: "El PDF sale corrupto.", fecha: "2025-01-10", estado: "pendiente", historial: [] },
    { id: 10, titulo: "Agregar exportación Excel", descripcion: "Manipular datos fuera de la plataforma.", fecha: "2025-01-11", estado: "pendiente", historial: [] },
  ]);

  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [page, setPage] = useState(1);
  const porPagina = 4;

  const [showModal, setShowModal] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [notaAdmin, setNotaAdmin] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("");

  const abrirModal = (rep) => {
    setReporteSeleccionado(rep);
    setNuevoEstado(rep.estado);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setNotaAdmin("");
  };

  const actualizarEstado = () => {
    const actualizados = reportes.map((r) =>
      r.id === reporteSeleccionado.id
        ? {
            ...r,
            estado: nuevoEstado,
            historial: [...r.historial, `Estado cambiado a ${nuevoEstado}`],
          }
        : r
    );

    setReportes(actualizados);
    cerrarModal();
  };

  const filtrados = useMemo(() => {
    if (estadoFiltro === "todas") return reportes;
    return reportes.filter((r) => r.estado === estadoFiltro);
  }, [estadoFiltro, reportes]);

  const totalPages = Math.ceil(filtrados.length / porPagina);
  const mostrar = filtrados.slice((page - 1) * porPagina, page * porPagina);

  const getColor = (estado) => {
    if (estado === "pendiente") return "#dc3545";
    if (estado === "proceso") return "#ffc107";
    if (estado === "resuelto") return "#28a745";
    return "#0d6efd";
  };

  const pillColor = (est) => {
    if (est === "pendiente") return "#dc3545";
    if (est === "proceso") return "#ffc107";
    if (est === "resuelto") return "#28a745";
    return "#6c757d";
  };

  return (
    <div className="solicitudes-container">
      <h2>Reportes del Sistema</h2>
      <p className="sub">Mensajes, reportes y notificaciones internas</p>

      <div className="estado-tabs mb-3" style={{ display: "flex", gap: "10px" }}>
        {["todas", "pendiente", "proceso", "resuelto"].map((est) => (
          <button
            key={est}
            className="estado-pill"
            style={{
              background: estadoFiltro === est ? pillColor(est) : "#e0e0e0",
              color: estadoFiltro === est ? "#fff" : "#333",
              fontWeight: 600
            }}
            onClick={() => {
              setEstadoFiltro(est);
              setPage(1);
            }}
          >
            {est === "todas" && "Todos"}
            {est === "pendiente" && "Pendientes"}
            {est === "proceso" && "En proceso"}
            {est === "resuelto" && "Resueltos"}
          </button>
        ))}
      </div>

      <div className="lista-solicitudes" style={{ minHeight: "400px" }}>
        {mostrar.map((rep) => (
          <div
            key={rep.id}
            className="solicitud-item"
            style={{
              borderLeft: `5px solid ${getColor(rep.estado)}`,
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
            onClick={() => abrirModal(rep)}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "15px" }}>{rep.titulo}</h3>
              <span style={{ fontSize: "12px", color: "#666" }}>{rep.fecha}</span>
            </div>
            <p style={{ margin: "4px 0 0 0" }}>{rep.descripcion}</p>
          </div>
        ))}
      </div>

      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
              &laquo;
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(p)}>
                {p}
              </button>
            </li>
          ))}

          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              &raquo;
            </button>
          </li>
        </ul>
      </nav>

      {showModal && reporteSeleccionado && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">{reporteSeleccionado.titulo}</h5>
                <button className="btn-close" onClick={cerrarModal}></button>
              </div>

              <div className="modal-body">
                <p><strong>Descripción:</strong> {reporteSeleccionado.descripcion}</p>

                <p><strong>Estado actual:</strong> {reporteSeleccionado.estado}</p>

                <label className="form-label">Cambiar estado:</label>
                <select
                  className="form-select"
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                </select>

                <p className="mt-3"><strong>Historial:</strong></p>
                <ul>
                  {reporteSeleccionado.historial.length === 0 ? (
                    <li>Sin historial</li>
                  ) : (
                    reporteSeleccionado.historial.map((h, i) => <li key={i}>{h}</li>)
                  )}
                </ul>

                <div className="mt-3">
                  <label className="form-label">Nota interna:</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={notaAdmin}
                    onChange={(e) => setNotaAdmin(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarModal}>Cerrar</button>
                <button className="btn btn-success" onClick={actualizarEstado}>Guardar cambios</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
