import React from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/PerfilAdministrador.css";

const datosPerfil = {
  nombres: "Luisa Fernanda",
  apellidos: "Gómez Pérez",
  correo: "luisa@email.com",
  telefono: "3001234567",
  rol: "Administrador",
  estado: "Activo",
  ciudad: "Bogotá",
  direccion: "Calle 123 #45-67",
  eps: "Sanitas",
  sangre: "O+",
  alergias: "Ninguna",
  usuario: "luisa.admin",
  ultimoAcceso: "20/03/2026",
};

export default function PerfilUsuario() {
  const navigate = useNavigate();

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-left">
          <img
            src="https://i.pravatar.cc/300?img=12"
            alt="perfil"
            className="perfil-img"
          />

          <h2>{datosPerfil.nombres}</h2>
          <p>{datosPerfil.rol}</p>

          <div className="perfil-badges">
            <span className="badge activo">{datosPerfil.estado}</span>
          </div>

          <div className="perfil-info-extra">
            <p>
              <strong>Último acceso:</strong>
            </p>
            <span>{datosPerfil.ultimoAcceso}</span>
          </div>
        </div>

        <div className="perfil-right">
          <div className="form-seccion">
            <h3>Información General</h3>

            <div className="grid">
              <div className="campo">
                <label>Nombres</label>
                <input name="nombres" value={datosPerfil.nombres} readOnly />
              </div>

              <div className="campo">
                <label>Apellidos</label>
                <input name="apellidos" value={datosPerfil.apellidos} readOnly />
              </div>

              <div className="campo">
                <label>Correo</label>
                <input name="correo" value={datosPerfil.correo} readOnly />
              </div>

              <div className="campo">
                <label>Teléfono</label>
                <input name="telefono" value={datosPerfil.telefono} readOnly />
              </div>

              <div className="campo">
                <label>Ciudad</label>
                <input name="ciudad" value={datosPerfil.ciudad} readOnly />
              </div>

              <div className="campo">
                <label>Dirección</label>
                <input name="direccion" value={datosPerfil.direccion} readOnly />
              </div>
            </div>
          </div>

          <div className="form-seccion">
            <h3>Cuenta</h3>

            <div className="grid">
              <div className="campo">
                <label>Usuario</label>
                <input name="usuario" value={datosPerfil.usuario} readOnly />
              </div>

              <div className="campo">
                <label>Rol</label>
                <input value={datosPerfil.rol} readOnly />
              </div>

              <div className="campo">
                <label>Estado</label>
                <input value={datosPerfil.estado} readOnly />
              </div>
            </div>
          </div>

          <div className="botones">
            <button
              type="button"
              className="btn-cancelar"
              onClick={() => navigate("/inicio")}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
