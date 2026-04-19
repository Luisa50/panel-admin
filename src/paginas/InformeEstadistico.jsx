import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/informes.css";

const COLORES = [
  "#2f80ff", "#27ae60", "#9b51e0", "#eb5757", "#f2994a",
  "#219ebc", "#6c5ce7", "#00b894", "#e17055", "#0984e3",
  "#fdcb6e", "#636e72", "#d63031", "#74b9ff", "#55efc4",
];

const TABS = [
  { id: "resumen", label: "Resumen", icono: "bi-speedometer2" },
  { id: "citas", label: "Citas", icono: "bi-calendar-check" },
  { id: "aprendices", label: "Aprendices", icono: "bi-people" },
  { id: "seguimientos", label: "Seguimientos", icono: "bi-clipboard2-pulse" },
  { id: "tests", label: "Tests y Reportes", icono: "bi-journal-medical" },
];

/** Ancho real del contenedor; ResponsiveContainer suele quedar en 0 px con muchos gráficos o al imprimir. */
function useChartHostWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const read = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      if (w > 0) setWidth((prev) => (prev !== w ? w : prev));
    };

    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    window.addEventListener("resize", read);
    const id = requestAnimationFrame(read);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", read);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (width > 0) return undefined;
    const t = window.setTimeout(() => {
      const el = ref.current;
      const w = el ? Math.floor(el.getBoundingClientRect().width) : 0;
      setWidth(w > 0 ? w : 800);
    }, 150);
    return () => window.clearTimeout(t);
  }, [width]);

  return [ref, width];
}

function SeccionGrafico({ titulo, children }) {
  return (
    <div className="bloque informe-seccion-estadistica">
      <h4
        className="informe-seccion-titulo"
        style={{ fontSize: 16, marginBottom: 14 }}
      >
        {titulo}
      </h4>
      {children}
    </div>
  );
}

function TablaRanking({ columnas, filas }) {
  if (!filas.length)
    return (
      <p className="text-muted small">No hay datos para este período.</p>
    );
  return (
    <div className="tabla-ranking-scroll">
      <table className="tabla-desglose-citas" style={{ marginTop: 8 }}>
        <thead>
          <tr>
            <th>#</th>
            {columnas.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((row, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              {columnas.map((c) => (
                <td key={c.key}>
                  {c.fmt ? c.fmt(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniBarChart({ data, xKey, yKey, color = "#2f80ff", height = 280 }) {
  const [hostRef, w] = useChartHostWidth();

  if (!data.length)
    return (
      <p className="text-muted small">No hay datos para graficar.</p>
    );

  const chartW = w > 0 ? w : 0;
  const yAxisW =
    chartW > 0 ? Math.min(200, Math.max(100, Math.floor(chartW * 0.28))) : 120;

  return (
    <div
      ref={hostRef}
      className="informe-recharts-host informe-recharts-host--bar"
      style={{ minHeight: height, width: "100%" }}
    >
      {chartW > 0 ? (
        <BarChart
          width={chartW}
          height={height}
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey={xKey}
            width={yAxisW}
            tick={{ fontSize: 11 }}
            interval={0}
          />
          <Tooltip />
          <Bar
            dataKey={yKey}
            fill={color}
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      ) : (
        <div style={{ height, width: "100%" }} aria-hidden />
      )}
    </div>
  );
}

function MiniPie({ data, nameKey, valueKey, height = 280 }) {
  const [hostRef, w] = useChartHostWidth();

  if (!data.length)
    return <p className="text-muted small">No hay datos para graficar.</p>;

  const chartW = w > 0 ? w : 0;
  const outerR =
    chartW > 0
      ? Math.max(48, Math.min(110, Math.floor(Math.min(chartW, height) / 2) - 28))
      : 0;

  return (
    <div
      ref={hostRef}
      className="informe-recharts-host informe-recharts-host--pie"
      style={{ minHeight: height, width: "100%" }}
    >
      {chartW > 0 ? (
        <PieChart width={chartW} height={height}>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={nameKey}
            cx={chartW / 2}
            cy={height / 2}
            outerRadius={outerR}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={false}
            isAnimationActive={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORES[i % COLORES.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      ) : (
        <div style={{ height, width: "100%" }} aria-hidden />
      )}
    </div>
  );
}

function ReportesLineChart({ data }) {
  const [hostRef, w] = useChartHostWidth();
  const height = 300;
  const chartW = w > 0 ? Math.min(w, 560) : 0;

  return (
    <div
      ref={hostRef}
      className="informe-recharts-host informe-recharts-host--line"
      style={{ minHeight: height, width: "100%" }}
    >
      {chartW > 0 ? (
        <LineChart
          width={chartW}
          height={height}
          data={data}
          margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} height={48} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#2f80ff"
            name="Total"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="resueltos"
            stroke="#27ae60"
            name="Resueltos"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="enProceso"
            stroke="#f2994a"
            name="En proceso"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="creados"
            stroke="#eb5757"
            name="Creados"
            isAnimationActive={false}
          />
        </LineChart>
      ) : (
        <div style={{ height, width: "100%" }} aria-hidden />
      )}
    </div>
  );
}

function MiniRadar({ data, nameKey, valueKey, color = "#2f80ff", height = 300 }) {
  const [hostRef, w] = useChartHostWidth();

  if (!data.length)
    return <p className="text-muted small">No hay datos para graficar.</p>;

  const chartW = w > 0 ? w : 0;

  return (
    <div
      ref={hostRef}
      className="informe-recharts-host informe-recharts-host--radar"
      style={{ minHeight: height, width: "100%" }}
    >
      {chartW > 0 ? (
        <RadarChart
          width={chartW}
          height={height}
          data={data}
          margin={{ top: 16, right: 24, bottom: 12, left: 24 }}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey={nameKey} tick={{ fontSize: 11 }} />
          <PolarRadiusAxis allowDecimals={false} tick={{ fontSize: 10 }} />
          <Tooltip />
          <Radar
            dataKey={valueKey}
            stroke={color}
            fill={color}
            fillOpacity={0.35}
            isAnimationActive={false}
          />
        </RadarChart>
      ) : (
        <div style={{ height, width: "100%" }} aria-hidden />
      )}
    </div>
  );
}

async function jsonOk(res) {
  if (!res || !res.ok) return null;
  const text = await res.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}

export default function InformeEstadistico() {
  const [tab, setTab] = useState("resumen");
  const [modoImpresion, setModoImpresion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [resumen, setResumen] = useState(null);
  const [citasCentro, setCitasCentro] = useState([]);
  const [citasRegional, setCitasRegional] = useState([]);
  const [citasPsicologo, setCitasPsicologo] = useState([]);
  const [tasaCentro, setTasaCentro] = useState([]);
  const [aprRegional, setAprRegional] = useState([]);
  const [aprPrograma, setAprPrograma] = useState([]);
  const [aprArea, setAprArea] = useState([]);
  const [aprNivel, setAprNivel] = useState([]);
  const [segEstado, setSegEstado] = useState([]);
  const [segCentro, setSegCentro] = useState([]);
  const [segPrograma, setSegPrograma] = useState([]);
  const [testsProg, setTestsProg] = useState([]);
  const [reportesPeriodo, setReportesPeriodo] = useState([]);
  const [progCentro, setProgCentro] = useState([]);

  const qs = useMemo(() => {
    const params = [];
    if (desde) params.push(`desde=${desde}`);
    if (hasta) params.push(`hasta=${hasta}`);
    return params.length ? `?${params.join("&")}` : "";
  }, [desde, hasta]);

  const cargarTodo = useCallback(async () => {
    setCargando(true);
    try {
      const base = `${API_URL}/Informes`;
      const [
        rResumen,
        rCitCen,
        rCitReg,
        rCitPsi,
        rTasa,
        rAprReg,
        rAprProg,
        rAprArea,
        rAprNiv,
        rSegEst,
        rSegCen,
        rSegProg,
        rTestP,
        rRepPer,
        rProgCen,
      ] = await Promise.all([
        fetchWithAuth(`${base}/resumen-general`),
        fetchWithAuth(`${base}/citas-por-centro${qs}`),
        fetchWithAuth(`${base}/citas-por-regional${qs}`),
        fetchWithAuth(`${base}/citas-por-psicologo${qs}`),
        fetchWithAuth(`${base}/tasa-asistencia-por-centro${qs}`),
        fetchWithAuth(`${base}/aprendices-por-regional`),
        fetchWithAuth(`${base}/aprendices-por-programa`),
        fetchWithAuth(`${base}/aprendices-por-area`),
        fetchWithAuth(`${base}/aprendices-por-nivel`),
        fetchWithAuth(`${base}/seguimientos-por-estado${qs}`),
        fetchWithAuth(`${base}/seguimientos-por-centro${qs}`),
        fetchWithAuth(`${base}/seguimientos-por-programa${qs}`),
        fetchWithAuth(`${base}/tests-por-programa${qs}`),
        fetchWithAuth(`${base}/reportes-por-periodo${qs}`),
        fetchWithAuth(`${base}/programas-por-centro`),
      ]);

      const [
        jResumen, jCitCen, jCitReg, jCitPsi, jTasa,
        jAprReg, jAprProg, jAprArea, jAprNiv,
        jSegEst, jSegCen, jSegProg, jTestP, jRepPer, jProgCen,
      ] = await Promise.all([
        jsonOk(rResumen), jsonOk(rCitCen), jsonOk(rCitReg), jsonOk(rCitPsi), jsonOk(rTasa),
        jsonOk(rAprReg), jsonOk(rAprProg), jsonOk(rAprArea), jsonOk(rAprNiv),
        jsonOk(rSegEst), jsonOk(rSegCen), jsonOk(rSegProg), jsonOk(rTestP), jsonOk(rRepPer), jsonOk(rProgCen),
      ]);

      setResumen(jResumen);
      setCitasCentro(Array.isArray(jCitCen) ? jCitCen : []);
      setCitasRegional(Array.isArray(jCitReg) ? jCitReg : []);
      setCitasPsicologo(Array.isArray(jCitPsi) ? jCitPsi : []);
      setTasaCentro(Array.isArray(jTasa) ? jTasa : []);
      setAprRegional(Array.isArray(jAprReg) ? jAprReg : []);
      setAprPrograma(Array.isArray(jAprProg) ? jAprProg : []);
      setAprArea(Array.isArray(jAprArea) ? jAprArea : []);
      setAprNivel(Array.isArray(jAprNiv) ? jAprNiv : []);
      setSegEstado(Array.isArray(jSegEst) ? jSegEst : []);
      setSegCentro(Array.isArray(jSegCen) ? jSegCen : []);
      setSegPrograma(Array.isArray(jSegProg) ? jSegProg : []);
      setTestsProg(Array.isArray(jTestP) ? jTestP : []);
      setReportesPeriodo(Array.isArray(jRepPer) ? jRepPer : []);
      setProgCentro(Array.isArray(jProgCen) ? jProgCen : []);
    } catch (err) {
      console.error("Error cargando informes:", err);
    } finally {
      setCargando(false);
    }
  }, [qs]);

  useEffect(() => { cargarTodo(); }, [cargarTodo]);

  useEffect(() => {
    const onAfterPrint = () => setModoImpresion(false);
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  const abrirImpresion = useCallback(() => {
    setModoImpresion(true);
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.print();
          });
        });
      }, 120);
    }, 480);
  }, []);

  const fechaActual = new Date().toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dec"];

  const reportesLinea = useMemo(() =>
    reportesPeriodo.map(r => ({
      ...r,
      etiqueta: `${meses[r.mes - 1]} ${r.anio}`,
    })), [reportesPeriodo]);

  // ─── Render helpers ───

  function renderResumen() {
    if (!resumen) return <p className="text-muted">Sin datos de resumen.</p>;
    const kpis = [
      { label: "Aprendices activos", valor: resumen.aprendicesActivos, color: "#27ae60" },
      { label: "Psicólogos activos", valor: resumen.psicologosActivos, color: "#9b51e0" },
      { label: "Total citas", valor: resumen.citasTotal, color: "#2f80ff" },
      { label: "Citas realizadas", valor: resumen.citasRealizadas, color: "#0984e3" },
      { label: "Efectividad citas", valor: `${resumen.tasaEfectividadCitasPct}%`, color: "#219ebc" },
      { label: "Seguimientos activos", valor: resumen.seguimientosActivos, color: "#f2994a" },
      { label: "Tests completados", valor: resumen.testsCompletados, color: "#6c5ce7" },
      { label: "Reportes pendientes", valor: resumen.reportesPendientes, color: "#eb5757" },
      { label: "Centros activos", valor: resumen.centrosActivos, color: "#00b894" },
      { label: "Fichas activas", valor: resumen.fichasActivas, color: "#636e72" },
    ];
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
        {kpis.map(k => (
          <div key={k.label} className="kpi">
            <h3 style={{ color: k.color }}>{k.valor}</h3>
            <span>{k.label}</span>
          </div>
        ))}
      </div>
    );
  }

  function renderCitas() {
    return (
      <>
        <SeccionGrafico titulo="Citas por centro">
          <MiniBarChart data={citasCentro} xKey="centro" yKey="totalCitas" color="#2f80ff" />
          <TablaRanking
            columnas={[
              { key: "centro", label: "Centro" },
              { key: "totalCitas", label: "Total citas" },
            ]}
            filas={citasCentro}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Citas por regional">
          <MiniBarChart data={citasRegional} xKey="regional" yKey="totalCitas" color="#27ae60" />
          <TablaRanking
            columnas={[
              { key: "regional", label: "Regional" },
              { key: "totalCitas", label: "Total citas" },
            ]}
            filas={citasRegional}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Citas por psicólogo (carga de trabajo)">
          <MiniBarChart data={citasPsicologo} xKey="psicologo" yKey="total" color="#9b51e0" />
          <TablaRanking
            columnas={[
              { key: "psicologo", label: "Psicólogo" },
              { key: "total", label: "Total" },
              { key: "realizadas", label: "Realizadas" },
              { key: "pendientes", label: "Pendientes" },
              { key: "canceladas", label: "Canceladas" },
              { key: "tasaEfectividadPct", label: "% Efectividad", fmt: v => `${v}%` },
            ]}
            filas={citasPsicologo}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Tasa de asistencia por centro">
          <TablaRanking
            columnas={[
              { key: "centro", label: "Centro" },
              { key: "total", label: "Total" },
              { key: "realizadas", label: "Realizadas" },
              { key: "canceladas", label: "Canceladas" },
              { key: "noAsistidas", label: "No asistidas" },
              { key: "tasaAsistenciaPct", label: "% Asistencia", fmt: v => `${v}%` },
              { key: "tasaCancelacionPct", label: "% Cancel.", fmt: v => `${v}%` },
            ]}
            filas={tasaCentro}
          />
        </SeccionGrafico>
      </>
    );
  }

  function renderAprendices() {
    return (
      <>
        <SeccionGrafico titulo="Aprendices por regional">
          <MiniPie data={aprRegional} nameKey="regional" valueKey="totalAprendices" />
          <TablaRanking
            columnas={[
              { key: "regional", label: "Regional" },
              { key: "totalAprendices", label: "Total" },
            ]}
            filas={aprRegional}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Aprendices por programa de formación">
          <MiniBarChart data={aprPrograma} xKey="programa" yKey="totalAprendices" color="#f2994a"
            height={Math.max(280, aprPrograma.length * 32)} />
          <TablaRanking
            columnas={[
              { key: "programa", label: "Programa" },
              { key: "totalAprendices", label: "Total" },
            ]}
            filas={aprPrograma}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Aprendices por área de conocimiento">
          <MiniPie data={aprArea} nameKey="area" valueKey="totalAprendices" />
          <TablaRanking
            columnas={[
              { key: "area", label: "Área" },
              { key: "totalAprendices", label: "Total" },
            ]}
            filas={aprArea}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Aprendices por nivel de formación">
          <MiniPie data={aprNivel} nameKey="nivel" valueKey="totalAprendices" />
          <TablaRanking
            columnas={[
              { key: "nivel", label: "Nivel" },
              { key: "totalAprendices", label: "Total" },
            ]}
            filas={aprNivel}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Programas y fichas por centro">
          <MiniBarChart data={progCentro} xKey="centro" yKey="totalProgramas" color="#219ebc" />
          <TablaRanking
            columnas={[
              { key: "centro", label: "Centro" },
              { key: "totalProgramas", label: "Programas" },
              { key: "totalFichas", label: "Fichas activas" },
            ]}
            filas={progCentro}
          />
        </SeccionGrafico>
      </>
    );
  }

  function renderSeguimientos() {
    return (
      <>
        <SeccionGrafico titulo="Seguimientos por estado">
          <MiniPie data={segEstado} nameKey="estado" valueKey="total" />
          <TablaRanking
            columnas={[
              { key: "estado", label: "Estado" },
              { key: "total", label: "Total" },
            ]}
            filas={segEstado}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Seguimientos por centro">
          <MiniBarChart data={segCentro} xKey="centro" yKey="totalSeguimientos" color="#e17055" />
          <TablaRanking
            columnas={[
              { key: "centro", label: "Centro" },
              { key: "totalSeguimientos", label: "Total" },
            ]}
            filas={segCentro}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Seguimientos por programa de formación">
          <MiniBarChart data={segPrograma} xKey="programa" yKey="totalSeguimientos" color="#6c5ce7"
            height={Math.max(280, segPrograma.length * 32)} />
          <TablaRanking
            columnas={[
              { key: "programa", label: "Programa" },
              { key: "totalSeguimientos", label: "Total" },
            ]}
            filas={segPrograma}
          />
        </SeccionGrafico>
      </>
    );
  }

  function renderTestsReportes() {
    return (
      <>
        <SeccionGrafico titulo="Tests psicológicos por programa">
          <MiniBarChart data={testsProg} xKey="programa" yKey="total" color="#00b894"
            height={Math.max(280, testsProg.length * 32)} />
          <TablaRanking
            columnas={[
              { key: "programa", label: "Programa" },
              { key: "total", label: "Total" },
              { key: "completados", label: "Completados" },
              { key: "enProgreso", label: "En progreso" },
              { key: "asignados", label: "Asignados" },
              { key: "tasaCompletadoPct", label: "% Completado", fmt: v => `${v}%` },
            ]}
            filas={testsProg}
          />
        </SeccionGrafico>

        <SeccionGrafico titulo="Reportes/incidencias por período">
          {reportesLinea.length > 0 ? (
            <ReportesLineChart data={reportesLinea} />
          ) : (
            <p className="text-muted small">No hay datos de reportes en este período.</p>
          )}
          <TablaRanking
            columnas={[
              { key: "etiqueta", label: "Período" },
              { key: "total", label: "Total" },
              { key: "creados", label: "Creados" },
              { key: "enProceso", label: "En proceso" },
              { key: "resueltos", label: "Resueltos" },
              { key: "cancelados", label: "Cancelados" },
            ]}
            filas={reportesLinea}
          />
        </SeccionGrafico>
      </>
    );
  }

  const contenidoTab = {
    resumen: renderResumen,
    citas: renderCitas,
    aprendices: renderAprendices,
    seguimientos: renderSeguimientos,
    tests: renderTestsReportes,
  };

  return (
    <div
      className="pagina-informe informe-estadistico-pagina informe-print-pro"
      style={{ background: "#f0f2f5" }}
    >
      <div className="hoja-a4 informe-print-pro-hoja" style={{ minHeight: "auto" }}>
        <header
          className="encabezado informe-print-pro-encabezado"
          style={{ marginBottom: 20 }}
        >
          <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 w-100">
            <div className="flex-grow-1 min-w-0 informe-estadistico-encabezado-texto">
              <p className="informe-print-pro-fecha">
                Generado el {fechaActual}
              </p>
              <h2 style={{ fontSize: 22, margin: 0 }}>
                <i className="bi bi-graph-up-arrow me-2" />
                Informes estratégicos
              </h2>
            </div>
            <div className="d-flex gap-2 align-items-center no-print flex-shrink-0 flex-wrap">
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ width: 150 }}
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
                title="Fecha desde"
              />
              <span className="text-muted small">a</span>
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ width: 150 }}
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
                title="Fecha hasta"
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setDesde("");
                  setHasta("");
                }}
                title="Limpiar filtros"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>
        </header>

        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2 text-muted">Cargando informes...</p>
          </div>
        ) : modoImpresion ? (
          <div className="informe-estadistico-completo">
            <p className="small text-muted mb-3 no-print">
              Vista completa para impresión (todas las secciones). Al cerrar el
              diálogo volverás a la vista con pestañas.
            </p>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Resumen general</h3>
            {renderResumen()}
            <hr />
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Citas</h3>
            {renderCitas()}
            <hr />
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Aprendices</h3>
            {renderAprendices()}
            <hr />
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Seguimientos</h3>
            {renderSeguimientos()}
            <hr />
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Tests y reportes</h3>
            {renderTestsReportes()}
          </div>
        ) : (
          <>
            <ul className="nav nav-tabs mb-4 no-print">
              {TABS.map(t => (
                <li className="nav-item" key={t.id}>
                  <button
                    type="button"
                    className={`nav-link ${tab === t.id ? "active" : ""}`}
                    onClick={() => setTab(t.id)}
                  >
                    <i className={`bi ${t.icono} me-1`} />
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
            <div>{contenidoTab[tab]()}</div>
          </>
        )}

        <footer className="pie" style={{ marginTop: 30 }}>
          <p>Documento generado automáticamente por HealthyMind</p>
        </footer>

        <div className="acciones no-print">
          <div className="acciones-grupo">
            <button
              type="button"
              onClick={abrirImpresion}
              title="Imprimir o guardar como PDF (monta todos los gráficos antes de imprimir)"
            >
              <i className="bi bi-box-arrow-in-down" aria-hidden="true" />
              <span>Descargar informe</span>
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              title="Volver a la pantalla anterior"
            >
              <i className="bi bi-box-arrow-in-left" aria-hidden="true" />
              <span>Regresar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
