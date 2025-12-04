import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormularioPerfil() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "Laura Marcela",
    apellidos: "Gómez Rodríguez",
    tipoDocumento: "Cédula",
    documento: "1032456789",
    nacimiento: "1998-07-15",
    genero: "Femenino",
    correo: "laura.gomez@healthymind.com",
    telefono: "3204567890",
    ciudad: "Bogotá",
    direccion: "Calle 123 #45-67",
    eps: "Sanitas",
    sangre: "O+",
    alergias: "Ninguna",
    usuario: "laura.admin",
    contraseña: "admin1234"
  });

  //  manejar cambios
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarPerfil = (e) => {
    e.preventDefault();

    alert("Perfil guardado exitosamente");

    navigate("/inicio");
  };

  return (
    <div className="formulario-perfil">
      <h2 className="titulo-form">Perfil del Usuario</h2>

      <form className="form-grid" onSubmit={guardarPerfil}>


        <div className="form-seccion">
          <h3>Datos Personales</h3>

          <div className="grid">
            <div className="campo">
              <label>Nombres</label>
              <input
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="campo">
              <label>Apellidos</label>
              <input
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="campo">
              <label>Tipo de Documento</label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
              >
                <option>Seleccione</option>
                <option>Cédula</option>
                <option>Tarjeta de Identidad</option>
                <option>Pasaporte</option>
              </select>
            </div>

            <div className="campo">
              <label>Número Documento</label>
              <input
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="campo">
              <label>Fecha de Nacimiento</label>
              <input
                name="nacimiento"
                value={formData.nacimiento}
                onChange={handleChange}
                type="date"
              />
            </div>

            <div className="campo">
              <label>Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
              >
                <option>Seleccione</option>
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
        </div>


        <div className="form-seccion">
          <h3>Contacto</h3>

          <div className="grid">
            <div className="campo">
              <label>Correo</label>
              <input
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                type="email"
              />
            </div>

            <div className="campo">
              <label>Teléfono</label>
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="campo">
              <label>Ciudad</label>
              <input
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="campo">
              <label>Dirección</label>
              <input
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                type="text"
              />
            </div>
          </div>
        </div>


        <div className="form-seccion">
          <h3>Información Médica</h3>

          <div className="grid">
            <div className="campo">
              <label>EPS</label>
              <input
                name="eps"
                value={formData.eps}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div className="campo">
              <label>Tipo de Sangre</label>
              <select
                name="sangre"
                value={formData.sangre}
                onChange={handleChange}
              >
                <option>Seleccione</option>
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
              <input
                name="alergias"
                value={formData.alergias}
                onChange={handleChange}
                type="text"
              />
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
                type="text"
              />
            </div>

            <div className="campo">
              <label>Contraseña</label>
              <input
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                type="password"
              />
            </div>
          </div>
        </div>


        <div className="botones">
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate("/inicio")}
          >
            Cancelar
          </button>

          <button type="submit" className="btn-crear">
            Guardar
          </button>
        </div>

      </form>
    </div>
  );
}
