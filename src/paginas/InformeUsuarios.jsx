import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/informes.css";

function nombreUsuario(u) {
  const n = u?.nombres;
  const a = u?.apellidos;
  const nom = [n?.primerNombre, n?.segundoNombre].filter(Boolean).join(" ");
  const ape = [a?.primerApellido, a?.segundoApellido].filter(Boolean).join(" ");
  const s = `${nom} ${ape}`.trim();
  return s || "—";
}

function etiquetaEstadoRegistro(valor) {
  if (valor == null || valor === "") return "Sin indicar";
  const s = String(valor).toLowerCase();
  if (s === "activo") return "Activo";
  if (s === "inactivo") return "Inactivo";
  return String(valor).charAt(0).toUpperCase() + String(valor).slice(1);
}

const InformeUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetchWithAuth(
          `${API_URL}/Aprendiz/listar?Pagina=1&TamanoPagina=1000`
        );
        if (!res) return;
        const json = await res.json();
        setUsuarios(json.resultado || []);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, []);

  if (loading) {
    return <p style={{ padding: "40px" }}>Cargando informe...</p>;
  }

  const totalUsuarios = usuarios.length;
  const activos = usuarios.filter((u) => u.estadoRegistro === "activo").length;
  const inactivos = totalUsuarios - activos;
  const pctActivo =
    totalUsuarios > 0 ? Math.round((activos / totalUsuarios) * 100) : 0;
  const pctInactivo =
    totalUsuarios > 0 ? Math.round((inactivos / totalUsuarios) * 100) : 0;
  const fechaConsulta = new Date().toLocaleString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="pagina-informe">
      <div className="hoja-a4">
        <header className="encabezado">
          <h2>Usuarios registrados en HealthyMind</h2>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#666" }}>
            Corte de información: {fechaConsulta}
          </p>
        </header>

        <div className="bloque">
          <p className="informe-parrafo">
            {totalUsuarios === 0 ? (
              <>
                En la consulta realizada no se devolvieron registros de usuario;
                el listado aparece vacío y no es posible calcular activos ni
                inactivos hasta que existan filas en la respuesta del servicio.
              </>
            ) : (
              <>
                Actualmente hay <strong>{totalUsuarios}</strong> usuario(s) en
                este listado. De ellos, <strong>{activos}</strong> se encuentran
                en estado activo (<strong>{pctActivo}%</strong> del total) y{" "}
                <strong>{inactivos}</strong> no figuran como activos, lo que
                representa el <strong>{pctInactivo}%</strong> restante. Estas
                proporciones se calculan solo sobre los registros devueltos por
                el endpoint en esta petición.
              </>
            )}
          </p>

          <p className="informe-parrafo">
            {totalUsuarios > 0 && pctActivo >= 80 && (
              <>
                La mayor parte de los registros están activos, lo que sugiere
                una base de usuarios mayormente habilitada; conviene revisar de
                forma puntual los casos inactivos listados abajo.
              </>
            )}
            {totalUsuarios > 0 && pctInactivo >= 40 && (
              <>
                Hay una proporción relevante de registros no activos; puede ser
                útil revisar políticas de actualización o contacto con esas
                personas según las reglas de la entidad.
              </>
            )}
            {totalUsuarios > 0 && pctActivo < 80 && pctInactivo < 40 && (
              <>
                La mezcla entre activos e inactivos es moderada; el detalle por
                fila permite identificar documentos y correos para seguimiento.
              </>
            )}
            {totalUsuarios === 0 && (
              <>
                Cuando el servicio vuelva a entregar datos, este informe
                mostrará automáticamente las cifras y el detalle nominal.
              </>
            )}
          </p>

          <p className="informe-parrafo">
            La tabla siguiente repite la misma información en formato fila a
            fila: documento, nombre completo, correo de contacto y estado del
            registro tal como viene en la respuesta del API.
          </p>
        </div>

        <section className="tabla-usuarios informe-tabla-cols-5">
          <table>
            <thead>
              <tr>
                <th>N.º</th>
                <th>Documento</th>
                <th>Nombre completo</th>
                <th>Correo de contacto</th>
                <th>Estado del registro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.nroDocumento ?? i}>
                  <td>{i + 1}</td>
                  <td>{u.nroDocumento ?? "—"}</td>
                  <td>{nombreUsuario(u)}</td>
                  <td>{u.contacto?.correoPersonal ?? "—"}</td>
                  <td>{etiquetaEstadoRegistro(u.estadoRegistro)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="pie">
          <p>
            Documento generado automáticamente por HealthyMind · Solo lectura
          </p>
        </footer>

        <div className="acciones no-print">
          <button type="button" onClick={() => window.print()}>
            <i className="bi bi-arrow-bar-down"></i>
          </button>
          <button type="button" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-return-left"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformeUsuarios;
