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
  placeholderBusqueda = "Buscar",
  mostrarBusqueda = true,
  ariaLabelBusqueda = "Buscar",
  children,
}) {
  return (
    <div className="centro-header d-flex justify-content-between align-items-center flex-wrap gap-2">
      <h2 className="mb-0">{titulo}</h2>
      <div className="d-flex gap-2 align-items-center flex-wrap">
        <div className="encabezado-buscar-mas">
          {mostrarBusqueda && typeof onChangeBusqueda === "function" ? (
            <input
              type="search"
              className="form-control encabezado-buscar-input"
              placeholder={placeholderBusqueda}
              value={busqueda ?? ""}
              onChange={onChangeBusqueda}
              aria-label={ariaLabelBusqueda}
            />
          ) : null}
          {onNuevo ? (
            <button
              type="button"
              className="btn btn-primary px-3 flex-shrink-0"
              title={tituloBotonNuevo}
              onClick={onNuevo}
            >
              {textoBotonNuevo}
            </button>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
