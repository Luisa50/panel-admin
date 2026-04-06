import SidebarNotificaciones from "./SidebarNotificaciones";
import "../estilos/BarraSuperior.css";

export default function BarraSuperior() {
  return (
    <div className="layout-topbar">
      <SidebarNotificaciones variant="header" />
    </div>
  );
}
