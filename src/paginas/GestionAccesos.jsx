import { useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MODULOS = [
  "Aprendices",
  "Psicólogos",
  "Informes",
  "Reportes",
  "Configuración",
];

const datosIniciales = [
  {
    id: 1,
    rol: "Administrador",
    descripcion: "Acceso completo al panel y configuración.",
    permisos: MODULOS,
    activo: true,
  },
  {
    id: 2,
    rol: "Coordinador",
    descripcion: "Gestión de usuarios e informes operativos.",
    permisos: ["Aprendices", "Psicólogos", "Informes", "Reportes"],
    activo: true,
  },
  {
    id: 3,
    rol: "Psicólogo",
    descripcion: "Consulta de fichas y citas asignadas.",
    permisos: ["Aprendices", "Informes"],
    activo: true,
  },
  {
    id: 4,
    rol: "Solo lectura",
    descripcion: "Visualización sin edición de registros.",
    permisos: ["Informes", "Reportes"],
    activo: false,
  },
];

export default function GestionAccesos() {
  const [roles, setRoles] = useState(datosIniciales);
  const [moduloToggle, setModuloToggle] = useState("");

  const ahora = useMemo(
    () =>
      new Date().toLocaleString("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const alternarActivo = (id) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, activo: !r.activo } : r))
    );
  };

  const alternarPermiso = (idRol, modulo) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== idRol) return r;
        const tiene = r.permisos.includes(modulo);
        return {
          ...r,
          permisos: tiene
            ? r.permisos.filter((m) => m !== modulo)
            : [...r.permisos, modulo],
        };
      })
    );
  };

  return (
    <div className="container-fluid p-4" style={{ maxWidth: 1100 }}>
      <h3 className="fw-bold mb-2">Accesos</h3>
      <p className="text-muted mb-4">
        Roles del panel, permisos por módulo y estado de uso. Vista de trabajo
        local para asignación de accesos (sin llamadas adicionales a API).
        Última revisión de pantalla: {ahora}.
      </p>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title fw-semibold mb-3">Roles y permisos</h5>
          <div className="table-responsive">
            <table className="table table-sm table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Rol</th>
                  <th>Descripción</th>
                  <th>Módulos autorizados</th>
                  <th className="text-center">Activo</th>
                  <th className="text-center">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-medium">{r.rol}</td>
                    <td className="small">{r.descripcion}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {MODULOS.map((m) => (
                          <button
                            key={m}
                            type="button"
                            className={`btn btn-sm ${
                              r.permisos.includes(m)
                                ? "btn-success"
                                : "btn-outline-secondary"
                            }`}
                            onClick={() => alternarPermiso(r.id, m)}
                            title={
                              r.permisos.includes(m)
                                ? `Quitar ${m}`
                                : `Añadir ${m}`
                            }
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="form-check form-switch d-inline-flex justify-content-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={r.activo}
                          onChange={() => alternarActivo(r.id)}
                          aria-label={`Rol ${r.rol} activo`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title fw-semibold mb-3">
            Asignación rápida por módulo
          </h5>
          <p className="small text-muted mb-2">
            Seleccione un módulo y marque en qué roles debe estar habilitado (acción
            masiva sobre la tabla anterior).
          </p>
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label small mb-1">Módulo</label>
              <select
                className="form-select form-select-sm"
                value={moduloToggle}
                onChange={(e) => setModuloToggle(e.target.value)}
              >
                <option value="">— Elegir —</option>
                {MODULOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-auto">
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={!moduloToggle}
                onClick={() => {
                  if (!moduloToggle) return;
                  setRoles((prev) =>
                    prev.map((r) =>
                      r.activo && !r.permisos.includes(moduloToggle)
                        ? { ...r, permisos: [...r.permisos, moduloToggle] }
                        : r
                    )
                  );
                }}
              >
                Añadir módulo a roles activos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
