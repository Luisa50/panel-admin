import React, { useEffect, useState } from "react";
import Monitoreo from "./Monitoreo";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const [totalAprendices, setTotalAprendices] = useState({});
  const [totalPsicologo, setTotalPsicologo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      fetch("http://healthymind10.runasp.net/api/Aprendiz/estadistica/total-registrados")
        .then((res) => res.json())
        .then((json) => setTotalAprendices(json ?? {}))
        .catch((err) => console.log(err));
    };

    loadData();
    const intervalo = setInterval(loadData, 10000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const loadData = () => {
      fetch("http://healthymind10.runasp.net/api/psicologo/estadistica/total-activos")
        .then((res) => res.json())
        .then((json) => setTotalPsicologo(json ?? {}))
        .catch((err) => console.log(err));
    };

    loadData();
    const intervalo = setInterval(loadData, 10000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="dashboard-container">

      <div className="bloque-dashboard">
        <div className="accesos-izquierda">

          <div className="grupos-accesos-horizontal">

            <div className="grupo-card compacto">
              <h3>Usuarios</h3>
              <div className="grupo-items">
                <div onClick={() => navigate("/aprendices")}>Aprendices</div>
                <div onClick={() => navigate("/psicologos")}>Psicólogos</div>
                <div onClick={() => navigate("/estado-aprendiz")}>Estado</div>
              </div>
            </div>


            <div className="grupo-card compacto">
              <h3>Educativo</h3>
              <div className="grupo-items">
                <div onClick={() => navigate("/programas")}>Programa</div>
                <div onClick={() => navigate("/regionales")}>Regional</div>
                <div className="disabled">Tipo formación</div>
              </div>
            </div>

            {["Reportes", "Configuración", "Estadisticas", "Soporte"].map((titulo, i) => (
              <div key={i} className="grupo-card compacto disabled-card">
                <h3>{titulo}</h3>
                <div className="grupo-items">
                  <div className="disabled">Próximamente</div>
                  <div className="disabled">---</div>
                  <div className="disabled">---</div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>


      <div className="bloque-dashboard">
        <div className="panel-derecho full-width">
          <div className="card-grafica">
            <Monitoreo />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Inicio;