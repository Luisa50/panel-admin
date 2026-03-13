import React, { useState } from "react";
import "../estilos/Gestion.css";

const Gestion = () => {
  const [registros, setRegistros] = useState([
    {
      id: 1,
      usuario: "Ana Pérez",
      ultimoAcceso: "2026-03-01 10:45",
      modulos: ["Usuarios", "Reportes"],
      intentosFallidos: 0,
      sesionActiva: true,
    },
    {
      id: 2,
      usuario: "Carlos López",
      ultimoAcceso: "2026-02-28 08:20",
      modulos: ["Educativo"],
      intentosFallidos: 3,
      sesionActiva: false,
    },
  ]);

  const toggleSesion = (id) => {
    setRegistros((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, sesionActiva: !u.sesionActiva } : u
      )
    );
  };

  return (
    <div className="gestion-container">
      <h2 className="gestion-titulo">Control de Accesos y Actividad</h2>

      <table className="gestion-tabla">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Último acceso</th>
            <th>Módulos activos</th>
            <th>Intentos fallidos</th>
            <th>Sesión</th>
          </tr>
        </thead>

        <tbody>
          {registros.map((u) => (
            <tr key={u.id}>
              <td>{u.usuario}</td>
              <td>{u.ultimoAcceso}</td>

              <td>
                {u.modulos.map((m, i) => (
                  <span key={i} className="tag">
                    {m}
                  </span>
                ))}
              </td>

              <td>
                <span className={u.intentosFallidos > 2 ? "alerta" : ""}>
                  {u.intentosFallidos}
                </span>
              </td>

              <td>
                <button
                  className={u.sesionActiva ? "btn-activo" : "btn-inactivo"}
                  onClick={() => toggleSesion(u.id)}
                >
                  {u.sesionActiva ? "Activa" : "Bloqueada"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Gestion;;