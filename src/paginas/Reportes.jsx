import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { useApp } from "../context/AppContext";
import "../estilos/reportes.css";

export default function Reportes() {
  const { reportes = [], setReportes } = useApp();

  const [loading, setLoading] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const porPagina = 4;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [notaInterna, setNotaInterna] = useState("");

  const abrirDetalle = (reporte) => {
    setReporteSeleccionado({
      ...reporte,
      historial: reporte.historial || []
    });
    setNuevoEstado(reporte.estado);
    setNotaInterna("");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setReporteSeleccionado(null);
  };

  const guardarCambios = () => {
    if (!reporteSeleccionado) return;

    const fechaHora = new Date().toLocaleString();

    const nuevaEntradaHistorial = [
      `Estado cambiado a ${nuevoEstado} (${fechaHora})`
    ];

    if (notaInterna.trim()) {
      nuevaEntradaHistorial.push(
        `Nota interna: ${notaInterna} (${fechaHora})`
      );
    }

    const actualizados = reportes.map((rep) =>
      rep.id === reporteSeleccionado.id
        ? {
            ...rep,
            estado: nuevoEstado,
            historial: [
              ...(rep.historial || []),
              ...nuevaEntradaHistorial
            ],
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
      case "cancelado": return "secondary";
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
        r.titulo?.toLowerCase().includes(texto) ||
        r.descripcion?.toLowerCase().includes(texto) ||
        r.fecha?.includes(texto)
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
      : "#6c757d";

  const totalPaginas = Math.ceil(filtrados.length / porPagina);

  const informacion = {
    paginaActual: page,
    paginaAnterior: page > 1 ? page - 1 : null,
    paginaSiguiente: page < totalPaginas ? page + 1 : null,
  };

  const loadData = (nuevaPagina) => {
    if (nuevaPagina) setPage(nuevaPagina);
  };

  return (
    <div className="reportes-container">
      <h2 className="reportes-title">Reportes del Sistema</h2>

      <div className="buscador-container">
        <input
          className="form-control buscador-input"
          placeholder="Buscar…"
          onChange={(e) => busquedaDinamica(e.target.value)}
        />
        <button className="btn btn-success">
          <i className="bi bi-search"></i>
        </button>
      </div>

      <div className="filtros-container">
        <button
          className={`btn btn-sm ${estadoFiltro === "todas" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => { setEstadoFiltro("todas"); setPage(1); }}
        >
          Todas
        </button>

        <button
          className={`btn btn-sm ${estadoFiltro === "pendiente" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => { setEstadoFiltro("pendiente"); setPage(1); }}
        >
          Pendientes
        </button>

        <button
          className={`btn btn-sm ${estadoFiltro === "proceso" ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => { setEstadoFiltro("proceso"); setPage(1); }}
        >
          En proceso
        </button>

        <button
          className={`btn btn-sm ${estadoFiltro === "resuelto" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => { setEstadoFiltro("resuelto"); setPage(1); }}
        >
          Resueltos
        </button>
      </div>

      <motion.div>
        {loading ? (
          <p>Cargando...</p>
        ) : mostrar.length > 0 ? (
          mostrar.map((rep) => (
            <motion.div
              key={rep.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => abrirDetalle(rep)}
              className="reporte-card"
              style={{ borderLeft: `4px solid ${getColor(rep.estado)}` }}
            >
              <div className="reporte-header">
                <h3 className="reporte-titulo">{rep.titulo}</h3>
                <span className="reporte-fecha">{rep.fecha}</span>
              </div>
              <p className="reporte-descripcion">{rep.descripcion}</p>
            </motion.div>
          ))
        ) : (
          <p>No hay reportes disponibles</p>
        )}
      </motion.div>

      <div className="paginacion-container">
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
            <Form.Select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
              <option value="cancelado">Cancelado</option>
            </Form.Select>
          </Form.Group>

          <strong>Historial:</strong>
          <ul>
            {reporteSeleccionado?.historial?.length > 0 ? (
              reporteSeleccionado.historial.map((h, i) => (
                <li key={i}>{h}</li>
              ))
            ) : (
              <li>No hay historial disponible</li>
            )}
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
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
          <Button variant="success" onClick={guardarCambios}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
