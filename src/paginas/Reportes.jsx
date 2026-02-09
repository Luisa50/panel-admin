import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal, Button, Form, Badge } from "react-bootstrap";

export default function Reportes() {
  const [loading, setLoading] = useState(false);

  const [reportes, setReportes] = useState([
    { id: 1, titulo: "Error al cargar dashboard", descripcion: "La página queda en blanco al iniciar sesión.", fecha: "2025-01-05", estado: "pendiente", historial: ["Reporte creado"] },
    { id: 2, titulo: "Demora en asignación de psicóloga", descripcion: "La plataforma tarda demasiado en asignar profesional.", fecha: "2025-01-06", estado: "pendiente", historial: ["Reporte creado"] },
    { id: 3, titulo: "Agregar modo oscuro", descripcion: "Sería útil tener un modo oscuro.", fecha: "2025-01-07", estado: "proceso", historial: ["Reporte creado", "Asignado a soporte"] },
    { id: 4, titulo: "Error al guardar test emocional", descripcion: "El test se borra después de enviarlo.", fecha: "2025-01-03", estado: "pendiente", historial: ["Reporte creado"] },
    { id: 5, titulo: "Botón de enviar no funciona", descripcion: "Al hacer clic no responde.", fecha: "2025-01-08", estado: "proceso", historial: ["Reporte creado"] },
    { id: 6, titulo: "Mejorar sección Usuarios", descripcion: "Mostrar estadísticas rápidas.", fecha: "2025-01-02", estado: "pendiente", historial: ["Reporte creado"] },
    { id: 7, titulo: "Notificaciones duplicadas", descripcion: "Aparecen 2 notificaciones iguales.", fecha: "2025-01-09", estado: "resuelto", historial: ["Reporte creado", "Resuelto"] },
    { id: 8, titulo: "Agregar filtros avanzados", descripcion: "Filtros por fecha o prioridad.", fecha: "2025-01-04", estado: "resuelto", historial: ["Reporte creado", "Resuelto"] },
  ]);

  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const porPagina = 4;

  /* ===== MODAL ===== */
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [notaInterna, setNotaInterna] = useState("");

  const abrirDetalle = (reporte) => {
    setReporteSeleccionado(reporte);
    setNuevoEstado(reporte.estado);
    setNotaInterna("");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setReporteSeleccionado(null);
  };

  const guardarCambios = () => {
    const actualizados = reportes.map((rep) =>
      rep.id === reporteSeleccionado.id
        ? {
            ...rep,
            estado: nuevoEstado,
            historial: [...rep.historial, `Estado cambiado a ${nuevoEstado}`],
          }
        : rep
    );

    setReportes(actualizados);
    cerrarModal();
  };

  const colorEstadoBadge = (estado) => {
    switch (estado) {
      case "pendiente": return "danger";
      case "proceso": return "warning";
      case "resuelto": return "success";
      default: return "secondary";
    }
  };

  const busquedaDinamica = (texto) => {
    setBusqueda(texto);
    setPage(1);
  };

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, [estadoFiltro, page, busqueda]);

  const filtrados = useMemo(() => {
    let base =
      estadoFiltro === "todas"
        ? reportes
        : reportes.filter((r) => r.estado === estadoFiltro);

    if (!busqueda.trim()) return base;

    const texto = busqueda.toLowerCase();

    return base.filter(
      (r) =>
        r.titulo.toLowerCase().includes(texto) ||
        r.descripcion.toLowerCase().includes(texto) ||
        r.fecha.includes(texto)
    );
  }, [estadoFiltro, reportes, busqueda]);

  const mostrar = filtrados.slice((page - 1) * porPagina, page * porPagina);

  const getColor = (estado) =>
    estado === "pendiente"
      ? "#ff4d4f"
      : estado === "proceso"
      ? "#faad14"
      : estado === "resuelto"
      ? "#52c41a"
      : "#2f80ff";

  /* ===== PAGINADO (AGREGADO) ===== */
  const totalPaginas = Math.ceil(filtrados.length / porPagina);

  const informacion = {
    paginaActual: page,
    paginaAnterior: page > 1 ? page - 1 : null,
    paginaSiguiente: page < totalPaginas ? page + 1 : null,
  };

  const loadData = (nuevaPagina) => {
    if (nuevaPagina) setPage(nuevaPagina);
  };
  /* ===== FIN PAGINADO ===== */

  return (
    <div style={{ padding: "10px 20px" }}>
      <h2 style={{ marginBottom: 12 }}>Reportes del Sistema</h2>

      {/* 🔎 BUSCADOR */}
      <div className="d-flex justify-content-end mb-2 align-items-center gap-2">
        <input
          className="form-control"
          style={{ width: "220px" }}
          placeholder="Buscar…"
          onChange={(e) => busquedaDinamica(e.target.value)}
        />
        <button className="btn btn-success">
          <i className="bi bi-search"></i>
        </button>
      </div>

      {/* 🔘 FILTROS */}
      <div className="d-flex gap-2 mb-3">
        <button className={`btn btn-sm ${estadoFiltro === "todas" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => { setEstadoFiltro("todas"); setPage(1); }}>Todas</button>
        <button className={`btn btn-sm ${estadoFiltro === "pendiente" ? "btn-danger" : "btn-outline-danger"}`} onClick={() => { setEstadoFiltro("pendiente"); setPage(1); }}>Pendientes</button>
        <button className={`btn btn-sm ${estadoFiltro === "proceso" ? "btn-warning" : "btn-outline-warning"}`} onClick={() => { setEstadoFiltro("proceso"); setPage(1); }}>En proceso</button>
        <button className={`btn btn-sm ${estadoFiltro === "resuelto" ? "btn-success" : "btn-outline-success"}`} onClick={() => { setEstadoFiltro("resuelto"); setPage(1); }}>Resueltos</button>
      </div>

      {/* LISTA */}
      <motion.div>
        {loading ? "Cargando..." : mostrar.map((rep) => (
          <motion.div
            key={rep.id}
            whileHover={{ scale: 1.01 }}
            onClick={() => abrirDetalle(rep)}
            style={{
              cursor: "pointer",
              borderLeft: `4px solid ${getColor(rep.estado)}`,
              padding: "10px 12px",
              marginBottom: "8px",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{rep.titulo}</h3>
              <span style={{ fontSize: "11px", color: "#888" }}>{rep.fecha}</span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#555" }}>{rep.descripcion}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Paginación */}
      <div className="d-flex justify-content-start mt-3">
        <div className="btn-group">
          <button
            className="btn btn-outline-primary"
            disabled={!informacion.paginaAnterior}
            onClick={() => loadData(informacion.paginaAnterior)}
          >
            <i className="bi bi-chevron-compact-left"></i>
          </button>

          <button className="btn btn-primary">
            {informacion.paginaActual}
          </button>

          <button
            className="btn btn-outline-primary"
            disabled={!informacion.paginaSiguiente}
            onClick={() => loadData(informacion.paginaSiguiente)}
          >
            <i className="bi bi-chevron-compact-right"></i>
          </button>
        </div>
      </div>

      {/* 🪟 MODAL */}
      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{reporteSeleccionado?.titulo}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p><strong>Descripción:</strong> {reporteSeleccionado?.descripcion}</p>

          <p>
            <strong>Estado actual:</strong>{" "}
            <Badge bg={colorEstadoBadge(reporteSeleccionado?.estado)}>
              {reporteSeleccionado?.estado}
            </Badge>
          </p>

          <Form.Group className="mb-3">
            <Form.Label><strong>Cambiar estado</strong></Form.Label>
            <Form.Select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
              <option value="pendiente">Pendiente</option>
              <option value="proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
              <option value="cancelado">Cancelado</option>
            </Form.Select>
          </Form.Group>

          <strong>Historial:</strong>
          <ul>
            {reporteSeleccionado?.historial.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>

          <Form.Group>
            <Form.Label><strong>Nota interna</strong></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notaInterna}
              onChange={(e) => setNotaInterna(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>Cerrar</Button>
          <Button variant="success" onClick={guardarCambios}>Guardar cambios</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
