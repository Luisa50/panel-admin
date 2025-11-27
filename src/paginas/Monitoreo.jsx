import "bootstrap/dist/css/bootstrap.min.css";
import "../estilos/principal.css";
import {
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
} from "recharts";

export default function Monitoreo() {

  const usuariosPorMes = [
    { mes: "Ene", cantidad: 10 },
    { mes: "Feb", cantidad: 18 },
    { mes: "Mar", cantidad: 25 },
    { mes: "Abr", cantidad: 22 },
    { mes: "May", cantidad: 32 },
    { mes: "Jun", cantidad: 20 },
    { mes: "Jul", cantidad: 30 },
    { mes: "Ago", cantidad: 16 },
    { mes: "Sep", cantidad: 10 },
    { mes: "Oct", cantidad: 32 },
  ];

  const citas = [
    { name: "Pendientes", value: 12 },
    { name: "Programadas", value: 10 },
    { name: "Reprogramadas", value: 6 },
    { name: "Realizadas", value: 20 },
    { name: "Canceladas", value: 4 },
    { name: "No asistidas", value: 3 },
  ];


  const colors = [
    "#003366",
    "#1A73E8",
    "#4BA3F2",
    "#00B3A4",
    "#009970",
    "#006644",
  ];

  return (
    <div className="container-fluid p-4">


      <div className="row g-3 mb-4">
        
        <div className="col-md-3">
          <div className="card stat-card dark-card">
            <div className="card-body">
              <p className="text-secondary m-0">Usuarios registrados por mes</p>
              <h3 className="fw-bold">10%</h3>
              <small className="text-success">21.3 promedio</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <p className="text-secondary m-0">Actividad Exitosa</p>
              <h4 className="fw-bold">36.36%</h4>
              <small className="text-danger">20 citas</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <p className="text-secondary m-0">Actividades en Proceso</p>
              <h4 className="fw-bold">50.89%</h4>
              <small className="text-success">28 citas</small>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body">
              <p className="text-secondary m-0">Incidencias</p>
              <h4 className="fw-bold">12.72%</h4>
              <small className="text-danger">7 citas</small>
            </div>
          </div>
        </div>

      </div>


      <div className="row g-4">

        {/* Line Chart */}
        <div className="col-lg-8">
          <div className="card graph-card p-3">
            <h5 className="fw-semibold mb-3">Usuarios Registrados los Ultimos Meses</h5>
            
            <LineChart width={650} height={300} data={usuariosPorMes}>
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
          </div>
        </div>


        <div className="col-lg-4">
          <div className="card graph-card p-3">
            <h5 className="fw-semibold mb-3">Estados de Citas</h5>

            <PieChart width={330} height={330}>
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
    </div>
  );
}
