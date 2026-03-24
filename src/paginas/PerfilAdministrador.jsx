import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/PerfilAdministrador.css";

export default function PerfilUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    contrasena: "Admin123*",
    ultimoAcceso: "20/03/2026",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="perfil-container">

      <div className="perfil-card">

        {/* LADO IZQUIERDO */}
        <div className="perfil-left">

          <img
            src="https://i.pravatar.cc/300?img=12"
            alt="perfil"
            className="perfil-img"
          />

          <h2>{formData.nombres}</h2>
          <p>{formData.rol}</p>

          <div className="perfil-badges">
            <span className="badge activo">{formData.estado}</span>
          </div>

          <div className="perfil-info-extra">
            <p><strong>Último acceso:</strong></p>
            <span>{formData.ultimoAcceso}</span>
          </div>

        </div>

        {/* LADO DERECHO */}
        <div className="perfil-right">

          {/* INFO GENERAL */}
          <div className="form-seccion">
            <h3>Información General</h3>

            <div className="grid">

              <div className="campo">
                <label>Nombres</label>
                <input name="nombres" value={formData.nombres} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Apellidos</label>
                <input name="apellidos" value={formData.apellidos} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Correo</label>
                <input name="correo" value={formData.correo} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Teléfono</label>
                <input name="telefono" value={formData.telefono} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Ciudad</label>
                <input name="ciudad" value={formData.ciudad} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Dirección</label>
                <input name="direccion" value={formData.direccion} onChange={handleChange} />
              </div>

            </div>
          </div>

          {/* CUENTA */}
          <div className="form-seccion">
            <h3>Cuenta</h3>

            <div className="grid">

              <div className="campo">
                <label>Usuario</label>
                <input name="usuario" value={formData.usuario} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Contraseña</label>
                <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Rol</label>
                <input value={formData.rol} disabled />
              </div>

              <div className="campo">
                <label>Estado</label>
                <input value={formData.estado} disabled />
              </div>

            </div>
          </div>

       
          <div className="botones">

            <button
              className="btn-cancelar"
              onClick={() => navigate("/inicio")}
            >
              Cancelar
            </button>

            <button className="btn-guardar">
              Guardar cambios
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}