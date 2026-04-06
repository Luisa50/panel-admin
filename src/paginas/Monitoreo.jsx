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
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/auth";

export default function Monitoreo() {
  const [cantidadAprendices, setCantidadAprendices] = useState([]);
  const [datosPorMes, setdatosPorMes] = useState({});
  const [totalActividadesProceso, setTotalActividadesProceso] = useState({});
  const [totalActividadesExitosas, setTotalActividadesExitosas] = useState({});
  const [totalIncidencias, setTotalIncidencias] = useState({});
  const [totalPorEstado, setTotalPorEstado] = useState([]);

  useEffect(() => {
    const loadData = () => {
      fetchWithAuth("http://healthymind10.runasp.net/api/Aprendiz/estadistica/por-mes")
        .then((res) => res.json())
        .then((json) => setCantidadAprendices(Array.isArray(json) ? json : []))
        .catch((err) => console.log("Error cargando API:", err));
    };
    loadData();
    const intervalo = setInterval(loadData, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const loadData = () => {
      fetchWithAuth("http://healthymind10.runasp.net/api/Aprendiz/estadistica/crecimiento-mensual")
        .then((res) => res.json())
        .then((json) => setdatosPorMes(json ?? {}))
        .catch((err) => console.log("Error cargando API:", err));
    };
    loadData();
    const intervalo = setInterval(loadData, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const loadData = () => {
      fetchWithAuth("http://healthymind10.runasp.net/api/Citas/citas/estado-proceso")
        .then((res) => res.json())
        .then((json) => setTotalActividadesProceso(json ?? {}))
        .catch((err) => console.log("Error cargando API:", err));
    };
    loadData();
    const intervalo = setInterval(loadData, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const loadData = () => {
      fetchWithAuth("http://healthymind10.runasp.net/api/Citas/estadistica/actividad-exitosa")
        .then((res) => res.json())
        .then((json) => setTotalActividadesExitosas(json ?? {}))
        .catch((err) => console.log("Error cargando API:", err));
    };
    loadData();
    const intervalo = setInterval(loadData, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const loadData = () => {
      fetchWithAuth("http://healthymind10.runasp.net/api/Citas/citas/estado-incidencias")
        .then((res) => res.json())
        .then((json) => setTotalIncidencias(json ?? {}))
        .catch((err) => console.log("Error cargando API:", err));
    };
    loadData();
    const intervalo = setInterval(loadData, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const loadData = () => {
      fetchWithAuth("http://healthymind10.runasp.net/api/Citas/estadistica/por-estado")
        .then((res) => res.json())
        .then((json) => setTotalPorEstado(Array.isArray(json) ? json : []))
        .catch((err) => console.log("Error cargando API:", err));
    };
    loadData();
    const intervalo = setInterval(loadData, 5000);
    return () => clearInterval(intervalo);
  }, []);
  
  const datosAPI = cantidadAprendices.reduce((acc, item) => {
    acc[item.mes] = item.total;
    return acc;
  }, {});

  const estadosCitas = totalPorEstado.reduce((acc, item) => {
    acc[item.estadoCita] = item.total;
    return acc;
  }, {});

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

  const citas = [
    { name: "Pendientes", value: estadosCitas["pendiente"] ?? 0 },
    { name: "Programadas", value: estadosCitas["programada"] ?? 0 },
    { name: "Reprogramadas", value: estadosCitas["reprogramada"] ?? 0 },
    { name: "Realizadas", value: estadosCitas["realizada"] ?? 0 },
    { name: "Canceladas", value: estadosCitas["cancelada"] ?? 0 },
    { name: "No asistidas", value: estadosCitas["no asistió"] ?? 0 },
  ];

  const resumenCitasOperativas = [
    {
      nombre: "Exitosas",
      cantidad: Number(totalActividadesExitosas?.exitosas) || 0,
    },
    {
      nombre: "En proceso",
      cantidad: Number(totalActividadesProceso?.citasEnProceso) || 0,
    },
    {
      nombre: "Incidencias",
      cantidad: Number(totalIncidencias?.citasEnIncidencias) || 0,
    },
  ];

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

  const filaTarjetasKpi = (
    <div className="row g-4 mb-4 pt-0">
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card stat-card dark-card" id="carta-monitoreo">
          <div className="card-body">
            <p className="text-secondary m-0">Usuarios registrados por mes</p>
            <h3 className="fw-bold">{datosPorMes?.porcentajeCrecimiento ?? "—"}%</h3>
            <small className="text-success">{datosPorMes?.promedioMensual ?? "—"} promedio</small>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card stat-card" id="carta-monitoreo">
          <div className="card-body">
            <p className="text-secondary m-0">Actividad Exitosa</p>
            <h4 className="fw-bold">{totalActividadesExitosas?.porcentaje ?? "—"}%</h4>
            <small className="text-danger">{totalActividadesExitosas?.exitosas ?? "—"} citas</small>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card stat-card" id="carta-monitoreo">
          <div className="card-body">
            <p className="text-secondary m-0">Actividades en Proceso</p>
            <h4 className="fw-bold">{totalActividadesProceso?.porcentajeEnProceso ?? "—"}%</h4>
            <small className="text-success">{totalActividadesProceso?.citasEnProceso ?? "—"} citas</small>
          </div>
        </div>
      </div>

      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card stat-card" id="carta-monitoreo">
          <div className="card-body">
            <p className="text-secondary m-0">Incidencias</p>
            <h4 className="fw-bold">{totalIncidencias?.porcentajeEnProceso ?? "—"}%</h4>
            <small className="text-danger">{totalIncidencias?.citasEnIncidencias ?? "—"} citas</small>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid p-0 mb-0 dashboard-monitoreo-root">
      {filaTarjetasKpi}

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card graph-card p-3 p-md-4 p-lg-5 h-100">
            <h5 className="fw-semibold mb-3">Usuarios registrados los últimos meses</h5>
            <div style={{ width: "100%", height: 320, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
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
            <h5 className="fw-semibold mb-3">Estados de citas</h5>
            <div style={{ width: "100%", height: 320, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
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
            <h5 className="fw-semibold mb-3">Acumulado de usuarios registrados</h5>
            <div style={{ width: "100%", height: 320, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
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
                    name="Total acumulado"
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
            <h5 className="fw-semibold mb-3">Citas por situación operativa</h5>
            <div style={{ width: "100%", height: 320, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
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
                    name="Citas"
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
