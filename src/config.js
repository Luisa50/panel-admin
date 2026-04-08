/**
 * Configuración central de la API del panel administrador.
 * Define VITE_API_URL en .env (ver .env.example): origen sin barra final y sin /api.
 * Por defecto usa HTTPS para alinear con el front en producción y evitar contenido mixto.
 */
function trimEndSlashes(url) {
  return url.replace(/\/+$/, "");
}

const fromEnv = import.meta.env.VITE_API_URL?.trim();
const fallback = "https://healthymind10.runasp.net";

/** Origen del servidor API, p. ej. https://healthymind10.runasp.net */
export const API_BASE_URL = trimEndSlashes(fromEnv || fallback);

/** Base de rutas REST (/api/...) */
export const API_URL = `${API_BASE_URL}/api`;
