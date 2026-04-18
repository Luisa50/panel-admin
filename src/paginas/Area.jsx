import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/centrosnodos.css";
import "../estilos/area.css";
import Modalver from "../componentes/modalsPost/ModalVer.jsx";
import EncabezadoListadoMaestro from "../componentes/EncabezadoListadoMaestro.jsx";
import MaestroAcciones from "../componentes/MaestroAcciones.jsx";

function abrirModalPorId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  Modal.getOrCreateInstance(el).show();
}

export default function Area() {
  const [areas, setAreas] = useState([]);
  const [psicologos, setPsicologos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [modo, setModo] = useState("crear");
  const [edicion, setEdicion] = useState(null);
  const [psiSeleccionado, setPsiSeleccionado] = useState("");
  const [dataVer, setDataVer] = useState({});

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
      if (res.status === 404) {
        setAreas([]);
        return;
      }
      if (!res.ok) {
        setAreas([]);
        return;
      }
      const data = await res.json();
      setAreas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setAreas([]);
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

  const cerrarModalForm = () => {
    document.getElementById("btnCerrarModalArea")?.click();
  };

  const abrirNuevaArea = () => {
    setModo("crear");
    setEdicion({ areaCodigo: null, areaNombre: "" });
    setPsiSeleccionado("");
    window.requestAnimationFrame(() => abrirModalPorId("modalAreaForm"));
  };

  const abrirEdicion = (area, event) => {
    const actual =
      area.areaPsicologo?.psiCodigo ??
      area.areaPsiFk ??
      area.areaPsicCodFk ??
      null;
    if (event?.currentTarget instanceof HTMLElement) {
      botonDisparadorRef.current = event.currentTarget;
    }
    setModo("editar");
    setEdicion({
      areaCodigo: area.areaCodigo,
      areaNombre: area.areaNombre ?? "",
    });
    setPsiSeleccionado(
      actual !== undefined && actual !== null ? String(actual) : ""
    );
    window.requestAnimationFrame(() => abrirModalPorId("modalAreaForm"));
  };

  const handleVer = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/Area/${id}`);
      if (!res?.ok) return;
      const json = await res.json();
      const item = Array.isArray(json) ? json[0] : json;
      setDataVer(item ?? {});
      window.requestAnimationFrame(() => abrirModalPorId("modalVerArea"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditar = (id) => {
    const area = areas.find((a) => a.areaCodigo === id);
    if (area) abrirEdicion(area, null);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta área? (baja lógica)")) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/Area/eliminar/${id}`, {
        method: "PUT",
      });
      if (res?.status === 403) {
        alert(
          "No tienes permiso para eliminar áreas. Solo el administrador puede hacerlo."
        );
        return;
      }
      if (res?.ok) {
        alert("Área eliminada correctamente.");
        await cargarAreas();
        return;
      }
      const txt = await res?.text();
      alert(`No se pudo eliminar (${res?.status}). ${txt ?? ""}`);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const cuerpoAreaDto = () => ({
    areaNombre: (edicion?.areaNombre ?? "").trim(),
    psicologoCodigo:
      psiSeleccionado === "" || psiSeleccionado == null
        ? null
        : Number(psiSeleccionado),
  });

  const guardarArea = async (e) => {
    e.preventDefault();
    if (!edicion) return;
    setGuardando(true);
    try {
      const cuerpo = cuerpoAreaDto();
      if (modo === "crear") {
        const res = await fetchWithAuth(`${API_URL}/Area`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cuerpo),
        });
        if (res?.ok) {
          alert("Área creada correctamente.");
          cerrarModalForm();
          setEdicion(null);
          await cargarAreas();
        } else {
          const txt = await res?.text();
          alert(`No se pudo crear (${res?.status}). ${txt ?? ""}`);
        }
        return;
      }

      const res = await fetchWithAuth(
        `${API_URL}/Area/editar/${edicion.areaCodigo}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cuerpo),
        }
      );
      if (res?.ok) {
        alert("Área actualizada correctamente.");
        cerrarModalForm();
        setEdicion(null);
        await cargarAreas();
        window.requestAnimationFrame(() => {
          const btn = botonDisparadorRef.current;
          if (btn && typeof btn.focus === "function") {
            btn.focus({ preventScroll: true });
          }
          botonDisparadorRef.current = null;
        });
      } else {
        const txt = await res?.text();
        alert(`No se pudo guardar (${res?.status}). ${txt ?? ""}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="centro-container area-pagina">
      <EncabezadoListadoMaestro
        titulo="Áreas"
        mostrarBusqueda={false}
        onNuevo={abrirNuevaArea}
        tituloBotonNuevo="Nueva área"
      />

      <div
        className="modal fade"
        id="modalAreaForm"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content area-modal-reasignar">
            <div className="modal-header">
              <h2 className="modal-title h5">
                {modo === "crear" ? "Nueva área" : "Editar área"}
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              />
            </div>
            <form onSubmit={guardarArea}>
              <div className="modal-body">
                {modo === "editar" && edicion?.areaCodigo != null ? (
                  <p className="text-muted small mb-3">
                    Código: <strong>{edicion.areaCodigo}</strong>
                  </p>
                ) : null}
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
                  value={edicion?.areaNombre ?? ""}
                  onChange={(e) =>
                    setEdicion((prev) =>
                      prev
                        ? { ...prev, areaNombre: e.target.value }
                        : { areaCodigo: null, areaNombre: e.target.value }
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
                      {p.psiEspecialidad ? ` · ${p.psiEspecialidad}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  id="btnCerrarModalArea"
                  className="btn btn-sm btn-outline-secondary"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setEdicion(null);
                    setPsiSeleccionado("");
                  }}
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

      <Modalver
        id="modalVerArea"
        titulo="Detalle del área"
        data={dataVer}
        campos={[
          { nombre: "areaCodigo", label: "Código" },
          { nombre: "areaNombre", label: "Nombre" },
          { nombre: "areaPsicologo.psiNombre", label: "Psicólogo (nombre)" },
          { nombre: "areaPsicologo.psiApellido", label: "Psicólogo (apellido)" },
          { nombre: "areaPsicologo.psiDocumento", label: "Documento" },
          { nombre: "areaPsicologo.psiEspecialidad", label: "Especialidad" },
          { nombre: "areaPsicologo.psiTelefono", label: "Teléfono" },
          {
            nombre: "areaPsicologo.psiCorreoInstitucional",
            label: "Correo",
          },
        ]}
      />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="centro-table area-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Psicólogo</th>
              <th>Documento</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Acciones</th>
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
                <td>
                  <MaestroAcciones
                    id={area.areaCodigo}
                    onVer={handleVer}
                    onEditar={handleEditar}
                    onEliminar={handleEliminar}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
