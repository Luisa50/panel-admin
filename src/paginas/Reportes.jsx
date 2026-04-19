import React, { useState, useMemo, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { useApp } from "../context/AppContext";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/reportes.css";

const REPORTE_API = `${API_URL}/Reporte`;

function etiquetaEstadoReporte(estado) {
  switch (estado) {
    case "pendiente":
      return "Pendiente";
    case "proceso":
      return "En proceso";
    case "resuelto":
      return "Resuelto";
    case "cancelado":
      return "Cancelado";
    default:
      return estado ? String(estado) : "Sin estado";
  }
}

export default function Reportes() {
  const { reportes = [], setReportes } = useApp();

  const [loading, setLoading] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);
  const porPagina = 8;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [notaInterna, setNotaInterna] = useState("");

  useEffect(() => {
    const obtenerReportes = async () => {
      try {
        setLoading(true);

        const res = await fetchWithAuth(REPORTE_API);
        if (!res) return;
        const data = await res.json();

        setReportes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener reportes:", error);
        setReportes([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerReportes();
  }, []);

  const abrirDetalle = async (reporte) => {
    try {
      const res = await fetchWithAuth(`${REPORTE_API}/${reporte.id}`);
      if (!res) return;
      const data = await res.json();

      setReporteSeleccionado({
        ...data,
        historial: data.historial || [],
      });

      setNuevoEstado(data.estado);
      setNotaInterna("");
      setMostrarModal(true);
    } catch (error) {
      console.error("Error al obtener detalle:", error);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setReporteSeleccionado(null);
  };

  const guardarCambios = async () => {
    if (!reporteSeleccionado) return;

    try {
      const patchRes = await fetchWithAuth(
        `${REPORTE_API}/${reporteSeleccionado.id}/estado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );
      if (!patchRes) return;

      const res = await fetchWithAuth(REPORTE_API);
      if (!res) return;
      const data = await res.json();
      setReportes(Array.isArray(data) ? data : []);

      cerrarModal();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const colorEstadoBadge = (estado) => {
    switch (estado) {
      case "pendiente":
        return "danger";
      case "proceso":
        return "warning";
      case "resuelto":
        return "success";
      case "cancelado":
        return "secondary";
      default:
        return "secondary";
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

  const resumenReportes = useMemo(() => {
    const lista = Array.isArray(reportes) ? reportes : [];
    const total = lista.length;
    const pendiente = lista.filter((r) => r.estado === "pendiente").length;
    const proceso = lista.filter((r) => r.estado === "proceso").length;
    const resuelto = lista.filter((r) => r.estado === "resuelto").length;
    const cancelado = lista.filter((r) => r.estado === "cancelado").length;
    const cerrados = resuelto + cancelado;
    const pctCerrados = total > 0 ? Math.round((cerrados / total) * 100) : 0;
    return { total, pendiente, proceso, resuelto, cancelado, pctCerrados };
  }, [reportes]);

  const mostrar = filtrados.slice((page - 1) * porPagina, page * porPagina);

  const totalPaginas = Math.ceil(filtrados.length / porPagina);

  const informacion = {
    paginaActual: page,
    paginaAnterior: page > 1 ? page - 1 : null,
    paginaSiguiente: page < totalPaginas ? page + 1 : null,
  };

  const loadData = (nuevaPagina) => {
    if (nuevaPagina) setPage(nuevaPagina);
  };

  const etiquetaFiltro =
    estadoFiltro === "todas"
      ? "Todos los estados"
      : etiquetaEstadoReporte(estadoFiltro);

  const hayBusqueda = Boolean(busqueda.trim());

  const textoConclusion =
    resumenReportes.total === 0
      ? "Aún no hay reportes registrados. Cuando existan incidencias, aquí podrás filtrarlas, abrir el detalle y actualizar el estado."
      : `Resumen: ${resumenReportes.pctCerrados}% cerrados o cancelados; ${resumenReportes.pendiente} pendientes y ${resumenReportes.proceso} en curso.`;

  const filtros = [
    { id: "todas", label: "Todas", variant: "primary", outline: "outline-primary" },
    { id: "pendiente", label: "Pendientes", variant: "danger", outline: "outline-danger" },
    { id: "proceso", label: "En proceso", variant: "warning", outline: "outline-warning" },
    { id: "resuelto", label: "Resueltos", variant: "success", outline: "outline-success" },
  ];

  return (
    <div className="reportes-pagina">
      <header className="reportes-hero">
        <div className="reportes-hero-icon" aria-hidden>
          <i className="bi bi-mailbox-flag" />
        </div>
        <div className="reportes-hero-texto">
          <h1 className="reportes-hero-titulo">Reportes e incidencias</h1>
          <p className="reportes-hero-sub">
            Consulta, filtra y gestiona los reportes registrados en la
            plataforma. Pulsa una fila para ver detalle, historial y cambiar
            estado.
          </p>
        </div>
      </header>

      <section className="reportes-kpis" aria-label="Resumen numérico">
        <article className="reportes-kpi reportes-kpi--total">
          <span className="reportes-kpi-label">Total</span>
          <strong className="reportes-kpi-valor">{resumenReportes.total}</strong>
          <span className="reportes-kpi-hint">
            {resumenReportes.cancelado} cancelados
          </span>
        </article>
        <article className="reportes-kpi reportes-kpi--pendiente">
          <span className="reportes-kpi-label">Pendientes</span>
          <strong className="reportes-kpi-valor">
            {resumenReportes.pendiente}
          </strong>
        </article>
        <article className="reportes-kpi reportes-kpi--proceso">
          <span className="reportes-kpi-label">En proceso</span>
          <strong className="reportes-kpi-valor">
            {resumenReportes.proceso}
          </strong>
        </article>
        <article className="reportes-kpi reportes-kpi--resuelto">
          <span className="reportes-kpi-label">Resueltos</span>
          <strong className="reportes-kpi-valor">
            {resumenReportes.resuelto}
          </strong>
          <span className="reportes-kpi-hint">
            {resumenReportes.pctCerrados}% cerrados / cancel. del total
          </span>
        </article>
      </section>

      <div className="card reportes-panel shadow-sm border-0">
        <div className="card-body reportes-panel-body">
          <div className="reportes-toolbar">
            <div
              className="btn-group flex-wrap reportes-filtros"
              role="group"
              aria-label="Filtrar por estado"
            >
              {filtros.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`btn btn-sm ${
                    estadoFiltro === f.id
                      ? `btn-${f.variant}`
                      : `btn-${f.outline}`
                  }`}
                  onClick={() => {
                    setEstadoFiltro(f.id);
                    setPage(1);
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="input-group reportes-buscador">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted" aria-hidden />
              </span>
              <input
                type="search"
                className="form-control border-start-0"
                placeholder="Buscar por título, descripción o fecha…"
                value={busqueda}
                onChange={(e) => busquedaDinamica(e.target.value)}
                aria-label="Buscar reportes"
              />
            </div>
          </div>

          <p className="reportes-meta text-muted small mb-3">
            <strong>{etiquetaFiltro}</strong>
            {hayBusqueda && (
              <>
                {" "}
                · {filtrados.length} resultado(s) con la búsqueda actual
              </>
            )}
            {!hayBusqueda && filtrados.length !== resumenReportes.total && (
              <>
                {" "}
                · {filtrados.length} visible(s) con este filtro
              </>
            )}
            {!hayBusqueda && estadoFiltro === "todas" && (
              <> · {filtrados.length} registro(s) en total</>
            )}
          </p>

          <div className="table-responsive reportes-tabla-wrap">
            {loading ? (
              <div className="reportes-cargando text-center py-5 text-muted">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Cargando reportes…
              </div>
            ) : mostrar.length > 0 ? (
              <table className="table table-hover align-middle mb-0 reportes-tabla">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="text-muted small">
                      #
                    </th>
                    <th scope="col">Título</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {mostrar.map((rep, idx) => (
                    <tr
                      key={rep.id}
                      className="reportes-fila-detalle"
                      onClick={() => abrirDetalle(rep)}
                    >
                      <td className="text-muted small">
                        {(page - 1) * porPagina + idx + 1}
                      </td>
                      <td className="fw-medium">{rep.titulo}</td>
                      <td className="text-nowrap small">{rep.fecha}</td>
                      <td>
                        <span
                          className={`badge bg-${colorEstadoBadge(rep.estado)}`}
                        >
                          {etiquetaEstadoReporte(rep.estado)}
                        </span>
                      </td>
                      <td className="reportes-col-desc small text-muted">
                        {rep.descripcion}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="reportes-vacio text-center py-5">
                <div className="reportes-vacio-icon mb-3" aria-hidden>
                  <i className="bi bi-inbox" />
                </div>
                <p className="mb-1 fw-medium text-secondary">
                  No hay reportes con estos criterios
                </p>
                <p className="small text-muted mb-0">
                  Prueba otro estado o borra el texto de búsqueda.
                </p>
              </div>
            )}
          </div>

          {filtrados.length > porPagina && (
            <nav
              className="reportes-paginacion d-flex justify-content-center justify-content-md-end mt-3"
              aria-label="Paginación"
            >
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  disabled={!informacion.paginaAnterior}
                  onClick={() => loadData(informacion.paginaAnterior)}
                  aria-label="Página anterior"
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <span className="btn btn-sm btn-light disabled text-dark">
                  {informacion.paginaActual} / {Math.max(1, totalPaginas)}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  disabled={!informacion.paginaSiguiente}
                  onClick={() => loadData(informacion.paginaSiguiente)}
                  aria-label="Página siguiente"
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>

      <div className="alert alert-light border reportes-conclusion mt-3 mb-0">
        <i className="bi bi-info-circle me-2 text-primary" aria-hidden />
        <span className="small">{textoConclusion}</span>
      </div>

      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton={false} className="align-items-center">
          <Modal.Title className="mb-0">{reporteSeleccionado?.titulo}</Modal.Title>
          <button
            type="button"
            className="btn btn-link p-1 text-secondary text-decoration-none border-0 lh-1 ms-auto"
            onClick={cerrarModal}
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </Modal.Header>

        <Modal.Body>
          <p className="mb-2">
            <strong>Descripción del caso</strong>
          </p>
          <p className="text-muted small mb-3">
            {reporteSeleccionado?.descripcion}
          </p>

          <p>
            <strong>Estado en el flujo de gestión</strong>{" "}
            <Badge bg={colorEstadoBadge(reporteSeleccionado?.estado)}>
              {etiquetaEstadoReporte(reporteSeleccionado?.estado)}
            </Badge>
          </p>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Actualizar estado</strong>
            </Form.Label>
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

          <strong>Historial de seguimiento</strong>
          <ul className="small text-muted mt-1">
            {reporteSeleccionado?.historial?.length > 0 ? (
              reporteSeleccionado.historial.map((h, i) => (
                <li key={i}>{h}</li>
              ))
            ) : (
              <li>Sin movimientos registrados en el historial.</li>
            )}
          </ul>

          <Form.Group>
            <Form.Label>
              <strong>Nota interna</strong>
            </Form.Label>
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
            <X className="me-1" size={18} strokeWidth={1.75} aria-hidden />
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            <Save className="me-1 text-white" size={18} strokeWidth={1.75} aria-hidden />
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
