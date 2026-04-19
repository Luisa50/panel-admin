import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

async function jsonListaSegura(response) {
  if (!response) return [];
  if (response.status === 404) return [];
  if (!response.ok) return [];
  try {
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function abrirModalPorId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  Modal.getOrCreateInstance(el).show();
}

export default function ProgramaFormacion() {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const busquedaTimeout = useRef(null);

  const [niveles, setNiveles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [centros, setCentros] = useState([]);

  const [modo, setModo] = useState("crear");
  const [idEditar, setIdEditar] = useState(null);
  const [formData, setFormData] = useState({
    progNombre: "",
    progModalidad: "",
    progFormaModalidad: "",
    progNivFormFk: "",
    progAreaFk: "",
    progCentroFk: "",
  });

  const [dataVer, setDataVer] = useState({});
  const [paginaLista, setPaginaLista] = useState(1);

  const cargarCatalogos = useCallback(async () => {
    const [rNiv, rArea, rCen] = await Promise.all([
      fetchWithAuth(`${API_URL}/NivelFormacion`),
      fetchWithAuth(`${API_URL}/Area`),
      fetchWithAuth(`${API_URL}/Centro`),
    ]);
    setNiveles(await jsonListaSegura(rNiv));
    setAreas(await jsonListaSegura(rArea));
    setCentros(await jsonListaSegura(rCen));
  }, []);

  const obtenerProgramas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchWithAuth(`${API_URL}/ProgramaFormacion`);
      if (!response) return;
      if (!response.ok) {
        setError("No se pudieron cargar los programas");
        setProgramas([]);
        return;
      }
      const data = await response.json();
      setProgramas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los programas");
      setProgramas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarCatalogos();
    obtenerProgramas();
  }, [cargarCatalogos, obtenerProgramas]);

  useEffect(() => {
    setPaginaLista(1);
  }, [programas]);

  const totalPaginasProgramas = Math.max(
    1,
    Math.ceil(programas.length / LISTADO_TAM_PAGINA)
  );
  const paginaProgramasSegura = Math.min(paginaLista, totalPaginasProgramas);
  const programasPagina = useMemo(() => {
    const ini = (paginaProgramasSegura - 1) * LISTADO_TAM_PAGINA;
    return programas.slice(ini, ini + LISTADO_TAM_PAGINA);
  }, [programas, paginaProgramasSegura]);

  useEffect(() => {
    setPaginaLista((p) => Math.min(p, totalPaginasProgramas));
  }, [totalPaginasProgramas]);

  const ejecutarBusquedaApi = useCallback(
    async (texto) => {
      const t = texto.trim();
      if (!t) {
        await obtenerProgramas();
        return;
      }
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("programaNombre", t);
        const response = await fetchWithAuth(
          `${API_URL}/ProgramaFormacion/buscar?${params.toString()}`
        );
        if (response?.status === 404) {
          setProgramas([]);
          setError("");
          return;
        }
        if (!response?.ok) {
          setProgramas([]);
          setError("No se encontraron resultados");
          return;
        }
        const data = await response.json();
        setProgramas(Array.isArray(data) ? data : []);
        setError("");
      } catch (e) {
        console.error(e);
        setProgramas([]);
      } finally {
        setLoading(false);
      }
    },
    [obtenerProgramas]
  );

  const onChangeBusqueda = (e) => {
    const v = e.target.value;
    setBusqueda(v);
    clearTimeout(busquedaTimeout.current);
    busquedaTimeout.current = setTimeout(() => {
      ejecutarBusquedaApi(v);
    }, 400);
  };

  const limpiarFormulario = () => {
    setFormData({
      progNombre: "",
      progModalidad: "",
      progFormaModalidad: "",
      progNivFormFk: "",
      progAreaFk: "",
      progCentroFk: "",
    });
    setModo("crear");
    setIdEditar(null);
  };

  const abrirNuevo = () => {
    limpiarFormulario();
    window.requestAnimationFrame(() => abrirModalPorId("modalProgramaForm"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVer = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/ProgramaFormacion/${id}`);
      if (!res?.ok) return;
      const json = await res.json();
      const item = Array.isArray(json) ? json[0] : json;
      setDataVer(item ?? {});
      window.requestAnimationFrame(() => abrirModalPorId("modalVerPrograma"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditar = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/ProgramaFormacion/${id}`);
      if (!res?.ok) return;
      const json = await res.json();
      const item = Array.isArray(json) ? json[0] : json;
      if (!item) return;
      setFormData({
        progNombre: item.progNombre ?? "",
        progModalidad: item.progModalidad ?? "",
        progFormaModalidad: item.progFormaModalidad ?? "",
        progNivFormFk:
          item.nivelFormacion?.nivForCodigo != null
            ? String(item.nivelFormacion.nivForCodigo)
            : "",
        progAreaFk:
          item.area?.areaCodigo != null ? String(item.area.areaCodigo) : "",
        progCentroFk:
          item.centro?.cenCodigo != null ? String(item.centro.cenCodigo) : "",
      });
      setModo("editar");
      setIdEditar(item.progCodigo);
      window.requestAnimationFrame(() => abrirModalPorId("modalProgramaForm"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este programa de formación?")) return;
    try {
      const res = await fetchWithAuth(
        `${API_URL}/ProgramaFormacion/eliminar/${id}`,
        { method: "PUT" }
      );
      if (res?.ok) {
        alert("Programa eliminado correctamente");
        await obtenerProgramas();
      } else {
        const txt = await res?.text();
        alert(`No se pudo eliminar (${res?.status}). ${txt ?? ""}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const enviarForm = async (e) => {
    e.preventDefault();
    const cuerpo = {
      progNombre: formData.progNombre.trim(),
      progModalidad: formData.progModalidad.trim(),
      progFormaModalidad: formData.progFormaModalidad.trim(),
      progNivFormFk: Number(formData.progNivFormFk) || null,
      progAreaFk: Number(formData.progAreaFk) || null,
      progCentroFk: Number(formData.progCentroFk) || null,
    };

    const url =
      modo === "crear"
        ? `${API_URL}/ProgramaFormacion`
        : `${API_URL}/ProgramaFormacion/editar/${idEditar}`;
    const method = modo === "crear" ? "POST" : "PUT";

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      if (res?.ok) {
        alert(
          modo === "crear"
            ? "Programa creado correctamente"
            : "Programa actualizado correctamente"
        );
        document.getElementById("btnCerrarModalPrograma")?.click();
        limpiarFormulario();
        await obtenerProgramas();
      } else {
        const txt = await res?.text();
        alert(`Error al guardar (${res?.status}). ${txt ?? ""}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  const nombrePsicologo = (prog) => {
    const p = prog.area?.psicologo;
    if (!p) return "—";
    return `${p.psiNombre ?? ""} ${p.psiApellido ?? ""}`.trim() || "—";
  };

  return (
    <div className="centro-container">
      <EncabezadoListadoMaestro
        titulo="Programas de Formación"
        busqueda={busqueda}
        onChangeBusqueda={onChangeBusqueda}
        placeholderBusqueda="Buscar"
        onNuevo={abrirNuevo}
        tituloBotonNuevo="Nuevo programa"
        ariaLabelBusqueda="Buscar"
      />

      <div
        className="modal fade modal-listado-root"
        id="modalProgramaForm"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5">
                {modo === "crear" ? "Nuevo programa" : "Editar programa"}
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
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label" htmlFor="progNombre">
                      Nombre del programa
                    </label>
                    <input
                      id="progNombre"
                      name="progNombre"
                      className="form-control"
                      value={formData.progNombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="progModalidad">
                      Modalidad
                    </label>
                    <input
                      id="progModalidad"
                      name="progModalidad"
                      className="form-control"
                      value={formData.progModalidad}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="progFormaModalidad">
                      Forma de modalidad
                    </label>
                    <input
                      id="progFormaModalidad"
                      name="progFormaModalidad"
                      className="form-control"
                      value={formData.progFormaModalidad}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="progNivFormFk">
                      Nivel de formación
                    </label>
                    <select
                      id="progNivFormFk"
                      name="progNivFormFk"
                      className="form-select"
                      value={formData.progNivFormFk}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione…</option>
                      {niveles.map((n) => (
                        <option
                          key={n.nivForCodigo}
                          value={String(n.nivForCodigo)}
                        >
                          {n.nivForNombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="progAreaFk">
                      Área
                    </label>
                    <select
                      id="progAreaFk"
                      name="progAreaFk"
                      className="form-select"
                      value={formData.progAreaFk}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione…</option>
                      {areas.map((a) => (
                        <option
                          key={a.areaCodigo}
                          value={String(a.areaCodigo)}
                        >
                          {a.areaNombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label" htmlFor="progCentroFk">
                      Centro
                    </label>
                    <select
                      id="progCentroFk"
                      name="progCentroFk"
                      className="form-select"
                      value={formData.progCentroFk}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione…</option>
                      {centros.map((c) => (
                        <option key={c.cenCodigo} value={String(c.cenCodigo)}>
                          {c.cenNombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  id="btnCerrarModalPrograma"
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
        id="modalVerPrograma"
        titulo="Detalle del programa"
        data={dataVer}
        campos={[
          { nombre: "progCodigo", label: "Código" },
          { nombre: "progNombre", label: "Programa" },
          { nombre: "progModalidad", label: "Modalidad" },
          { nombre: "progFormaModalidad", label: "Forma" },
          { nombre: "nivelFormacion.nivForNombre", label: "Nivel" },
          { nombre: "area.areaNombre", label: "Área" },
          { nombre: "centro.cenNombre", label: "Centro" },
          { nombre: "centro.regional.regNombre", label: "Regional" },
          { nombre: "area.psicologo.psiNombre", label: "Psicólogo (nombre)" },
          { nombre: "area.psicologo.psiApellido", label: "Psicólogo (apellido)" },
        ]}
      />

      {loading ? (
        <p>Cargando programas...</p>
      ) : error && programas.length === 0 ? (
        <p className="text-danger">{error}</p>
      ) : (
        <table className="centro-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Programa</th>
              <th>Modalidad</th>
              <th>Forma</th>
              <th>Nivel</th>
              <th>Área</th>
              <th>Centro</th>
              <th>Regional</th>
              <th>Psicólogo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {programasPagina.map((prog) => (
              <tr key={prog.progCodigo}>
                <td>{prog.progCodigo}</td>
                <td>{prog.progNombre}</td>
                <td>{prog.progModalidad}</td>
                <td>{prog.progFormaModalidad}</td>
                <td>{prog.nivelFormacion?.nivForNombre ?? "—"}</td>
                <td>{prog.area?.areaNombre ?? "—"}</td>
                <td>{prog.centro?.cenNombre ?? "—"}</td>
                <td>{prog.centro?.regional?.regNombre ?? "—"}</td>
                <td>{nombrePsicologo(prog)}</td>
                <td>
                  <MaestroAcciones
                    id={prog.progCodigo}
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

      {!loading && programas.length === 0 && !error ? (
        <p className="text-muted mt-2">No hay programas para mostrar.</p>
      ) : null}

      {!loading && programas.length > 0 ? (
        <PaginacionTablaMinimal
          paginaActual={paginaProgramasSegura}
          totalPaginas={totalPaginasProgramas}
          onCambiarPagina={setPaginaLista}
          ocultarSiVacio
          totalItems={programas.length}
        />
      ) : null}
    </div>
  );
}
