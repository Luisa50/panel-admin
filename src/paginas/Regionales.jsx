import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/auth";
import "../estilos/centrosnodos.css";

export default function Regionales() {

  const [regionales, setRegionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerRegionales = async () => {
      try {
        setLoading(true);

        const response = await fetchWithAuth(
          "http://healthymind10.runasp.net/api/Regional"
        );

        const data = await response.json();
        setRegionales(data);

      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar las regionales");
      } finally {
        setLoading(false);
      }
    };

    obtenerRegionales();
  }, []);

  return (
    <div className="centro-container">

      <div className="centro-header">
        <h2>Regionales</h2>
      </div>

      {loading ? (
        <p>Cargando regionales...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="centro-table">

          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
            </tr>
          </thead>

          <tbody>
            {regionales.map((reg) => (
              <tr key={reg.regCodigo}>
                <td>{reg.regCodigo}</td>
                <td>{reg.regNombre}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
  );
}