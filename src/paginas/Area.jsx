import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/auth";
import "../estilos/area.css";

export default function Area() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerAreas = async () => {
      try {
        const res = await fetchWithAuth(
          "http://healthymind10.runasp.net/api/Area"
        );
        const data = await res.json();
        setAreas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    obtenerAreas();
  }, []);

  return (
    <div className="area-container">

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
                    : "-"}
                </td>

                <td>{area.areaPsicologo?.psiDocumento || "-"}</td>
                <td>{area.areaPsicologo?.psiEspecialidad || "-"}</td>
                <td>{area.areaPsicologo?.psiTelefono || "-"}</td>
                <td>{area.areaPsicologo?.psiCorreoInstitucional || "-"}</td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  );
}