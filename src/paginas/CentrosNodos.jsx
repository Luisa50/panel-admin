import React, { useEffect, useMemo, useState } from "react";
import { X, Save } from "lucide-react";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/centrosnodos.css";
import EncabezadoListadoMaestro from "../componentes/EncabezadoListadoMaestro.jsx";
import PaginacionTablaMinimal, {
  LISTADO_TAM_PAGINA,
} from "../componentes/PaginacionTablaMinimal.jsx";

const CENTRO_API = `${API_URL}/Centro`;

export default function CentrosNodos() {

  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modo, setModo] = useState("crear");
  const [idEditar, setIdEditar] = useState(null);


  const [tipo, setTipo] = useState("centro");
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [centroVer, setCentroVer] = useState(null);

  const [formData, setFormData] = useState({
    cenNombre: "",
    cenDireccion: "",
    cenCodFk: ""
  });
  const [busquedaCentroModal, setBusquedaCentroModal] = useState("");
  const [paginaLista, setPaginaLista] = useState(1);

  const cargarCentros = async () => {
    try {
      const res = await fetchWithAuth(CENTRO_API);
      if (!res) return;
      const data = await res.json();
      setCentros(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCentros();
  }, []);

 
  const centrosPrincipales = centros.filter(c => c.cenCodigo === c.cenCodFk);
  const nodos = centros.filter(c => c.cenCodigo !== c.cenCodFk);

  const obtenerNodos = (cenCodigo) => {
    return nodos.filter(n => n.cenCodFk === cenCodigo);
  };

  const filtrados = centrosPrincipales.filter(c =>
    c.cenNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    setPaginaLista(1);
  }, [busqueda]);

  const totalPaginasCentros = Math.max(
    1,
    Math.ceil(filtrados.length / LISTADO_TAM_PAGINA)
  );
  const paginaCentrosSegura = Math.min(paginaLista, totalPaginasCentros);
  const filtradosPagina = useMemo(() => {
    const ini = (paginaCentrosSegura - 1) * LISTADO_TAM_PAGINA;
    return filtrados.slice(ini, ini + LISTADO_TAM_PAGINA);
  }, [filtrados, paginaCentrosSegura]);

  useEffect(() => {
    setPaginaLista((p) => Math.min(p, totalPaginasCentros));
  }, [totalPaginasCentros]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const limpiar = () => {
    setFormData({
      cenNombre: "",
      cenDireccion: "",
      cenCodFk: ""
    });
    setTipo("centro");
    setModo("crear");
    setIdEditar(null);
    setBusquedaCentroModal("");
  };


  const guardar = async () => {
    try {
      let nuevoObjeto;

      if (tipo === "centro") {
        // crear centro
        nuevoObjeto = {
          cenCodigo: Date.now(), // 
          cenNombre: formData.cenNombre,
          cenDireccion: formData.cenDireccion,
          cenCodFk: Date.now(), // centro se referencia a sí mismo
          regional: { regNombre: "SIN DEFINIR" }
        };
      } else {
        // crear nodo
        nuevoObjeto = {
          cenCodigo: Date.now(),
          cenNombre: formData.cenNombre,
          cenDireccion: formData.cenDireccion,
          cenCodFk: Number(formData.cenCodFk),
          regional: { regNombre: "SIN DEFINIR" }
        };
      }

      
      setCentros(prev => [...prev, nuevoObjeto]);

      limpiar();
      setMostrarModal(false);

    } catch (error) {
      console.error(error);
      alert("Error guardando");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar centro?")) return;

    try {
      const res = await fetchWithAuth(`${CENTRO_API}/${id}`, {
        method: "DELETE",
      });
      if (!res || !res.ok) {
        alert("No se pudo eliminar el registro.");
        return;
      }
      setCentros((prev) =>
        prev.filter((c) => c.cenCodigo !== id && c.cenCodFk !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Error eliminando el registro.");
    }
  };

  const editar = (centro) => {
    setModo("editar");
    setIdEditar(centro.cenCodigo);

    setFormData({
      cenNombre: centro.cenNombre,
      cenDireccion: centro.cenDireccion,
      cenCodFk: centro.cenCodFk
    });
    const centroActual = centrosPrincipales.find(
      (c) => String(c.cenCodigo) === String(centro.cenCodFk)
    );
    setBusquedaCentroModal(centroActual?.cenNombre ?? "");

    setMostrarModal(true);
  };

  const centrosFiltradosModal = centrosPrincipales.filter((c) =>
    c.cenNombre.toLowerCase().includes(busquedaCentroModal.toLowerCase())
  );

  const seleccionarCentroModal = (centro) => {
    setFormData((prev) => ({ ...prev, cenCodFk: String(centro.cenCodigo) }));
    setBusquedaCentroModal(centro.cenNombre);
  };

  const abrirModalVer = (centro) => {
    setCentroVer(centro);
    setMostrarModalVer(true);
  };

  const cerrarModalVer = () => {
    setMostrarModalVer(false);
    setCentroVer(null);
  };

  return (
    <div className="centro-container">

      <EncabezadoListadoMaestro
        titulo="Centros"
        busqueda={busqueda}
        onChangeBusqueda={(e) => setBusqueda(e.target.value)}
        placeholderBusqueda="Buscar…"
        onNuevo={() => {
          limpiar();
          setMostrarModal(true);
        }}
        tituloBotonNuevo="Nuevo centro o nodo"
      />

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="centro-table">

          <thead>
            <tr>
              <th>Código</th>
              <th>Centro</th>
              <th>Dirección</th>
              <th>Regional</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtradosPagina.map((c) => {
              const nodosCentro = obtenerNodos(c.cenCodigo);

              return (
                <React.Fragment key={c.cenCodigo}>

                  <tr>
                    <td>{c.cenCodigo}</td>

                    <td>{c.cenNombre}</td>

                    <td>{c.cenDireccion}</td>
                    <td>{c.regional?.regNombre}</td>

                    <td className="text-nowrap">
                      <div className="acciones-tabla-centro d-inline-flex align-items-center flex-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-link acciones-tabla-btn icono-ver-centro border-0"
                          onClick={() => abrirModalVer(c)}
                          title="Ver nodos del centro"
                          aria-label="Ver nodos del centro"
                        >
                          <i className="bi bi-eye" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link acciones-tabla-btn border-0 acciones-tabla-centro-editar"
                          onClick={() => editar(c)}
                          title="Editar"
                          aria-label="Editar"
                        >
                          <i className="bi bi-pencil" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-link acciones-tabla-btn border-0 acciones-tabla-centro-eliminar"
                          onClick={() => eliminar(c.cenCodigo)}
                          title="Eliminar"
                          aria-label="Eliminar"
                        >
                          <i className="bi bi-trash" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>

                </React.Fragment>
              );
            })}
          </tbody>

        </table>
      )}

      {!loading && filtrados.length > 0 ? (
        <PaginacionTablaMinimal
          paginaActual={paginaCentrosSegura}
          totalPaginas={totalPaginasCentros}
          onCambiarPagina={setPaginaLista}
          ocultarSiVacio
          totalItems={filtrados.length}
        />
      ) : null}

      {mostrarModal && (
        <div className="modal show d-block centro-modal-centros">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Crear</h5>
                <button
                  type="button"
                  className="btn btn-link p-1 text-secondary text-decoration-none border-0 lh-1 ms-auto"
                  onClick={() => setMostrarModal(false)}
                  aria-label="Cerrar"
                >
                  <X size={20} strokeWidth={1.75} />
                </button>
              </div>

              <div className="modal-body">

              
                <select
                  className="form-control mb-2"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="centro">Centro</option>
                  <option value="nodo">Nodo</option>
                </select>

                {tipo === "nodo" && (
                  <div className="selector-centro-multi mb-2">
                    <label className="form-label small text-muted mb-1">
                      Centro asociado
                    </label>
                    <input
                      className="form-control"
                      placeholder="Buscar centro..."
                      value={busquedaCentroModal}
                      onChange={(e) => {
                        setBusquedaCentroModal(e.target.value);
                        if (formData.cenCodFk) {
                          setFormData((prev) => ({ ...prev, cenCodFk: "" }));
                        }
                      }}
                    />
                    <div className="selector-centro-lista">
                      {centrosFiltradosModal.length > 0 ? (
                        centrosFiltradosModal.map((c) => {
                          const activo =
                            String(formData.cenCodFk) === String(c.cenCodigo);
                          return (
                            <button
                              type="button"
                              key={c.cenCodigo}
                              className={`selector-centro-item ${activo ? "activo" : ""}`}
                              onClick={() => seleccionarCentroModal(c)}
                            >
                              <span>{c.cenNombre}</span>
                              {activo && <i className="bi bi-check2" aria-hidden="true" />}
                            </button>
                          );
                        })
                      ) : (
                        <p className="selector-centro-empty mb-0">
                          No se encontraron centros.
                        </p>
                      )}
                    </div>
                    {formData.cenCodFk && (
                      <div className="selector-centro-chip mt-2">
                        <span>Centro seleccionado:</span>
                        <span className="chip-item">
                          {
                            centrosPrincipales.find(
                              (c) => String(c.cenCodigo) === String(formData.cenCodFk)
                            )?.cenNombre
                          }
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <input
                  className="form-control mb-2"
                  name="cenNombre"
                  placeholder="Nombre"
                  value={formData.cenNombre}
                  onChange={handleChange}
                />

                <input
                  className="form-control"
                  name="cenDireccion"
                  placeholder="Dirección"
                  value={formData.cenDireccion}
                  onChange={handleChange}
                />

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setMostrarModal(false)}
                >
                  <X className="me-1" size={18} strokeWidth={1.75} aria-hidden />
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={guardar}
                >
                  <Save className="me-1 text-white" size={18} strokeWidth={1.75} aria-hidden />
                  Guardar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {mostrarModalVer && centroVer && (
        <div className="modal show d-block centro-modal-centros">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Nodos del centro</h5>
                <button
                  type="button"
                  className="btn btn-link p-1 text-secondary text-decoration-none border-0 lh-1 ms-auto"
                  onClick={cerrarModalVer}
                  aria-label="Cerrar"
                >
                  <X size={20} strokeWidth={1.75} />
                </button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-2">Centro</p>
                <h6 className="mb-3">{centroVer.cenNombre}</h6>
                {obtenerNodos(centroVer.cenCodigo).length > 0 ? (
                  <div className="nodos-stack-wrap">
                    {obtenerNodos(centroVer.cenCodigo).map((n) => (
                      <span key={n.cenCodigo} className="nodo-stack-item">
                        {n.cenNombre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="sin-nodos mb-0">No hay nodos asociados.</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModalVer}>
                  <X className="me-1" size={18} strokeWidth={1.75} aria-hidden />
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}