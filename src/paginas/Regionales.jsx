import React, { useEffect, useMemo, useState } from "react";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/centrosnodos.css";
import PaginacionTablaMinimal, {
  LISTADO_TAM_PAGINA_COMPACTO,
} from "../componentes/PaginacionTablaMinimal.jsx";

/** Cantidad de ciudades por regional a partir de GET /Ciudad (solo conteo). */
function contarCiudadesPorRegional(ciudades) {
  const m = new Map();
  if (!Array.isArray(ciudades)) return m;
  for (const c of ciudades) {
    const idRaw = c.regional?.regCodigo;
    if (idRaw == null || idRaw === "") continue;
    const id = String(idRaw);
    m.set(id, (m.get(id) ?? 0) + 1);
  }
  return m;
}

export default function Regionales() {
  const [regionales, setRegionales] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paginaLista, setPaginaLista] = useState(1);

  const conteoCiudades = useMemo(
    () => contarCiudadesPorRegional(ciudades),
    [ciudades]
  );

  useEffect(() => {
    let cancelado = false;
    const cargar = async () => {
      try {
        setLoading(true);
        setError("");
        const [resReg, resCiu] = await Promise.all([
          fetchWithAuth(`${API_URL}/Regional`),
          fetchWithAuth(`${API_URL}/Ciudad`),
        ]);
        if (cancelado) return;
        if (!resReg) {
          setRegionales([]);
          setCiudades([]);
          return;
        }
        if (!resReg.ok) {
          setRegionales([]);
          setError("No se pudieron cargar las regionales");
        } else {
          const dataReg = await resReg.json();
          setRegionales(Array.isArray(dataReg) ? dataReg : []);
        }
        let listaCiu = [];
        if (resCiu?.ok) {
          try {
            const dataCiu = await resCiu.json();
            listaCiu = Array.isArray(dataCiu) ? dataCiu : [];
          } catch {
            listaCiu = [];
          }
        }
        setCiudades(listaCiu);
      } catch (err) {
        console.error(err);
        if (!cancelado) {
          setError("No se pudieron cargar las regionales");
          setRegionales([]);
          setCiudades([]);
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    };
    cargar();
    return () => {
      cancelado = true;
    };
  }, []);

  const totalPaginasRegionales = Math.max(
    1,
    Math.ceil(regionales.length / LISTADO_TAM_PAGINA_COMPACTO)
  );
  const paginaRegionalesSegura = Math.min(paginaLista, totalPaginasRegionales);
  const regionalesPagina = useMemo(() => {
    const ini = (paginaRegionalesSegura - 1) * LISTADO_TAM_PAGINA_COMPACTO;
    return regionales.slice(ini, ini + LISTADO_TAM_PAGINA_COMPACTO);
  }, [regionales, paginaRegionalesSegura]);

  useEffect(() => {
    setPaginaLista((p) => Math.min(p, totalPaginasRegionales));
  }, [totalPaginasRegionales]);

  return (
    <div className="centro-container">
      <div className="centro-header">
        <h2>Regionales</h2>
      </div>

      {loading ? (
        <p>Cargando regionales...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="centro-table regionales-tabla-estable">
          <colgroup>
            <col className="regionales-col-codigo" />
            <col className="regionales-col-nombre-col" />
            <col className="regionales-col-ciudades" />
          </colgroup>
          <thead>
            <tr>
              <th className="regionales-col-codigo">Código</th>
              <th className="regionales-col-nombre">Nombre</th>
              <th className="regionales-col-ciudades">N° ciudades</th>
            </tr>
          </thead>
          <tbody>
            {regionalesPagina.map((reg) => (
              <tr key={reg.regCodigo}>
                <td className="regionales-col-codigo">{reg.regCodigo}</td>
                <td
                  className="regionales-col-nombre"
                  title={reg.regNombre ?? ""}
                >
                  {reg.regNombre}
                </td>
                <td className="regionales-col-ciudades">
                  {conteoCiudades.get(String(reg.regCodigo)) ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && regionales.length > 0 ? (
        <PaginacionTablaMinimal
          paginaActual={paginaRegionalesSegura}
          totalPaginas={totalPaginasRegionales}
          onCambiarPagina={setPaginaLista}
          ocultarSiVacio
          totalItems={regionales.length}
        />
      ) : null}
    </div>
  );
}
