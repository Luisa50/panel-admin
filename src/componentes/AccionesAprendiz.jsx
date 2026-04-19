import React from "react";

/** Misma apariencia que la columna de acciones en Centros (enlace + iconos lápiz / papelera). */
export default function AccionesAprendiz({ id, onVer, onEditar, onEliminar }) {
  const disabled = id == null || id === "";
  return (
    <div className="acciones-tabla-centro d-inline-flex align-items-center flex-nowrap">
      <button
        type="button"
        className="btn btn-sm btn-link acciones-tabla-btn icono-ver-centro border-0"
        onClick={() => onVer(id)}
        disabled={disabled}
        title="Ver"
        aria-label="Ver"
      >
        <i className="bi bi-eye" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="btn btn-sm btn-link acciones-tabla-btn border-0 acciones-tabla-centro-editar"
        onClick={() => onEditar(id)}
        disabled={disabled}
        title="Editar"
        aria-label="Editar"
      >
        <i className="bi bi-pencil" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="btn btn-sm btn-link acciones-tabla-btn border-0 acciones-tabla-centro-eliminar"
        onClick={() => onEliminar(id)}
        disabled={disabled}
        title="Eliminar"
        aria-label="Eliminar"
      >
        <i className="bi bi-trash" aria-hidden="true" />
      </button>
    </div>
  );
}
