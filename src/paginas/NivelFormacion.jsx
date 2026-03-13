import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/auth";

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

      const response = await fetchWithAuth(
        "http://healthymind10.runasp.net/api/NivelFormacion"
      );

      if (!response) return;

      const data = await response.json();

      console.log("Niveles:", data);

      setNiveles(data);

    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los niveles de formación");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="contenedor">Cargando niveles de formación...</div>;
  }

  if (error) {
    return <div className="contenedor">{error}</div>;
  }

  return (
    <div className="contenedor">

      <h2>Niveles de Formación</h2>

      <table className="tabla">
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

              <td>{nivel.nivForDescripcion}</td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default NivelFormacion;