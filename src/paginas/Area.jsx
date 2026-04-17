import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/area.css";

export default function Area() {
  const [areas, setAreas] = useState([]);
  const [psicologos, setPsicologos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [edicion, setEdicion] = useState(null);
  const [psiSeleccionado, setPsiSeleccionado] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const botonDisparadorRef = useRef(null);

  const cargarPsicologos = useCallback(async () => {
    try {
      const res = await fetchWithAuth(
        `${API_URL}/psicologo/listar?Pagina=1&TamanoPagina=500`
      );
      if (!res?.ok) return;
      const json = await res.json();
      const lista = json?.resultados ?? json?.resultado ?? [];
      setPsicologos(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const cargarAreas = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_URL}/Area`);
      if (!res) return;
      const data = await res.json();
      setAreas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setLoading(true);
      await Promise.all([cargarPsicologos(), cargarAreas()]);
      if (!cancelado) setLoading(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [cargarAreas, cargarPsicologos]);

  /** Bloquea scroll del body mientras el modal está abierto (comportamiento Bootstrap). */
  useEffect(() => {
    if (!mostrarModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mostrarModal]);

  /** Cierra con Escape. */
  useEffect(() => {
    if (!mostrarModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") cerrarModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mostrarModal]);

  /** Enfoca el selector al abrir (evita foco “perdido” y advertencias de aria-hidden). */
  useEffect(() => {
    if (!mostrarModal || !edicion) return;
    const id = window.requestAnimationFrame(() => {
      const sel = document.getElementById("selectPsiArea");
      sel?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [mostrarModal, edicion]);

  const abrirEdicion = (area, event) => {
    const actual =
      area.areaPsicologo?.psiCodigo ??
      area.areaPsiFk ??
      area.psiCodigo ??
      area.psiFk ??
      null;
    if (event?.currentTarget instanceof HTMLElement) {
      botonDisparadorRef.current = event.currentTarget;
    }
    setEdicion({
      areaCodigo: area.areaCodigo,
      areaNombre: area.areaNombre,
    });
    setPsiSeleccionado(
      actual !== undefined && actual !== null ? String(actual) : ""
    );
    setMostrarModal(true);
  };

  /** Construye el objeto anidado que usa la tabla a partir del listado de psicólogos. */
  const areaPsicologoDesdeSeleccion = (valorSelect) => {
    if (valorSelect === "" || valorSelect == null) return null;
    const p = psicologos.find(
      (x) => String(x.psiCodigo) === String(valorSelect)
    );
    if (!p) return null;
    return {
      psiCodigo: p.psiCodigo,
      psiNombre: p.psiNombre,
      psiApellido: p.psiApellido,
      psiDocumento: p.psiDocumento,
      psiEspecialidad: p.psiEspecialidad,
      psiTelefono: p.psiTelefono,
      psiCorreoInstitucional: p.psiCorreoInstitucional,
    };
  };

  /** Cierra el modal y limpia el estado de edición; devuelve foco al botón que abrió. */
  const cerrarModal = () => {
    setMostrarModal(false);
    setEdicion(null);
    setPsiSeleccionado("");
    window.requestAnimationFrame(() => {
      const btn = botonDisparadorRef.current;
      if (btn && typeof btn.focus === "function") {
        btn.focus({ preventScroll: true });
      }
      botonDisparadorRef.current = null;
    });
  };

  const aplicarCambioEnEstadoLocal = () => {
    if (!edicion) return;
    const nuevoPsi = areaPsicologoDesdeSeleccion(psiSeleccionado);
    setAreas((prev) =>
      prev.map((a) =>
        a.areaCodigo === edicion.areaCodigo
          ? {
              ...a,
              areaNombre: edicion.areaNombre,
              areaPsiFk: psiSeleccionado === "" ? null : Number(psiSeleccionado),
              areaPsicologo: nuevoPsi,
            }
          : a
      )
    );
  };

  const guardarReasignacion = async (e) => {
    e.preventDefault();
    if (!edicion) return;
    setGuardando(true);
    try {
      const areaPsiFk =
        psiSeleccionado === "" ? null : Number(psiSeleccionado);
      const res = await fetchWithAuth(
        `${API_URL}/Area/editar/${edicion.areaCodigo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            areaNombre: edicion.areaNombre,
            areaPsiFk,
          }),
        }
      );
      if (!res) return;
      if (res.ok) {
        aplicarCambioEnEstadoLocal();
        alert("Psicólogo actualizado correctamente.");
        cerrarModal();
      } else {
        const txt = await res.text();
        console.error("Error API área:", res.status, txt);
        const usarEstadoLocal =
          res.status === 404 ||
          res.status === 405 ||
          res.status === 501 ||
          res.status >= 500;
        if (usarEstadoLocal) {
          aplicarCambioEnEstadoLocal();
          cerrarModal();
          alert(
            "El servidor no pudo confirmar el cambio. Se aplicó solo en esta sesión."
          );
        } else {
          alert(
            `No se pudo guardar la asignación (código ${res.status}).`
          );
        }
      }
    } catch (error) {
      console.error(error);
      aplicarCambioEnEstadoLocal();
      cerrarModal();
      alert(
        "No hay conexión con el servidor. El psicólogo se actualizó solo en esta sesión."
      );
    } finally {
      setGuardando(false);
    }
  };

  const modalContenido =
    mostrarModal && edicion ? (
      <>
        <div
          className="modal-backdrop fade show"
          aria-hidden="true"
          onClick={cerrarModal}
        />
        <div
          className="modal fade show d-block"
          id="modalReasignarArea"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalReasignarAreaLabel"
          tabIndex={-1}
          style={{ zIndex: 1055 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) cerrarModal();
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content area-modal-reasignar">
              <div className="modal-header">
                <h2 className="modal-title h5" id="modalReasignarAreaLabel">
                  Reasignar psicólogo
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarModal}
                  aria-label="Cerrar"
                />
              </div>
              <form onSubmit={guardarReasignacion}>
                <div className="modal-body">
                  <p className="area-modal-area-nombre mb-2">
                    <span className="text-muted">Área:</span>{" "}
                    <strong>{edicion.areaNombre}</strong>
                  </p>
                  <p className="area-modal-hint text-muted small mb-3">
                    Selecciona el profesional que acompañará esta área en el
                    trimestre académico vigente.
                  </p>
                  <label
                    className="form-label small text-muted mb-1"
                    htmlFor="inputNombreArea"
                  >
                    Nombre del área
                  </label>
                  <input
                    id="inputNombreArea"
                    type="text"
                    className="form-control form-control-sm mb-3"
                    value={edicion.areaNombre}
                    onChange={(e) =>
                      setEdicion((prev) =>
                        prev ? { ...prev, areaNombre: e.target.value } : prev
                      )
                    }
                    required
                  />
                  <label
                    className="form-label small text-muted mb-1"
                    htmlFor="selectPsiArea"
                  >
                    Psicólogo asignado
                  </label>
                  <select
                    id="selectPsiArea"
                    className="form-select form-select-sm area-select-psi"
                    value={psiSeleccionado}
                    onChange={(e) => setPsiSeleccionado(e.target.value)}
                  >
                    <option value="">Sin asignar</option>
                    {psicologos.map((p) => (
                      <option key={p.psiCodigo} value={String(p.psiCodigo)}>
                        {p.psiNombre} {p.psiApellido}
                        {p.psiEspecialidad
                          ? ` · ${p.psiEspecialidad}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={cerrarModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    disabled={guardando || !edicion}
                  >
                    {guardando ? "Guardando…" : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    ) : null;

  return (
    <div className="area-container">
      {typeof document !== "undefined" &&
        modalContenido &&
        createPortal(modalContenido, document.body)}

      <div className="area-header">
        <h2>Áreas</h2>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="area-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Psicólogo</th>
              <th>Documento</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th className="area-col-acciones">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {areas.map((area) => (
              <tr key={area.areaCodigo}>
                <td>{area.areaCodigo}</td>
                <td>{area.areaNombre}</td>

                <td>
                  {area.areaPsicologo
                    ? `${area.areaPsicologo.psiNombre} ${area.areaPsicologo.psiApellido}`
                    : "—"}
                </td>

                <td>{area.areaPsicologo?.psiDocumento || "—"}</td>
                <td>{area.areaPsicologo?.psiEspecialidad || "—"}</td>
                <td>{area.areaPsicologo?.psiTelefono || "—"}</td>
                <td>{area.areaPsicologo?.psiCorreoInstitucional || "—"}</td>
                <td className="area-col-acciones">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary area-btn-editar"
                    title="Cambiar psicólogo asignado"
                    onClick={(e) => abrirEdicion(area, e)}
                  >
                    <i className="bi bi-pencil" aria-hidden="true" />
                    <span className="area-btn-editar-text">Editar</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
