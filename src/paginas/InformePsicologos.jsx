import React, { useEffect, useState } from "react";
import "../estilos/informes.css";

const InformePsicologos = () => {
  const [psicologos, setPsicologos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPsicologos = async () => {
      try {
        const res = await fetch(
          "http://healthymind10.runasp.net/api/psicologo/listar?Pagina=1&TamanoPagina=1000"
        );
        const json = await res.json();

        setPsicologos(json.resultados || []);
      } catch (error) {
        console.error("Error cargando psicólogos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarPsicologos();
  }, []);

  if (loading) {
    return <p style={{ padding: "40px" }}>Cargando informe...</p>;
  }

  const totalPsicologos = psicologos.length;
  const activos = psicologos.filter(
    p => p.psiEstadoRegistro === "activo"
  ).length;
  const inactivos = totalPsicologos - activos;
  const fechaActual = new Date().toLocaleDateString();

  return (
    <div className="pagina-informe">
   
      <div className="hoja-a4">

        <header className="encabezado">
          <h2>INFORME DE PSICÓLOGOS</h2>
          <p>Fecha de generación: {fechaActual}</p>
        </header>

        <section className="resumen">
          <p><strong>Total de psicólogos:</strong> {totalPsicologos}</p>
          <p><strong>Activos:</strong> {activos}</p>
          <p><strong>Inactivos:</strong> {inactivos}</p>
        </section>

        <section className="tabla-usuarios">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Documento</th>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Teléfono</th>
                <th>Correo Institucional</th>
                <th>Estado</th>
                <th>Citas atendidas</th>
              </tr>
            </thead>
            <tbody>
              {psicologos.map((p, i) => (
                <tr key={p.psiDocumento}>
                  <td>{i + 1}</td>
                  <td>{p.psiDocumento}</td>
                  <td>{p.psiNombre} {p.psiApellido}</td>
                  <td>{p.psiEspecialidad}</td>
                  <td>{p.psiTelefono}</td>
                  <td>{p.psiCorreoInstitucional}</td>
                  <td>{p.psiEstadoRegistro}</td>
                  <td>{p.citasAtendidas ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="pie">
          <p>Documento generado automáticamente por el sistema HealthyMind</p>
        </footer>

        <div className="acciones no-print">
          <button onClick={() => window.print()}>
            <i class="bi bi-arrow-bar-down"></i>
          </button>
          <button onClick={() => window.history.back()}>
            <i class="bi bi-arrow-return-left"></i>
          </button>
        </div>

      </div>
    </div>
  );
};

export default InformePsicologos;
