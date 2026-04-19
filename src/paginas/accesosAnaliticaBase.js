/**
 * Series y KPI base para analítica de accesos (sin tracking real aún).
 * Cuando exista API de auditoría, sustituir por respuesta del servidor.
 */

export const COLORES_PIE = [
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#ea580c",
  "#db2777",
  "#0891b2",
  "#64748b",
];

/** KPI de uso: valores iniciales hasta conectar registro de accesos. */
export const kpiAccesosInicial = {
  accesosHoy: 0,
  usuariosActivosSemana: 0,
  sesionesPromedioPorUsuario: 0,
  picoHorario: "—",
};

export const actividadPorHoraInicial = Array.from({ length: 24 }, (_, h) => ({
  hora: `${h}h`,
  accesos: 0,
}));

export const actividadPorDiaInicial = [
  { dia: "Lun", sesiones: 0 },
  { dia: "Mar", sesiones: 0 },
  { dia: "Mié", sesiones: 0 },
  { dia: "Jue", sesiones: 0 },
  { dia: "Vie", sesiones: 0 },
  { dia: "Sáb", sesiones: 0 },
  { dia: "Dom", sesiones: 0 },
];

/** Misma lista de módulos que la analítica usará cuando haya datos reales. */
export const usoPorModuloInicial = [
  { modulo: "Aprendices", valor: 0 },
  { modulo: "Psicólogos", valor: 0 },
  { modulo: "Informes", valor: 0 },
  { modulo: "Reportes", valor: 0 },
  { modulo: "Citas", valor: 0 },
  { modulo: "Fichas", valor: 0 },
  { modulo: "Configuración", valor: 0 },
];

function nombreCompletoAprendiz(row) {
  const n = row?.nombres;
  const a = row?.apellidos;
  const partes = [
    n?.primerNombre,
    n?.segundoNombre,
    a?.primerApellido,
    a?.segundoApellido,
  ].filter(Boolean);
  const s = partes.join(" ").trim();
  return s || String(row?.nroDocumento ?? "—");
}

/** @param {object} ap — fila de /Aprendiz/listar */
export function filaAccesoDesdeAprendiz(ap) {
  const idRaw = ap?.codigo ?? ap?.aprCodigo ?? ap?.nroDocumento;
  return {
    id: `aprendiz-${idRaw}`,
    nombre: nombreCompletoAprendiz(ap),
    tipo: "Aprendiz",
    ingresos: 0,
    ultimoAcceso: "",
    frecuenciaSemanal: 0,
  };
}

/**
 * @param {object} p — fila de /psicologo/listar
 */
export function filaAccesoDesdePsicologo(p) {
  const nombre = [p?.psiNombre, p?.psiApellido].filter(Boolean).join(" ").trim();
  return {
    id: `psicologo-${p?.psiCodigo ?? p?.psiDocumento ?? ""}`,
    nombre: nombre || "—",
    tipo: "Psicólogo",
    ingresos: 0,
    ultimoAcceso: "",
    frecuenciaSemanal: 0,
  };
}
