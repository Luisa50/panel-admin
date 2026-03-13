import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip
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
            El sistema cuenta con <strong>{totalUsuarios}</strong> usuarios registrados y{" "}
            <strong>{psicologosActivos}</strong> psicólogos activos.
            Se evidencia un comportamiento estable en la gestión de citas.
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
          <h4>Distribución de Citas</h4>

          {totalCitas === 0 ? (
            <p style={{ textAlign: "center", marginTop: 30 }}>
              No hay datos disponibles
            </p>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart width={400} height={300}>
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
            </div>
          )}
        </section>

   
        <section className="bloque">
          <h4>Conclusión</h4>
          <p>
            El sistema presenta estabilidad operativa. La distribución de citas
            permite identificar oportunidades de mejora en la atención y seguimiento.
          </p>
        </section>

        <footer className="pie">
          <p>Documento generado automáticamente por HealthyMind</p>
        </footer>

        
        <div className="acciones no-print">
          <button onClick={() => window.print()}>
            <i className="bi bi-printer"></i>
          </button>
          <button onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
          </button>
        </div>

      </div>
    </div>
  );
}