import { fetchWithAuth } from "../../services/auth";
import { API_URL } from "../../config";
import {
  filaAccesoDesdeAprendiz,
  filaAccesoDesdePsicologo,
} from "../../paginas/accesosAnaliticaBase.js";

const TAM_PAGINA = 200;

/**
 * Recorre todas las páginas de un listado paginado (mismo patrón que Usuarios / Psicólogos).
 * @param {string} pathConQuery — ej. "Aprendiz/listar" o "psicologo/listar"
 * @param {(j: object) => unknown[]} extraerFilas
 */
async function listarTodo(pathConQuery, extraerFilas) {
  let pagina = 1;
  const acum = [];
  let seguir = true;

  while (seguir) {
    const res = await fetchWithAuth(
      `${API_URL}/${pathConQuery}?Pagina=${pagina}&TamanoPagina=${TAM_PAGINA}`
    );
    if (!res?.ok) {
      throw new Error(`Error ${res.status} al cargar ${pathConQuery}`);
    }
    const json = await res.json();
    const filas = extraerFilas(json) ?? [];
    acum.push(...filas);

    const totalPaginas = Number(json?.totalPaginas) || 1;
    if (pagina >= totalPaginas || filas.length < TAM_PAGINA) {
      seguir = false;
    } else {
      pagina += 1;
    }
  }
  return acum;
}

/** Aprendices registrados (mismo endpoint que `Usuarios.jsx`). */
export async function cargarAprendicesParaAccesos() {
  const rows = await listarTodo("Aprendiz/listar", (j) => j?.resultado ?? []);
  return rows.map(filaAccesoDesdeAprendiz);
}

/** Psicólogos registrados (mismo endpoint que `Psicologos.jsx`). */
export async function cargarPsicologosParaAccesos() {
  const rows = await listarTodo("psicologo/listar", (j) => {
    const r = j?.resultados ?? j?.resultado;
    return Array.isArray(r) ? r : [];
  });
  return rows.map(filaAccesoDesdePsicologo);
}

/**
 * Combina aprendices y psicólogos para la tabla de accesos (orden estable por tipo y nombre).
 */
export async function cargarFilasTablaAccesos() {
  const [aprendices, psicologos] = await Promise.all([
    cargarAprendicesParaAccesos(),
    cargarPsicologosParaAccesos(),
  ]);
  const todo = [...aprendices, ...psicologos];
  todo.sort((a, b) => {
    const t = a.tipo.localeCompare(b.tipo, "es");
    if (t !== 0) return t;
    return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" });
  });
  return todo;
}
