import BarraLateral from "./BarraLateral";
import BarraSuperior from "./BarraSuperior";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="layout-contenedor">

      <BarraLateral />

      <div className="layout-derecha">
        <BarraSuperior />
        <div className="layout-contenido">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
