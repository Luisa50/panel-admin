import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/auth";
import "../estilos/centrosnodos.css";

const API = "http://healthymind10.runasp.net/api/Centro";

export default function CentrosNodos() {

  const [centros, setCentros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState({});
  const [busqueda, setBusqueda] = useState("");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modo, setModo] = useState("crear");
  const [idEditar, setIdEditar] = useState(null);


  const [tipo, setTipo] = useState("centro");

  const [formData, setFormData] = useState({
    cenNombre: "",
    cenDireccion: "",
    cenCodFk: ""
  });


  const cargarCentros = async () => {
    try {
      const res = await fetchWithAuth(API);
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

  const toggleExpand = (id) => {
    setExpandido(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filtrados = centrosPrincipales.filter(c =>
    c.cenNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  
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
      setCentros(prev => prev.filter(c => c.cenCodigo !== id));
    } catch (error) {
      console.error(error);
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

    setMostrarModal(true);
  };

  return (
    <div className="centro-container">

      <div className="centro-header d-flex justify-content-between align-items-center">
        <h2>Centros</h2>

        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Buscar…"
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <button
            className="btn btn-success"
            onClick={() => {
              limpiar();
              setMostrarModal(true);
            }}
          >
            +
          </button>
        </div>
      </div>

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
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((c) => {
              const nodosCentro = obtenerNodos(c.cenCodigo);

              return (
                <React.Fragment key={c.cenCodigo}>

                  <tr>
                    <td>{c.cenCodigo}</td>

                    <td style={{ fontWeight: "bold" }}>
                      {c.cenNombre}
                      <i
                        className="bi bi-chevron-down ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleExpand(c.cenCodigo)}
                      ></i>
                    </td>

                    <td>{c.cenDireccion}</td>
                    <td>{c.regional?.regNombre}</td>

                    <td>
                      <i
                        className="bi bi-pencil me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => editar(c)}
                      ></i>

                      <i
                        className="bi bi-trash"
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => eliminar(c.cenCodigo)}
                      ></i>
                    </td>
                  </tr>

                  {expandido[c.cenCodigo] && (
                    <tr>
                      <td colSpan="5">
                        {nodosCentro.length > 0 ? (
                          <ul>
                            {nodosCentro.map(n => (
                              <li key={n.cenCodigo}>
                                {n.cenNombre}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No hay nodos disponibles</p>
                        )}
                      </td>
                    </tr>
                  )}

                </React.Fragment>
              );
            })}
          </tbody>

        </table>
      )}

      
      {mostrarModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Crear</h5>
                <button onClick={() => setMostrarModal(false)}>X</button>
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
                  <select
                    className="form-control mb-2"
                    name="cenCodFk"
                    onChange={handleChange}
                  >
                    <option value="">Seleccione centro</option>
                    {centrosPrincipales.map(c => (
                      <option key={c.cenCodigo} value={c.cenCodigo}>
                        {c.cenNombre}
                      </option>
                    ))}
                  </select>
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
                  className="btn btn-secondary"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>

                <button
                  className="btn btn-success"
                  onClick={guardar}
                >
                  Guardar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}