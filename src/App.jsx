import { Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/psicologos" element={<Psicologos />} />

        <Route path="/informes" element={<Informes />} />
        <Route path="/informes/usuarios" element={<InformeUsuarios />} />
        <Route path="/informes/psicologos" element={<InformePsicologos />} />
        <Route path="/informes/general" element={<InformeGeneral />} />


        <Route path="/reportes" element={<Reportes />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/fichas" element={<Fichas />} />
        <Route path="/perfil" element={<PerfilAdministrador />} />
      </Route>
    </Routes>
  );
}
