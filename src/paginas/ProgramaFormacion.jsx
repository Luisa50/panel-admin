import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/auth";

const ProgramaFormacion = () => {

  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerProgramas();
  }, []);

  const obtenerProgramas = async () => {
    try {

      setLoading(true);

      const response = await fetchWithAuth(
        "http://healthymind10.runasp.net/api/ProgramaFormacion"
      );

      if (!response) return;

      const data = await response.json();

      console.log("Programas:", data);

      setProgramas(data);

    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los programas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="contenedor">Cargando programas...</div>;
  }

  if (error) {
    return <div className="contenedor">{error}</div>;
  }

  return (
    <div className="contenedor">

      <h2>Programas de Formación</h2>

      <table className="tabla">
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
          </tr>
        </thead>

        <tbody>
          {programas.map((prog) => (
            <tr key={prog.progCodigo}>

              <td>{prog.progCodigo}</td>

              <td>{prog.progNombre}</td>

              <td>{prog.progModalidad}</td>

              <td>{prog.progFormaModalidad}</td>

              <td>{prog.nivelFormacion?.nivForNombre}</td>

              <td>{prog.area?.areaNombre}</td>

              <td>{prog.centro?.cenNombre}</td>

              <td>{prog.centro?.regional?.regNombre}</td>

              <td>
                {prog.area?.psicologo
                  ? `${prog.area.psicologo.psiNombre} ${prog.area.psicologo.psiApellido}`
                  : "—"}
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default ProgramaFormacion;