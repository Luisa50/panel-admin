import React from "react";

/**
 * Cabecera homogénea: título + búsqueda opcional + botón de alta.
 */
export default function EncabezadoListadoMaestro({
  titulo,
  onNuevo,
  textoBotonNuevo = "+",
  tituloBotonNuevo = "Nuevo registro",
  busqueda,
  onChangeBusqueda,
  placeholderBusqueda = "Buscar…",
  mostrarBusqueda = true,
  ariaLabelBusqueda = "Buscar",
  children,
}) {
  return (
    <div className="centro-header d-flex justify-content-between align-items-center flex-wrap gap-2">
      <h2 className="mb-0">{titulo}</h2>
      <div className="d-flex gap-2 align-items-center flex-wrap">
        {mostrarBusqueda && typeof onChangeBusqueda === "function" ? (
          <input
            type="search"
            className="form-control"
            style={{ minWidth: "200px" }}
            placeholder={placeholderBusqueda}
            value={busqueda ?? ""}
            onChange={onChangeBusqueda}
            aria-label={ariaLabelBusqueda}
          />
        ) : null}
        {children}
        {onNuevo ? (
          <button
            type="button"
            className="btn btn-success px-3"
            title={tituloBotonNuevo}
            onClick={onNuevo}
          >
            {textoBotonNuevo}
          </button>
        ) : null}
      </div>
    </div>
  );
}
