import React from "react";

export default function AccionesAprendiz({ id, onVer, onEditar, onEliminar }) {
  return (
    <div className="btn-group" role="group">
      <button className="btn btn-info btn-sm" onClick={() => onVer(id)}>Ver</button>
      <button className="btn btn-warning btn-sm" onClick={() => onEditar(id)}>Editar</button>
      <button className="btn btn-danger btn-sm" onClick={() => onEliminar(id)}>Eliminar</button>
    </div>
  );
}