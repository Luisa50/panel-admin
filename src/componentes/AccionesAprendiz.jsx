import React from "react";

export default function AccionesAprendiz({ id, onVer, onEditar, onEliminar }) {
  return (
    <div className="btn-group" role="group">
      <button
        type="button"
        className="btn btn-info btn-sm"
        onClick={() => onVer(id)}
        disabled={id == null || id === ""}
      >
        <i className="bi bi-eye"></i>
      </button>

      <button
        type="button"
        className="btn btn-warning btn-sm"
        onClick={() => onEditar(id)}
        disabled={id == null || id === ""}
      >
        <i className="bi bi-pencil-square"></i>
      </button>

      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => onEliminar(id)}
        disabled={id == null || id === ""}
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>
  );
}
