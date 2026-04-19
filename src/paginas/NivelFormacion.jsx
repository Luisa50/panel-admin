import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X, Save } from "lucide-react";
import { Modal } from "bootstrap";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/centrosnodos.css";
import Modalver from "../componentes/modalsPost/ModalVer.jsx";
import EncabezadoListadoMaestro from "../componentes/EncabezadoListadoMaestro.jsx";
import MaestroAcciones from "../componentes/MaestroAcciones.jsx";
import PaginacionTablaMinimal, {
  LISTADO_TAM_PAGINA,
} from "../componentes/PaginacionTablaMinimal.jsx";

function abrirModalPorId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  Modal.getOrCreateInstance(el).show();
}

export default function NivelFormacion() {
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [modo, setModo] = useState("crear");
  const [idEditar, setIdEditar] = useState(null);
  const [formData, setFormData] = useState({
    nivForNombre: "",
    nivForDescripcion: "",
  });
  const [dataVer, setDataVer] = useState({});
  const [paginaLista, setPaginaLista] = useState(1);

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchWithAuth(`${API_URL}/NivelFormacion`);
      if (!res?.ok) {
        setError("No se pudieron cargar los niveles");
        setNiveles([]);
        return;
      }
      const data = await res.json();
      setNiveles(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los niveles");
      setNiveles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const nivelesFiltrados = niveles.filter((n) => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return true;
    return (
      (n.nivForNombre && n.nivForNombre.toLowerCase().includes(t)) ||
      (n.nivForDescripcion && n.nivForDescripcion.toLowerCase().includes(t))
    );
  });

  useEffect(() => {
    setPaginaLista(1);
  }, [busqueda]);

  const totalPaginasNiveles = Math.max(
    1,
    Math.ceil(nivelesFiltrados.length / LISTADO_TAM_PAGINA)
  );
  const paginaNivelesSegura = Math.min(paginaLista, totalPaginasNiveles);
  const nivelesPagina = useMemo(() => {
    const ini = (paginaNivelesSegura - 1) * LISTADO_TAM_PAGINA;
    return nivelesFiltrados.slice(ini, ini + LISTADO_TAM_PAGINA);
  }, [nivelesFiltrados, paginaNivelesSegura]);

  useEffect(() => {
    setPaginaLista((p) => Math.min(p, totalPaginasNiveles));
  }, [totalPaginasNiveles]);

  const limpiarForm = () => {
    setFormData({ nivForNombre: "", nivForDescripcion: "" });
    setModo("crear");
    setIdEditar(null);
  };

  const abrirNuevo = () => {
    limpiarForm();
    window.requestAnimationFrame(() => abrirModalPorId("modalNivelForm"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleVer = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/NivelFormacion/${id}`);
      if (!res?.ok) return;
      const json = await res.json();
      setDataVer(json ?? {});
      window.requestAnimationFrame(() => abrirModalPorId("modalVerNivel"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditar = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/NivelFormacion/${id}`);
      if (!res?.ok) return;
      const item = await res.json();
      setFormData({
        nivForNombre: item.nivForNombre ?? "",
        nivForDescripcion: item.nivForDescripcion ?? "",
      });
      setModo("editar");
      setIdEditar(id);
      window.requestAnimationFrame(() => abrirModalPorId("modalNivelForm"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este nivel de formación?")) return;
    try {
      const res = await fetchWithAuth(`${API_URL}/NivelFormacion/${id}`, {
        method: "DELETE",
      });
      if (res?.status === 409) {
        const txt = await res.text();
        alert(txt || "No se puede eliminar: está en uso.");
        return;
      }
      if (res?.ok) {
        alert("Nivel eliminado correctamente.");
        await cargar();
        return;
      }
      const txt = await res?.text();
      alert(`No se pudo eliminar (${res?.status}). ${txt ?? ""}`);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const enviarForm = async (e) => {
    e.preventDefault();
    const cuerpo = {
      nivForNombre: formData.nivForNombre.trim(),
      nivForDescripcion: formData.nivForDescripcion.trim() || null,
    };
    const url =
      modo === "crear"
        ? `${API_URL}/NivelFormacion`
        : `${API_URL}/NivelFormacion/editar/${idEditar}`;
    const method = modo === "crear" ? "POST" : "PUT";
    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      if (res?.ok) {
        alert(modo === "crear" ? "Nivel creado correctamente" : "Nivel actualizado");
        document.getElementById("btnCerrarModalNivel")?.click();
        limpiarForm();
        await cargar();
      } else {
        const txt = await res?.text();
        alert(`Error (${res?.status}). ${txt ?? ""}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  return (
    <div className="centro-container">
      <EncabezadoListadoMaestro
        titulo="Niveles de Formación"
        busqueda={busqueda}
        onChangeBusqueda={(e) => setBusqueda(e.target.value)}
        placeholderBusqueda="Buscar"
        onNuevo={abrirNuevo}
        tituloBotonNuevo="Nuevo nivel"
        ariaLabelBusqueda="Buscar"
      />

      <div
        className="modal fade modal-listado-root"
        id="modalNivelForm"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5">
                {modo === "crear" ? "Nuevo nivel" : "Editar nivel"}
              </h2>
              <button
                type="button"
                className="btn btn-link p-1 text-secondary text-decoration-none border-0 lh-1 ms-auto"
                data-bs-dismiss="modal"
                aria-label="Cerrar"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
            <form onSubmit={enviarForm}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label" htmlFor="nivForNombre">
                    Nombre
                  </label>
                  <input
                    id="nivForNombre"
                    name="nivForNombre"
                    className="form-control"
                    value={formData.nivForNombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-0">
                  <label className="form-label" htmlFor="nivForDescripcion">
                    Descripción
                  </label>
                  <textarea
                    id="nivForDescripcion"
                    name="nivForDescripcion"
                    className="form-control"
                    rows={4}
                    value={formData.nivForDescripcion}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  id="btnCerrarModalNivel"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  <X className="me-1" size={18} strokeWidth={1.75} aria-hidden />
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save className="me-1 text-white" size={18} strokeWidth={1.75} aria-hidden />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modalver
        id="modalVerNivel"
        titulo="Detalle del nivel"
        data={dataVer}
        campos={[
          { nombre: "nivForCodigo", label: "Código" },
          { nombre: "nivForNombre", label: "Nombre" },
          { nombre: "nivForDescripcion", label: "Descripción" },
        ]}
      />

      {loading ? (
        <p>Cargando niveles de formación...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="centro-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {nivelesPagina.map((nivel) => (
              <tr key={nivel.nivForCodigo}>
                <td>{nivel.nivForCodigo}</td>
                <td>{nivel.nivForNombre}</td>
                <td>{nivel.nivForDescripcion || "—"}</td>
                <td>
                  <MaestroAcciones
                    id={nivel.nivForCodigo}
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

      {!loading && nivelesFiltrados.length === 0 ? (
        <p className="text-muted mt-2">No hay niveles para mostrar.</p>
      ) : null}

      {!loading && nivelesFiltrados.length > 0 ? (
        <PaginacionTablaMinimal
          paginaActual={paginaNivelesSegura}
          totalPaginas={totalPaginasNiveles}
          onCambiarPagina={setPaginaLista}
          ocultarSiVacio
          totalItems={nivelesFiltrados.length}
        />
      ) : null}
    </div>
  );
}
