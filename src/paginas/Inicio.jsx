import React, { useEffect, useState } from "react";
import TarjetaResumen from "../componentes/TarjetaResumen";
import { Users, UserCheck, Mail } from "lucide-react";
import { fetchWithAuth } from "../services/auth";
import Monitoreo from "./Monitoreo";

const Inicio = () => {
  const [totalAprendices, setTotalAprendices] = useState({});
  const [totalPsicologo, setTotalPsicologo] = useState({});

  useEffect(() => {
    const loadData = () => {
      fetchWithAuth("http://healthymind10.runasp.net/api/Aprendiz/estadistica/total-registrados")
        .then((res) => res.json())
        .then((json) => setTotalAprendices(json ?? {}))
        .catch((err) => console.log("Error cargando API:", err));
    };
    loadData();
    const intervalo = setInterval(loadData, 5000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const loadData = () => {
      fetchWithAuth("http://healthymind10.runasp.net/api/psicologo/estadistica/total-activos")
        .then((res) => res.json())
        .then((json) => setTotalPsicologo(json ?? {}))
        .catch((err) => console.log("Error cargando API:", err));
    };
    loadData();
    const intervalo = setInterval(loadData, 5000);
    return () => clearInterval(intervalo);
  }, []);
  

  return (
    <>
   
      <div className="contenedor-tarjetas">
        <TarjetaResumen titulo="Usuarios Registrados" valor={totalAprendices?.totalAprendices ?? "—"} icono={<Users />} />
        <TarjetaResumen titulo="Psicólogos Activos" valor={totalPsicologo?.totalPsicologos ?? "—"} icono={<UserCheck />} />
        <TarjetaResumen titulo="Solicitudes Pendientes" valor="12" icono={<Mail />} />
  
      </div>
      <Monitoreo></Monitoreo>

      
    </>
  );
};

export default Inicio;

