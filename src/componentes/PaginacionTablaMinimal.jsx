import React from "react";

/** Tamaño de página para listados paginados en cliente (programas, área, centro, etc.). */
export const LISTADO_TAM_PAGINA = 10;

/** Listados solo lectura o tablas más cortas (regionales, ciudades). */
export const LISTADO_TAM_PAGINA_COMPACTO = 5;

/** Paginación &lt; página &gt; minimalista; mismo aspecto en todos los listados. */
export default function PaginacionTablaMinimal({
  paginaActual = 1,
  totalPaginas = 1,
  onCambiarPagina,
  ocultarSiVacio = false,
  totalItems = null,
}) {
  if (
    ocultarSiVacio &&
    (totalItems === 0 || totalItems === null || totalItems === undefined)
  ) {
    return null;
  }

  const total = Math.max(1, totalPaginas);
  const pagina = Math.min(Math.max(1, paginaActual), total);
  const paginaAnterior = pagina > 1 ? pagina - 1 : null;
  const paginaSiguiente = pagina < total ? pagina + 1 : null;

  return (
    <nav
      className="paginacion-tabla-minimal mt-3"
      aria-label="Paginación del listado"
    >
      <div className="paginacion-tabla-minimal-inner">
        <button
          type="button"
          className="paginacion-tabla-minimal-btn"
          disabled={paginaAnterior == null}
          onClick={() =>
            paginaAnterior != null && onCambiarPagina(paginaAnterior)
          }
          aria-label="Página anterior"
        >
          <span aria-hidden="true">&lt;</span>
        </button>
        <span className="paginacion-tabla-minimal-pagina" aria-current="page">
          {pagina}
        </span>
        <button
          type="button"
          className="paginacion-tabla-minimal-btn"
          disabled={paginaSiguiente == null}
          onClick={() =>
            paginaSiguiente != null && onCambiarPagina(paginaSiguiente)
          }
          aria-label="Página siguiente"
        >
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>
    </nav>
  );
}
