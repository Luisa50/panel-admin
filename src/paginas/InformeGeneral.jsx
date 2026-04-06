import React, { useEffect, useState, useMemo } from "react";
import "../estilos/informes.css";

function etiquetaEstadoCita(raw) {
  if (raw == null || raw === "") return "Sin clasificar";
  const s = String(raw).trim();
  const lower = s.toLowerCase();
  const map = {
    pendiente: "Pendiente",
    programada: "Programada",
    confirmada: "Confirmada",
    cancelada: "Cancelada",
    completada: "Completada",
    realizada: "Realizada",
    proceso: "En proceso",
    resuelta: "Resuelta",
  };
  if (map[lower]) return map[lower];
  return s.charAt(0).toUpperCase() + s.slice(1);
}

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

  const filasCitas = useMemo(() => {
    return (estadosCitas || []).map((item) => ({
      clave: item.estadoCita,
      estado: etiquetaEstadoCita(item.estadoCita),
      total: Number(item.total) || 0,
    }));
  }, [estadosCitas]);

  const totalCitas = useMemo(
    () => filasCitas.reduce((acc, row) => acc + row.total, 0),
    [filasCitas]
  );

  const filasOrdenadas = useMemo(() => {
    return [...filasCitas].sort((a, b) => b.total - a.total);
  }, [filasCitas]);

  const estadoPredominante = useMemo(() => {
    if (!filasOrdenadas.length || totalCitas === 0) return null;
    return filasOrdenadas[0];
  }, [filasOrdenadas, totalCitas]);

  const fechaActual = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return <p style={{ padding: "40px" }}>Generando informe general...</p>;
  }

  const ratioPsicologoUsuario =
    totalUsuarios > 0
      ? (psicologosActivos / totalUsuarios).toFixed(4)
      : null;

  return (
    <div className="pagina-informe">
      <div className="hoja-a4">
        <header className="encabezado">
          <h2>Informe general HealthyMind</h2>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#666" }}>
            Generado el {fechaActual}
          </p>
        </header>

        <div className="bloque">
          <p className="informe-parrafo">
            Según la estadística de aprendices consultada en este momento, hay{" "}
            <strong>{totalUsuarios}</strong> usuario(s) registrado(s) en total
            en la plataforma. En paralelo, el servicio indica{" "}
            <strong>{psicologosActivos}</strong> psicólogo(s) con estado activo,
            disponible(s) para atención según los criterios del backend.
            {ratioPsicologoUsuario != null && (
              <>
                {" "}
                Tomando ambas cifras, la relación aproximada es de{" "}
                <strong>{ratioPsicologoUsuario}</strong> psicólogo(s) activo(s)
                por cada usuario registrado (valor descriptivo, no normativo).
              </>
            )}
          </p>

          <p className="informe-parrafo">
            En lo referente a citas, la suma de todas las cantidades reportadas
            por estado es de <strong>{totalCitas}</strong> cita(s).{" "}
            {totalCitas === 0 ? (
              <>
                Por ahora no hay desglose por estado con cantidades distintas de
                cero en la respuesta recibida.
              </>
            ) : (
              <>
                A continuación se detalla cómo se reparte ese total entre los
                estados devueltos por el API:
              </>
            )}
          </p>

          {totalCitas > 0 &&
            filasOrdenadas.map((row) => {
              const pct =
                totalCitas > 0
                  ? ((row.total / totalCitas) * 100).toFixed(1)
                  : "0";
              return (
                <p key={String(row.clave)} className="informe-parrafo">
                  El estado <strong>{row.estado}</strong> agrupa{" "}
                  <strong>{row.total}</strong> cita(s), es decir el{" "}
                  <strong>{pct}%</strong> del total de <strong>{totalCitas}</strong>{" "}
                  cita(s) consideradas en esta estadística.
                </p>
              );
            })}

          <p className="informe-parrafo">
            {totalCitas === 0
              ? "Sin datos de distribución por estado, conviene repetir la consulta más adelante o verificar la operación del servicio de citas."
              : estadoPredominante
                ? `El mayor volumen corresponde al estado «${estadoPredominante.estado}» (${estadoPredominante.total} cita(s)), lo que puede servir para priorizar revisiones operativas o de seguimiento en ese tramo del flujo.`
                : "Las cifras por estado permiten comparar de un vistazo dónde se concentra la actividad registrada en el sistema."}
          </p>

          <p className="informe-parrafo">
            Los conteos provienen de los endpoints de estadística ya integrados
            en la aplicación; el cuadro siguiente repite las mismas cifras en
            formato tabular para consulta rápida.
          </p>
        </div>

        {totalCitas > 0 && (
          <div className="bloque">
            <table className="tabla-desglose-citas">
              <thead>
                <tr>
                  <th>Estado de la cita</th>
                  <th>Cantidad</th>
                  <th>% del total</th>
                </tr>
              </thead>
              <tbody>
                {filasCitas.map((row) => (
                  <tr key={String(row.clave)}>
                    <td>{row.estado}</td>
                    <td>{row.total}</td>
                    <td>
                      {totalCitas > 0
                        ? `${((row.total / totalCitas) * 100).toFixed(1)}%`
                        : "—"}
                    </td>
                  </tr>
                ))}
                <tr>
                  <th>Total</th>
                  <th>{totalCitas}</th>
                  <th>100%</th>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <footer className="pie">
          <p>Documento generado automáticamente por HealthyMind</p>
        </footer>

        <div className="acciones no-print">
          <button type="button" onClick={() => window.print()}>
            <i className="bi bi-printer"></i>
          </button>
          <button type="button" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
