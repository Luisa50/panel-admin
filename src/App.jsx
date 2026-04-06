import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Login from "./paginas/Login";
import Inicio from "./paginas/Inicio";
import Usuarios from "./paginas/Usuarios";
import Layout from "./componentes/Layout";
import PerfilAdministrador from "./paginas/PerfilAdministrador";
import Psicologos from "./paginas/Psicologos";
import Reportes from "./paginas/Reportes";
import Fichas from "./paginas/Fichas";
import Configuracion from "./paginas/Configuracion";
import Informes from "./paginas/Informes";
import InformeUsuarios from "./paginas/InformeUsuarios";
import InformePsicologos from "./paginas/InformePsicologos";
import InformeGeneral from "./paginas/InformeGeneral";
import Regionales from "./paginas/Regionales";
import Area from "./paginas/Area";
import CentrosNodos from "./paginas/CentrosNodos";
import Ciudades from "./paginas/Ciudades";
import NivelFormacion from "./paginas/NivelFormacion";
import ProgramaFormacion from "./paginas/ProgramaFormacion";
import Notificaciones from "./paginas/Notificaciones";
import NotFound from "./paginas/NotFound";
import GestionAccesos from "./paginas/GestionAccesos";
import GestionAdministrativa from "./paginas/GestionAdministrativa";

export default function App() {

 
  useEffect(() => {
    const tema = localStorage.getItem("tema");

    if (tema === "oscuro") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/psicologos" element={<Psicologos />} />
        <Route path="/gestion" element={<GestionAdministrativa />} />
        <Route path="/accesos" element={<GestionAccesos />} />
        <Route
          path="/gestion-accesos"
          element={<Navigate to="/accesos" replace />}
        />

        <Route path="/informes" element={<Informes />} />
        <Route path="/informes/usuarios" element={<InformeUsuarios />} />
        <Route path="/informes/psicologos" element={<InformePsicologos />} />
        <Route path="/informes/general" element={<InformeGeneral />} />
        <Route path="/informes/reportes" element={<Reportes />} />

        <Route path="/reportes" element={<Reportes />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/fichas" element={<Fichas />} />
        <Route path="/perfil" element={<PerfilAdministrador />} />
        <Route path="/regionales" element={<Regionales />} />
        <Route path="/area" element={<Area />} />
        <Route path="/centros" element={<CentrosNodos />} />
        <Route path="/ciudades" element={<Ciudades />} />
        <Route path="/niveles" element={<NivelFormacion />} />
        <Route path="/programas" element={<ProgramaFormacion />} />  

        <Route path="/notificaciones" element={<Notificaciones />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}