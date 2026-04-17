import "bootstrap/dist/css/bootstrap.min.css";
import "../estilos/principal.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import { useLanguage } from "../context/LanguageContext";

function formatoHoraActualizacion(fecha, loc) {
  const tag = loc === "en" ? "en-US" : "es-CO";
  return fecha.toLocaleTimeString(tag, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/** Evita SyntaxError si la API devuelve 404/HTML/cuerpo vacío (no es JSON). */
async function jsonSiRespuestaOk(res) {
  if (!res || !res.ok) return null;
  const text = await res.text();
  if (!text || !String(text).trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function añosSelectorFallback() {
  const y = new Date().getFullYear();
  return Array.from({ length: 8 }, (_, i) => y - i);
}

/**
 * Interpreta la respuesta de GET /Aprendiz/estadistica/por-mes.
 *
 * API nueva → { anioAplicado: number, datos: [{Mes,Total}] }
 * API vieja → [{Mes,Total}]  (sin filtro por año)
 *
 * Devuelve { filtrado: boolean, anioAplicado: number|null, datos: array }
 */
function interpretarRespuestaPorMes(json, anioSolicitado) {
  if (!json) return { filtrado: false, anioAplicado: null, datos: [] };

  if (json.anioAplicado != null && Array.isArray(json.datos)) {
    return {
      filtrado: true,
      anioAplicado: json.anioAplicado,
      datos: json.datos,
    };
  }

  if (Array.isArray(json)) {
    return { filtrado: false, anioAplicado: null, datos: json };
  }

  return { filtrado: false, anioAplicado: null, datos: [] };
}

export default function Monitoreo() {
  const { t, locale } = useLanguage();

  const [anioGraficaUsuarios, setAnioGraficaUsuarios] = useState(() =>
    new Date().getFullYear()
  );
  const [aniosDisponibles, setAniosDisponibles] = useState(() => [
    new Date().getFullYear(),
  ]);
  const [cantidadAprendices, setCantidadAprendices] = useState([]);
  const [apiFiltraAnio, setApiFiltraAnio] = useState(true);
  const [datosPorMes, setdatosPorMes] = useState({});
  const [totalActividadesProceso, setTotalActividadesProceso] = useState({});
  const [totalActividadesExitosas, setTotalActividadesExitosas] = useState({});
  const [totalIncidencias, setTotalIncidencias] = useState({});
  const [totalPorEstado, setTotalPorEstado] = useState([]);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarAnios = async () => {
      try {
        const res = await fetchWithAuth(
          `${API_URL}/Aprendiz/estadistica/anios-registro-aprendices`
        );
        const data = await jsonSiRespuestaOk(res);
        const raw = data && Array.isArray(data.anios) ? data.anios : [];
        const lista = [...raw].sort((a, b) => b - a);
        const finalLista = lista.length ? lista : añosSelectorFallback();
        setAniosDisponibles(finalLista);
        setAnioGraficaUsuarios((prev) =>
          finalLista.includes(prev) ? prev : finalLista[0]
        );
      } catch (e) {
        console.error("Error cargando años disponibles:", e);
        setAniosDisponibles(añosSelectorFallback());
      }
    };
    cargarAnios();
  }, []);

  const cargarDashboard = useCallback(async () => {
    setCargando(true);
    try {
      const [
        resMes,
        resCrecimiento,
        resProceso,
        resExitosa,
        resIncidencias,
        resPorEstado,
      ] = await Promise.all([
        fetchWithAuth(
          `${API_URL}/Aprendiz/estadistica/por-mes?anio=${anioGraficaUsuarios}`
        ),
        fetchWithAuth(`${API_URL}/Aprendiz/estadistica/crecimiento-mensual`),
        fetchWithAuth(`${API_URL}/Citas/citas/estado-proceso`),
        fetchWithAuth(`${API_URL}/Citas/estadistica/actividad-exitosa`),
        fetchWithAuth(`${API_URL}/Citas/citas/estado-incidencias`),
        fetchWithAuth(`${API_URL}/Citas/estadistica/por-estado`),
      ]);

      if (!resMes || !resCrecimiento || !resProceso || !resExitosa || !resIncidencias || !resPorEstado) {
        return;
      }

      const [jsonMes, jsonCrecimiento, jsonProceso, jsonExitosa, jsonIncidencias, jsonPorEstado] =
        await Promise.all([
          jsonSiRespuestaOk(resMes),
          jsonSiRespuestaOk(resCrecimiento),
          jsonSiRespuestaOk(resProceso),
          jsonSiRespuestaOk(resExitosa),
          jsonSiRespuestaOk(resIncidencias),
          jsonSiRespuestaOk(resPorEstado),
        ]);

      const resultado = interpretarRespuestaPorMes(jsonMes, anioGraficaUsuarios);
      setCantidadAprendices(resultado.datos);
      setApiFiltraAnio(resultado.filtrado);

      if (!resultado.filtrado) {
        console.warn(
          "⚠ La API no devolvió 'anioAplicado': la versión desplegada no filtra por año.",
          "Datos sin filtrar → se muestra aviso al usuario."
        );
      }

      setdatosPorMes(jsonCrecimiento && typeof jsonCrecimiento === "object" ? jsonCrecimiento : {});
      setTotalActividadesProceso(jsonProceso && typeof jsonProceso === "object" ? jsonProceso : {});
      setTotalActividadesExitosas(jsonExitosa && typeof jsonExitosa === "object" ? jsonExitosa : {});
      setTotalIncidencias(jsonIncidencias && typeof jsonIncidencias === "object" ? jsonIncidencias : {});
      setTotalPorEstado(Array.isArray(jsonPorEstado) ? jsonPorEstado : []);

      setUltimaActualizacion(new Date());
    } catch (err) {
      console.error("Error cargando dashboard:", err);
    } finally {
      setCargando(false);
    }
  }, [anioGraficaUsuarios]);

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  const datosAPI = cantidadAprendices.reduce((acc, item) => {
    const mes = item.mes ?? item.Mes;
    const total = item.total ?? item.Total;
    if (mes != null) acc[mes] = total;
    return acc;
  }, {});

  const estadosCitas = useMemo(
    () =>
      totalPorEstado.reduce((acc, item) => {
        acc[item.estadoCita] = item.total;
        return acc;
      }, {}),
    [totalPorEstado]
  );

  const usuariosPorMes = [
    { mes: "Ene", cantidad: datosAPI[1] ?? 0 },
    { mes: "Feb", cantidad: datosAPI[2] ?? 0 },
    { mes: "Mar", cantidad: datosAPI[3] ?? 0 },
    { mes: "Abr", cantidad: datosAPI[4] ?? 0 },
    { mes: "May", cantidad: datosAPI[5] ?? 0 },
    { mes: "Jun", cantidad: datosAPI[6] ?? 0 },
    { mes: "Jul", cantidad: datosAPI[7] ?? 0 },
    { mes: "Ago", cantidad: datosAPI[8] ?? 0 },
    { mes: "Sep", cantidad: datosAPI[9] ?? 0 },
    { mes: "Oct", cantidad: datosAPI[10] ?? 0 },
    { mes: "Nov", cantidad: datosAPI[11] ?? 0 },
    { mes: "Dic", cantidad: datosAPI[12] ?? 0 },
  ];

  const citas = useMemo(
    () => [
      {
        name: t("monitoreo.cita.pendiente"),
        value: estadosCitas["pendiente"] ?? 0,
      },
      {
        name: t("monitoreo.cita.programada"),
        value: estadosCitas["programada"] ?? 0,
      },
      {
        name: t("monitoreo.cita.reprogramada"),
        value: estadosCitas["reprogramada"] ?? 0,
      },
      {
        name: t("monitoreo.cita.realizada"),
        value: estadosCitas["realizada"] ?? 0,
      },
      {
        name: t("monitoreo.cita.cancelada"),
        value: estadosCitas["cancelada"] ?? 0,
      },
      {
        name: t("monitoreo.cita.noAsistio"),
        value: estadosCitas["no asistió"] ?? 0,
      },
    ],
    [estadosCitas, t]
  );

  const resumenCitasOperativas = useMemo(
    () => [
      {
        nombre: t("monitoreo.op.exitosas"),
        cantidad: Number(totalActividadesExitosas?.exitosas) || 0,
      },
      {
        nombre: t("monitoreo.op.enProceso"),
        cantidad: Number(totalActividadesProceso?.citasEnProceso) || 0,
      },
      {
        nombre: t("monitoreo.op.incidencias"),
        cantidad: Number(totalIncidencias?.citasEnIncidencias) || 0,
      },
    ],
    [totalActividadesExitosas, totalActividadesProceso, totalIncidencias, t]
  );

  let acumuladoParcial = 0;
  const usuariosAcumuladosPorMes = usuariosPorMes.map((row) => {
    acumuladoParcial += row.cantidad || 0;
    return { mes: row.mes, acumulado: acumuladoParcial };
  });

  const colors = [
    "#003366",
    "#1A73E8",
    "#4BA3F2",
    "#00B3A4",
    "#009970",
    "#006644",
  ];

  const filaTarjetasKpi = useMemo(
    () => (
      <div className="row g-4 mb-4 pt-0">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card dark-card" id="carta-monitoreo">
            <div className="card-body">
              <p
                className="text-secondary m-0"
                title={t("monitoreo.usersPerMonthTitle")}
              >
                {t("monitoreo.usersPerMonth")}
              </p>
              <h3 className="fw-bold">
                {datosPorMes?.porcentajeCrecimiento ?? "—"}%
              </h3>
              <small className="text-success">
                {datosPorMes?.promedioMensual ?? "—"} {t("monitoreo.average")}
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card" id="carta-monitoreo">
            <div className="card-body">
              <p
                className="text-secondary m-0"
                title={t("monitoreo.successActivityTitle")}
              >
                {t("monitoreo.successActivity")}
              </p>
              <h4 className="fw-bold">
                {totalActividadesExitosas?.porcentaje ?? "—"}%
              </h4>
              <small className="text-danger">
                {totalActividadesExitosas?.exitosas ?? "—"}{" "}
                {t("monitoreo.appointments")}
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card" id="carta-monitoreo">
            <div className="card-body">
              <p
                className="text-secondary m-0"
                title={t("monitoreo.inProgressTitle")}
              >
                {t("monitoreo.inProgress")}
              </p>
              <h4 className="fw-bold">
                {totalActividadesProceso?.porcentajeEnProceso ?? "—"}%
              </h4>
              <small className="text-success">
                {totalActividadesProceso?.citasEnProceso ?? "—"}{" "}
                {t("monitoreo.appointments")}
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stat-card" id="carta-monitoreo">
            <div className="card-body">
              <p
                className="text-secondary m-0"
                title={t("monitoreo.incidentsTitle")}
              >
                {t("monitoreo.incidents")}
              </p>
              <h4 className="fw-bold">
                {totalIncidencias?.porcentajeEnProceso ?? "—"}%
              </h4>
              <small className="text-danger">
                {totalIncidencias?.citasEnIncidencias ?? "—"}{" "}
                {t("monitoreo.appointments")}
              </small>
            </div>
          </div>
        </div>
      </div>
    ),
    [
      datosPorMes,
      totalActividadesExitosas,
      totalActividadesProceso,
      totalIncidencias,
      t,
    ]
  );

  return (
    <div className="container-fluid p-0 mb-0 dashboard-monitoreo-root">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 px-1 monitoreo-toolbar">
        <p className="text-muted small mb-0">
          {ultimaActualizacion ? (
            <>
              {t("monitoreo.lastUpdate")}{" "}
              <strong>
                {formatoHoraActualizacion(ultimaActualizacion, locale)}
              </strong>
            </>
          ) : cargando ? (
            t("monitoreo.loading")
          ) : (
            t("monitoreo.noData")
          )}
        </p>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
          onClick={() => cargarDashboard()}
          disabled={cargando}
          title={t("monitoreo.refreshTitle")}
        >
          {cargando ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
              {t("monitoreo.updating")}
            </>
          ) : (
            <>
              <i className="bi bi-arrow-clockwise" aria-hidden="true" />
              {t("monitoreo.refresh")}
            </>
          )}
        </button>
      </div>

      {filaTarjetasKpi}

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card graph-card p-3 p-md-4 p-lg-5 h-100">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <h5 className="fw-semibold mb-0">
                {t("monitoreo.chartUsersYear")}
                {apiFiltraAnio
                  ? ` (${anioGraficaUsuarios})`
                  : t("monitoreo.chartUsersAllYears")}
              </h5>
              <label className="d-flex align-items-center gap-2 small text-muted mb-0">
                <span>{t("monitoreo.year")}</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto", minWidth: 96 }}
                  value={anioGraficaUsuarios}
                  disabled={!apiFiltraAnio}
                  onChange={(e) =>
                    setAnioGraficaUsuarios(Number(e.target.value))
                  }
                  aria-label={t("monitoreo.yearAria")}
                >
                  {aniosDisponibles.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {!apiFiltraAnio && (
              <div
                className="alert alert-warning py-2 px-3 small mb-2"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-1" />
                <strong>{t("monitoreo.apiWarningBold")}</strong>{" "}
                {t("monitoreo.apiWarningBody")}{" "}
                <code>estadistica/por-mes</code> {t("monitoreo.apiWarningMid")}{" "}
                <code>anioAplicado</code>
                {t("monitoreo.apiWarningClose")}
              </div>
            )}
            <div style={{ width: "100%", minWidth: 0 }}>
              <ResponsiveContainer
                width="100%"
                height={320}
                debounce={50}
                key={`linea-usuarios-${anioGraficaUsuarios}`}
              >
                <LineChart
                  data={usuariosPorMes}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cantidad"
                    stroke="#003366"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card graph-card p-3 h-100">
            <h5 className="fw-semibold mb-3">
              {t("monitoreo.appointmentStates")}
            </h5>
            <div style={{ width: "100%", minWidth: 0 }}>
              <ResponsiveContainer width="100%" height={320} debounce={50}>
                <PieChart>
                  <Pie
                    data={citas}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ value }) => value}
                  >
                    {citas.map((entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>


            <div className="mt-3 d-flex flex-wrap justify-content-center gap-3">
              {citas.map((item, i) => (
                <div key={i} className="d-flex align-items-center">
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      display: "inline-block",
                      backgroundColor: colors[i],
                      marginRight: 6,
                      borderRadius: "3px",
                    }}
                  ></span>
                  <small>{item.name}</small>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      <div className="row g-4 mt-4">
        <div className="col-12 col-xl-8">
          <div className="card graph-card p-3 p-md-4 p-lg-5 h-100">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
              <h5 className="fw-semibold mb-0">
                {apiFiltraAnio
                  ? `${t("monitoreo.accumulatedYear")} ${anioGraficaUsuarios}`
                  : t("monitoreo.accumulatedAll")}
              </h5>
              <span className="small text-muted">
                {apiFiltraAnio
                  ? t("monitoreo.sameYearHint")
                  : t("monitoreo.apiPendingHint")}
              </span>
            </div>
            <div style={{ width: "100%", minWidth: 0 }}>
              <ResponsiveContainer
                width="100%"
                height={320}
                debounce={50}
                key={`area-acum-${anioGraficaUsuarios}`}
              >
                <AreaChart
                  data={usuariosAcumuladosPorMes}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="acumulado"
                    name={t("monitoreo.totalAccumulated")}
                    stroke="#003366"
                    strokeWidth={2}
                    fill="#003366"
                    fillOpacity={0.18}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card graph-card p-3 h-100">
            <h5 className="fw-semibold mb-3">
              {t("monitoreo.operationalSituations")}
            </h5>
            <div style={{ width: "100%", minWidth: 0 }}>
              <ResponsiveContainer width="100%" height={320} debounce={50}>
                <BarChart
                  data={resumenCitasOperativas}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" tick={{ fontSize: 12 }} interval={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="cantidad"
                    name={t("monitoreo.barName")}
                    fill="#1A73E8"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
