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
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos guardados:", formData);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6fb",
        padding: "40px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1300px",
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
          display: "flex",
          overflow: "hidden",
        }}
      >
    
        <div
          style={{
            width: "340px",
            background: "linear-gradient(135deg, #4a6cf7, #6c63ff)",
            padding: "40px 25px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="https://i.pravatar.cc/300?img=12"
            alt="perfil"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "5px solid rgba(255,255,255,0.3)",
              marginBottom: "20px",
            }}
          />

          <h2 style={{ margin: 0, textAlign: "center" }}>
            {formData.nombres} {formData.apellidos}
          </h2>

          <p style={{ marginTop: "8px", opacity: 0.9 }}>
            {formData.correo}
          </p>
        </div>

     
        <div
          style={{
            flex: 1,
            padding: "50px",
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          <form onSubmit={handleSubmit}>
           
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
                  <input name="correo" value={formData.correo} onChange={handleChange} type="email" />
                </div>

                <div className="campo">
                  <label>Teléfono</label>
                  <input name="telefono" value={formData.telefono} onChange={handleChange} />
                </div>

                <div className="campo">
                  <label>Rol</label>
                  <input name="rol" value={formData.rol} onChange={handleChange} />
                </div>

                <div className="campo">
                  <label>Estado</label>
                  <input name="estado" value={formData.estado} onChange={handleChange} />
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

            
            <div className="form-seccion">
              <h3>Información Médica</h3>

              <div className="grid">
                <div className="campo">
                  <label>EPS</label>
                  <input name="eps" value={formData.eps} onChange={handleChange} />
                </div>

                <div className="campo">
                  <label>Tipo de Sangre</label>
                  <select name="sangre" value={formData.sangre} onChange={handleChange}>
                    <option value="">Seleccione</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>

                <div className="campo">
                  <label>Alergias</label>
                  <input name="alergias" value={formData.alergias} onChange={handleChange} />
                </div>
              </div>
            </div>

           
            <div className="form-seccion">
              <h3>Cuenta del Usuario</h3>

              <div className="grid">
                <div className="campo">
                  <label>Usuario</label>
                  <input
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    autoComplete="username"
                  />
                </div>

                <div className="campo">
                  <label>Contraseña</label>
                  <input
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    type="password"
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </div>

        
            <div
              style={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "15px",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/inicio")}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#f1f3f9",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                style={{
                  padding: "10px 25px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#4a6cf7",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
