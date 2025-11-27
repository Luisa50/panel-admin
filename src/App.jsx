import { Routes, Route } from "react-router-dom";
import Login from "./paginas/Login";
import Inicio from "./paginas/Inicio";
import Usuarios from "./paginas/Usuarios";
import Layout from "./componentes/Layout";
import PerfilAdministrador from "./paginas/PerfilAdministrador";
import Psicologos from "./paginas/Psicologos";
import Solicitudes from "./paginas/Solicitudes";
import Monitoreo from "./paginas/Monitoreo";
import Configuracion from "./paginas/Configuracion";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/psicologos" element={<Psicologos />} />
        <Route path="/solicitudes" element={<Solicitudes />} />
        <Route path="/monitoreo" element={<Monitoreo />} />
        <Route path="/configuracion" element={<Configuracion />} />

        
        <Route path="/perfil" element={<PerfilAdministrador />} />
      </Route>
    </Routes>
  );
}
