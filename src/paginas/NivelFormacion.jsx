import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/centrosnodos.css"; 

const NivelFormacion = () => {

  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerNiveles();
  }, []);

  const obtenerNiveles = async () => {
    try {
      setLoading(true);

      const response = await fetchWithAuth(`${API_URL}/NivelFormacion`);
      if (!response) return;

      const data = await response.json();
      setNiveles(data);

    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los niveles de formación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centro-container">

      <div className="centro-header">
        <h2>Niveles de Formación</h2>
      </div>

      {loading ? (
        <p>Cargando niveles de formación...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="centro-table">

          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>

          <tbody>
            {niveles.map((nivel) => (
              <tr key={nivel.nivForCodigo}>
                <td>{nivel.nivForCodigo}</td>
                <td>{nivel.nivForNombre}</td>
                <td>{nivel.nivForDescripcion || "-"}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
};

export default NivelFormacion;