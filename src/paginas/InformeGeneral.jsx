import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "../estilos/informes.css";

export default function InformeGeneral() {
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [psicologosActivos, setPsicologosActivos] = useState(0);
  const [estadosCitas, setEstadosCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resUsuarios = await fetch(
          "http://healthymind10.runasp.net/api/Aprendiz/estadistica/total-registrados"
        );
        const resPsicologos = await fetch(
          "http://healthymind10.runasp.net/api/psicologo/estadistica/total-activos"
        );
        const resCitas = await fetch(
          "http://healthymind10.runasp.net/api/Citas/estadistica/por-estado"
        );

        const usuariosJson = await resUsuarios.json();
        const psicologosJson = await resPsicologos.json();
        const citasJson = await resCitas.json();

        setTotalUsuarios(usuariosJson.totalAprendices || 0);
        setPsicologosActivos(psicologosJson.totalPsicologos || 0);
        setEstadosCitas(citasJson || []);
      } catch (error) {
        console.error("Error cargando informe general:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return <p style={{ padding: "40px" }}>Generando informe general...</p>;
  }



  const pieCitas = estadosCitas.map(item => ({
    name: item.estadoCita,
    value: item.total
  }));

  const totalCitas = pieCitas.reduce((acc, item) => acc + item.value, 0);

  const COLORS = [
    "#27ae60",
    "#2f80ff",
    "#eb5757",
    "#f2c94c",
    "#9b51e0",
    "#6c757d"
  ];

  const fechaActual = new Date().toLocaleDateString();

  return (
    <div className="pagina-informe">
      <div className="hoja-a4">

        <header className="encabezado">
          <h2>INFORME GENERAL DEL SISTEMA</h2>
          <p>HealthyMind · Fecha: {fechaActual}</p>
        </header>

        <section className="bloque">
          <h4>Resumen Ejecutivo</h4>
          <p>
            El sistema HealthyMind cuenta con{" "}
            <strong>{totalUsuarios}</strong> usuarios registrados y{" "}
            <strong>{psicologosActivos}</strong> psicólogos activos.
            El sistema presenta un comportamiento estable en la gestión
            de citas psicológicas.
          </p>
        </section>

        <section className="kpis">
          <div className="kpi">
            <h3>{totalUsuarios}</h3>
            <span>Usuarios registrados</span>
          </div>
          <div className="kpi">
            <h3>{psicologosActivos}</h3>
            <span>Psicólogos activos</span>
          </div>
          <div className="kpi">
            <h3>{totalCitas}</h3>
            <span>Total de citas</span>
          </div>
        </section>

        <section className="bloque">
          <h4>Estado General de las Citas</h4>

          {totalCitas === 0 ? (
            <p style={{ textAlign: "center", marginTop: 30 }}>
              No hay datos de citas disponibles
            </p>
          ) : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieCitas}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {pieCitas.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="bloque">
          <h4>Conclusión General</h4>
          <p>
            HealthyMind se encuentra en un estado operativo adecuado.
            Los datos reflejan una correcta distribución de las citas,
            permitiendo identificar oportunidades de mejora en el
            seguimiento y asistencia.
          </p>
        </section>

        <footer className="pie">
          <p>Documento generado automáticamente por HealthyMind</p>
        </footer>

        <div className="acciones no-print">
          <button onClick={() => window.print()}><i class="bi bi-arrow-bar-down"></i></button>
          <button onClick={() => window.history.back()}><i class="bi bi-caret-left"></i></button>
        </div>

      </div>
    </div>
  );
}
