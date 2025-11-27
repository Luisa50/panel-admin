import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, User, LogOut } from "lucide-react";

export default function BarraSuperior() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [notifAbiertas, setNotifAbiertas] = useState(false);

  const cerrarSesion = () => {
    localStorage.removeItem("logged");
    navigate("/");
  };

  return (
    <div className="barra-superior">
      <div
        className="avatar-contenedor"
        onClick={() => {
          setMenuAbierto(!menuAbierto);
          setNotifAbiertas(false);
        }}
      >  <div className="avatar-icono"> 
          <User size={20} />
          <span className="nombre">Admin</span>
        </div>
      </div>


      {menuAbierto && (
        <div className="menu-usuario">
          <div className="menu-user-info">
            <span className="nombre">Administrador</span>
            <span className="correo">admin@sistema.com</span>
          </div>


          <div
            className="item-menu-usuario"
            onClick={() => {
              setMenuAbierto(false);   
              navigate("/perfil");     
            }}
          >
            <User size={16} />
            Perfil
          </div>

          <div
            className="item-menu-usuario item-salir"
            onClick={cerrarSesion}
          >
            <LogOut size={16} />
            Cerrar sesión
          </div>
        </div>
      )}


    </div>
  );
}
