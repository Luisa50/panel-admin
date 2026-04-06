import React, { useState, useMemo, useEffect } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { useApp } from "../context/AppContext";
import "../estilos/informes.css";
import "../estilos/reportes.css";

const API = "https://healthymind10.runasp.net/api/Reporte";

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
  const porPagina = 4;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [notaInterna, setNotaInterna] = useState("");

  useEffect(() => {
    const obtenerReportes = async () => {
      try {
        setLoading(true);

        const res = await fetch(API);
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
      const res = await fetch(`${API}/${reporte.id}`);
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
      await fetch(`${API}/${reporteSeleccionado.id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: nuevoEstado,
        }),
      });

      const res = await fetch(API);
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
      ? "todos los estados"
      : `estado «${etiquetaEstadoReporte(estadoFiltro)}»`;

  const hayBusqueda = Boolean(busqueda.trim());

  const textoConclusion =
    resumenReportes.total === 0
      ? "No se hallaron reportes en el sistema en el momento de la consulta; el seguimiento deberá reevaluarse cuando exista carga de incidencias."
      : `En conjunto, el ${resumenReportes.pctCerrados}% de los reportes se encuentran cerrados o cancelados, mientras que ${resumenReportes.pendiente} permanecen pendientes y ${resumenReportes.proceso} en curso. La lectura de estos balances debe integrarse con los procedimientos de escalamiento y comunicación institucional vigentes.`;

  return (
    <div className="reportes-container">
      <h2 className="reportes-title">
        Informe operativo sobre reportes e incidencias
      </h2>
      <p className="reportes-subtitulo">
        Documento de trabajo basado en los datos devueltos por el servicio de
        reportes. Las herramientas inferiores permiten filtrar y localizar
        casos; la interacción con cada fila conserva el flujo de gestión del
        módulo.
      </p>

      <section className="reportes-informe-bloque">
        <h3>1. Introducción</h3>
        <p className="informe-parrafo">
          Este informe describe la situación de los reportes o incidencias
          registrados en HealthyMind, según la última sincronización obtenida
          mediante el listado general del API. Su propósito es ofrecer una
          lectura administrativa coherente —introducción, desarrollo,
          observaciones y conclusiones— sin sustituir los formatos oficiales de
          escalamiento que la entidad aplique.
        </p>
      </section>

      <section className="reportes-informe-bloque">
        <h3>2. Desarrollo y análisis de los datos</h3>
        <p className="informe-parrafo">
          El sistema registra actualmente <strong>{resumenReportes.total}</strong>{" "}
          reporte(s) en total. De ellos, <strong>{resumenReportes.pendiente}</strong>{" "}
          se clasifican como pendientes, <strong>{resumenReportes.proceso}</strong>{" "}
          en proceso, <strong>{resumenReportes.resuelto}</strong> resueltos y{" "}
          <strong>{resumenReportes.cancelado}</strong> cancelados. La proporción
          de casos cerrados o cancelados sobre el universo total es del{" "}
          <strong>{resumenReportes.pctCerrados}%</strong>.
        </p>
        <p className="informe-parrafo">
          Para la visualización inmediata del listado se aplica un criterio de{" "}
          <strong>{etiquetaFiltro}</strong>
          {hayBusqueda && (
            <>
              , complementado con un texto de búsqueda que reduce el conjunto a{" "}
              <strong>{filtrados.length}</strong> registro(s) coincidente(s).
            </>
          )}
          {!hayBusqueda && (
            <>
              , mostrándose en esta vista <strong>{filtrados.length}</strong>{" "}
              registro(s) acorde a dicho criterio.
            </>
          )}
        </p>
      </section>

      <section className="reportes-informe-bloque">
        <h3>3. Observaciones</h3>
        <p className="informe-parrafo">
          Los conteos se calculan sobre el arreglo de reportes mantenido en la
          aplicación tras la respuesta del endpoint; cualquier actualización
          concurrente en otros clientes podría diferir levemente hasta la
          siguiente recarga. La tabla siguiente permite abrir el detalle de cada
          caso para revisar descripción, historial y estado.
        </p>
      </section>

      <p className="informe-parrafo" style={{ fontSize: 13, color: "#555" }}>
        <strong>Herramientas de consulta:</strong> filtro por estado y búsqueda
        por título, descripción o fecha.
      </p>

      <div className="buscador-container">
        <input
          className="form-control buscador-input"
          placeholder="Buscar por título, descripción o fecha…"
          onChange={(e) => busquedaDinamica(e.target.value)}
        />
        <button type="button" className="btn btn-success">
          <i className="bi bi-search"></i>
        </button>
      </div>

      <div className="filtros-container">
        <button
          type="button"
          className={`btn btn-sm ${estadoFiltro === "todas" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => {
            setEstadoFiltro("todas");
            setPage(1);
          }}
        >
          Todas
        </button>

        <button
          type="button"
          className={`btn btn-sm ${estadoFiltro === "pendiente" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => {
            setEstadoFiltro("pendiente");
            setPage(1);
          }}
        >
          Pendientes
        </button>

        <button
          type="button"
          className={`btn btn-sm ${estadoFiltro === "proceso" ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => {
            setEstadoFiltro("proceso");
            setPage(1);
          }}
        >
          En proceso
        </button>

        <button
          type="button"
          className={`btn btn-sm ${estadoFiltro === "resuelto" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => {
            setEstadoFiltro("resuelto");
            setPage(1);
          }}
        >
          Resueltos
        </button>
      </div>

      <section className="reportes-informe-bloque">
        <h3>4. Listado para gestión operativa</h3>
        <p className="informe-parrafo" style={{ marginBottom: 8 }}>
          Seleccione una fila para abrir el detalle, actualizar el estado o
          revisar el historial. Página {informacion.paginaActual} de{" "}
          {Math.max(1, totalPaginas)}.
        </p>
        {loading ? (
          <p>Cargando...</p>
        ) : mostrar.length > 0 ? (
          <table className="reportes-tabla-informe">
            <thead>
              <tr>
                <th>N.º</th>
                <th>Título</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {mostrar.map((rep, idx) => (
                <tr
                  key={rep.id}
                  className="reportes-fila-detalle"
                  onClick={() => abrirDetalle(rep)}
                >
                  <td>{(page - 1) * porPagina + idx + 1}</td>
                  <td>{rep.titulo}</td>
                  <td>{rep.fecha}</td>
                  <td>{etiquetaEstadoReporte(rep.estado)}</td>
                  <td>{rep.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#666" }}>
            No hay reportes que coincidan con los criterios actuales.
          </p>
        )}
      </section>

      <section className="reportes-informe-bloque">
        <h3>5. Conclusiones</h3>
        <p className="informe-parrafo">{textoConclusion}</p>
      </section>

      <div className="paginacion-container">
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={!informacion.paginaAnterior}
            onClick={() => loadData(informacion.paginaAnterior)}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <button type="button" className="btn btn-primary">
            {informacion.paginaActual}
          </button>

          <button
            type="button"
            className="btn btn-outline-primary"
            disabled={!informacion.paginaSiguiente}
            onClick={() => loadData(informacion.paginaSiguiente)}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{reporteSeleccionado?.titulo}</Modal.Title>
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
