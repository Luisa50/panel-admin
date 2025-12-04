import React from "react";

export default function AccionesAprendiz({ id, onVer, onEditar, onEliminar }) {
  return (
    <div className="btn-group" role="group">
      <button className="btn btn-info btn-sm" onClick={() => onVer(id)}><i class="bi bi-eye"></i></button>
      <button className="btn btn-warning btn-sm" onClick={() => onEditar(id)}><i class="bi bi-pencil-square"></i></button>
      <button className="btn btn-danger btn-sm" onClick={() => onEliminar(id)}><i class="bi bi-trash"></i></button>
    </div>
  );
}