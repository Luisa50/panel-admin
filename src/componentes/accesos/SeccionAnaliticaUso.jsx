import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import {
  kpiAccesosInicial,
  actividadPorHoraInicial,
  actividadPorDiaInicial,
  usoPorModuloInicial,
  COLORES_PIE,
} from "../../paginas/accesosAnaliticaBase.js";
import PaginacionTablaMinimal, {
  LISTADO_TAM_PAGINA,
} from "../PaginacionTablaMinimal.jsx";

const RANKING_TOP = 8;

/** Coincide con `filaAccesoDesdeAprendiz` / `filaAccesoDesdePsicologo` en accesosAnaliticaBase.js */
const TIPO_USUARIO = "Aprendiz";
const TIPO_PSICOLOGO = "Psicólogo";

function TarjetaKpi({ titulo, valor, subtitulo }) {
  return (
    <div className="ga-kpi">
      <span className="ga-kpi-titulo">{titulo}</span>
      <span className="ga-kpi-valor">{valor}</span>
      {subtitulo ? (
        <span className="ga-kpi-sub">{subtitulo}</span>
      ) : null}
    </div>
  );
}

/**
 * @param {object} props
 * @param {Array<{ id: string, nombre: string, tipo: string, ingresos: number, ultimoAcceso: string, frecuenciaSemanal: number }>} props.filasTabla
 * @param {boolean} props.cargando
 * @param {string|null} props.errorCarga
 */
export default function SeccionAnaliticaUso({
  filasTabla = [],
  cargando = false,
  errorCarga = null,
}) {
  const [vistaTabla, setVistaTabla] = useState("usuarios");
  const [paginaTabla, setPaginaTabla] = useState(1);

  useEffect(() => {
    setPaginaTabla(1);
  }, [vistaTabla]);

  const kpi = kpiAccesosInicial;
  const sumaModulos = usoPorModuloInicial.reduce((s, m) => s + m.valor, 0);

  const filasFiltradas = useMemo(() => {
    const tipo = vistaTabla === "usuarios" ? TIPO_USUARIO : TIPO_PSICOLOGO;
    return filasTabla.filter((f) => f.tipo === tipo);
  }, [filasTabla, vistaTabla]);

  const totalPaginasTabla = Math.max(
    1,
    Math.ceil(filasFiltradas.length / LISTADO_TAM_PAGINA)
  );

  useEffect(() => {
    setPaginaTabla((p) => Math.min(p, totalPaginasTabla));
  }, [totalPaginasTabla]);

  const paginaSegura = Math.min(paginaTabla, totalPaginasTabla);
  const filasPagina = useMemo(() => {
    const inicio = (paginaSegura - 1) * LISTADO_TAM_PAGINA;
    return filasFiltradas.slice(inicio, inicio + LISTADO_TAM_PAGINA);
  }, [filasFiltradas, paginaSegura]);

  const rankingDatos = filasTabla
    .slice()
    .sort((a, b) => {
      if (b.ingresos !== a.ingresos) return b.ingresos - a.ingresos;
      return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
    })
    .slice(0, RANKING_TOP)
    .map((u) => ({
      nombre:
        u.nombre.length > 22 ? `${u.nombre.slice(0, 20)}…` : u.nombre,
      ingresos: u.ingresos,
    }));

  return (
    <section className="ga-analitica mt-4" aria-labelledby="ga-uso-titulo">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-2 mb-3">
        <div>
          <h4 id="ga-uso-titulo" className="ga-titulo-seccion mb-1">
            Uso del sistema
          </h4>
          <p className="text-muted small mb-0 ga-disclaimer">
            Personas registradas (aprendices y psicólogos) provienen del servidor.
            Las métricas de acceso e interacción están en cero hasta activar el
            registro de sesiones en el backend.
          </p>
        </div>
      </div>

      {errorCarga ? (
        <div className="alert alert-warning py-2 small mb-3" role="alert">
          {errorCarga}
        </div>
      ) : null}

      {cargando ? (
        <p className="small text-muted mb-3 mb-lg-4">
          Cargando personas registradas…
        </p>
      ) : null}

      <div className="ga-kpi-grid mb-4">
        <TarjetaKpi
          titulo="Accesos hoy"
          valor={kpi.accesosHoy.toLocaleString("es-CO")}
        />
        <TarjetaKpi
          titulo="Usuarios activos (7 días)"
          valor={String(kpi.usuariosActivosSemana)}
          subtitulo="Personas distintas con sesión"
        />
        <TarjetaKpi
          titulo="Sesiones / usuario (promedio)"
          valor={String(kpi.sesionesPromedioPorUsuario).replace(".", ",")}
          subtitulo="En el periodo analizado"
        />
        <TarjetaKpi
          titulo="Horario con más actividad"
          valor={kpi.picoHorario}
          subtitulo="Referencia horaria local"
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-6">
          <div className="ga-chart-card">
            <h5 className="ga-chart-titulo">Actividad por hora del día</h5>
            <p className="ga-chart-ayuda small text-muted mb-2">
              Distribución de accesos según la hora (agregado).
            </p>
            <div className="ga-chart-host">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={actividadPorHoraInicial}
                  margin={{ top: 8, right: 8, left: -12, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="hora"
                    tick={{ fontSize: 9 }}
                    interval={2}
                    height={36}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="accesos"
                    fill="#2563eb"
                    radius={[3, 3, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="ga-chart-card">
            <h5 className="ga-chart-titulo">Actividad por día de la semana</h5>
            <p className="ga-chart-ayuda small text-muted mb-2">
              Sesiones en la última semana (referencia).
            </p>
            <div className="ga-chart-host">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={actividadPorDiaInicial}
                  margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sesiones"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#059669" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-lg-5">
          <div className="ga-chart-card">
            <h5 className="ga-chart-titulo">Uso por módulo</h5>
            <p className="ga-chart-ayuda small text-muted mb-2">
              Peso relativo de visitas o interacciones por área del panel.
            </p>
            <div className="ga-chart-host ga-chart-host--pie">
              {sumaModulos === 0 ? (
                <div className="ga-chart-empty d-flex align-items-center justify-content-center text-muted small">
                  Sin datos de uso por módulo aún
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={usoPorModuloInicial}
                      dataKey="valor"
                      nameKey="modulo"
                      cx="50%"
                      cy="50%"
                      outerRadius={88}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      labelLine={false}
                    >
                      {usoPorModuloInicial.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORES_PIE[i % COLORES_PIE.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="ga-chart-card">
            <h5 className="ga-chart-titulo">Personas con más actividad</h5>
            <p className="ga-chart-ayuda small text-muted mb-2">
              Ingresos al sistema en el periodo de referencia (cuando exista
              tracking).
            </p>
            <div className="ga-chart-host">
              {filasTabla.length === 0 && !cargando ? (
                <div className="ga-chart-empty d-flex align-items-center justify-content-center text-muted small">
                  No hay registros para mostrar
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={rankingDatos}
                    layout="vertical"
                    margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="nombre"
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="ingresos"
                      fill="#7c3aed"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ga-chart-card mb-2">
        <h5 className="ga-chart-titulo">Detalle de actividad</h5>
        <p className="ga-chart-ayuda small text-muted mb-3">
          Frecuencia de uso y último acceso por persona. Los campos de acceso se
          completarán cuando el servidor registre sesiones.
        </p>

        {!cargando && !errorCarga && filasTabla.length > 0 ? (
          <div
            className="d-flex flex-wrap align-items-center gap-2 mb-3 ga-tabla-filtro"
            role="group"
            aria-label="Filtrar listado por tipo"
          >
            <span className="small text-muted me-1">Mostrar:</span>
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn ${
                  vistaTabla === "usuarios"
                    ? "btn-secondary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setVistaTabla("usuarios")}
              >
                Usuarios
              </button>
              <button
                type="button"
                className={`btn ${
                  vistaTabla === "psicologos"
                    ? "btn-secondary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setVistaTabla("psicologos")}
              >
                Psicólogos
              </button>
            </div>
          </div>
        ) : null}

        <div className="table-responsive">
          <table className="table table-sm table-bordered align-middle mb-0 ga-tabla-detalle">
            <thead className="table-light">
              <tr>
                <th>Usuario / perfil</th>
                <th>Tipo</th>
                <th className="text-end">Ingresos (periodo)</th>
                <th className="text-end">Promedio semanal</th>
                <th>Último acceso</th>
              </tr>
            </thead>
            <tbody>
              {cargando && filasTabla.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted small text-center py-4">
                    Cargando…
                  </td>
                </tr>
              ) : null}
              {errorCarga && !cargando && filasTabla.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted small text-center py-4">
                    No se pudo cargar el listado. Revise el aviso superior.
                  </td>
                </tr>
              ) : null}
              {!cargando && filasTabla.length === 0 && !errorCarga ? (
                <tr>
                  <td colSpan={5} className="text-muted small text-center py-4">
                    No hay aprendices ni psicólogos registrados en el sistema.
                  </td>
                </tr>
              ) : null}
              {!cargando &&
              !errorCarga &&
              filasTabla.length > 0 &&
              filasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted small text-center py-4">
                    {vistaTabla === "usuarios"
                      ? "No hay usuarios (aprendices) registrados."
                      : "No hay psicólogos registrados."}
                  </td>
                </tr>
              ) : null}
              {filasPagina.map((u) => (
                <tr key={u.id}>
                  <td className="fw-medium">{u.nombre}</td>
                  <td>
                    <span className="ga-badge-tipo">{u.tipo}</span>
                  </td>
                  <td className="text-end font-monospace">{u.ingresos}</td>
                  <td className="text-end font-monospace">
                    {Number(u.frecuenciaSemanal).toFixed(1).replace(".", ",")}
                  </td>
                  <td className="small text-muted">
                    {u.ultimoAcceso?.trim() ? u.ultimoAcceso : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!cargando && !errorCarga && filasFiltradas.length > 0 ? (
          <PaginacionTablaMinimal
            paginaActual={paginaSegura}
            totalPaginas={totalPaginasTabla}
            onCambiarPagina={setPaginaTabla}
            totalItems={filasFiltradas.length}
            ocultarSiVacio
          />
        ) : null}
      </div>
    </section>
  );
}
