import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";
import "../estilos/informes.css";

function etiquetaEstadoPsicologo(valor) {
  if (valor == null || valor === "") return "Sin indicar";
  const s = String(valor).toLowerCase();
  if (s === "activo") return "Activo";
  if (s === "inactivo") return "Inactivo";
  return String(valor).charAt(0).toUpperCase() + String(valor).slice(1);
}

const InformePsicologos = () => {
  const [psicologos, setPsicologos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPsicologos = async () => {
      try {
        const res = await fetchWithAuth(
          `${API_URL}/psicologo/listar?Pagina=1&TamanoPagina=1000`
        );
        if (!res) return;
        const json = await res.json();

        setPsicologos(json.resultados || []);
      } catch (error) {
        console.error("Error cargando psicólogos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarPsicologos();
  }, []);

  if (loading) {
    return <p style={{ padding: "40px" }}>Cargando informe...</p>;
  }

  const totalPsicologos = psicologos.length;
  const activos = psicologos.filter(
    (p) => p.psiEstadoRegistro === "activo"
  ).length;
  const inactivos = totalPsicologos - activos;
  const totalCitasAtendidas = psicologos.reduce(
    (acc, p) => acc + (Number(p.citasAtendidas) || 0),
    0
  );
  const promedioCitas =
    totalPsicologos > 0
      ? (totalCitasAtendidas / totalPsicologos).toFixed(1)
      : "0";
  const maxCitas = Math.max(
    0,
    ...psicologos.map((p) => Number(p.citasAtendidas) || 0)
  );
  const fechaActual = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const pctActivo =
    totalPsicologos > 0
      ? Math.round((activos / totalPsicologos) * 100)
      : 0;

  return (
    <div className="pagina-informe informe-print-pro">
      <div className="hoja-a4 informe-print-pro-hoja">
        <header className="encabezado informe-print-pro-encabezado">
          <p className="informe-print-pro-fecha">
            Listado del API · {fechaActual}
          </p>
          <h2>Plantilla de psicólogos y citas atendidas</h2>
        </header>

        <div className="bloque">
          <p className="informe-parrafo">
            {totalPsicologos === 0 ? (
              <>
                No hay filas en el listado de psicólogos para este informe; la
                consulta devolvió cero registros y no se pueden calcular
                totales ni promedios de citas atendidas.
              </>
            ) : (
              <>
                En el listado consultado figuran <strong>{totalPsicologos}</strong>{" "}
                profesional(es). De ese total, <strong>{activos}</strong> están
                marcado(s) como activo(s) (<strong>{pctActivo}%</strong>) y{" "}
                <strong>{inactivos}</strong> no están en ese estado o
                corresponden a registros inactivos según el campo devuelto por el
                servicio.
              </>
            )}
          </p>

          {totalPsicologos > 0 && (
            <p className="informe-parrafo">
              Sumando el campo de citas atendidas de cada fila, el total
              acumulado es de <strong>{totalCitasAtendidas}</strong> cita(s). Si
              se reparte de forma uniforme entre los{" "}
              <strong>{totalPsicologos}</strong> registro(s), el promedio
              aproximado es de <strong>{promedioCitas}</strong> cita(s) por
              profesional en este conjunto; el valor máximo observado en una
              sola fila es de <strong>{maxCitas}</strong> cita(s).
            </p>
          )}

          <p className="informe-parrafo">
            {totalPsicologos > 0 && activos === 0 && (
              <>
                Ningún registro aparece como activo en este corte; conviene
                revisar en el sistema los estados y la vigencia de la plantilla.
              </>
            )}
            {totalPsicologos > 0 && activos > 0 && (
              <>
                Con <strong>{activos}</strong> profesional(es) activo(s), la
                lectura de la carga en citas debe hacerse junto con la política
                de asignación de la entidad; los datos numéricos aquí son
                meramente descriptivos del listado actual.
              </>
            )}
          </p>

          <p className="informe-parrafo">
            El cuadro inferior muestra fila a fila identificación, datos de
            contacto, especialidad, estado y citas atendidas según cada
            registro devuelto por el endpoint.
          </p>
        </div>

        <section className="tabla-usuarios informe-tabla-cols-8">
          <table>
            <thead>
              <tr>
                <th>N.º</th>
                <th>Identificación</th>
                <th>Profesional</th>
                <th>Especialidad</th>
                <th>Teléfono</th>
                <th>Correo institucional</th>
                <th>Estado</th>
                <th>Citas atendidas</th>
              </tr>
            </thead>
            <tbody>
              {psicologos.map((p, i) => (
                <tr key={p.psiDocumento ?? i}>
                  <td>{i + 1}</td>
                  <td>{p.psiDocumento ?? "—"}</td>
                  <td>
                    {[p.psiNombre, p.psiApellido].filter(Boolean).join(" ") ||
                      "—"}
                  </td>
                  <td>{p.psiEspecialidad ?? "—"}</td>
                  <td>{p.psiTelefono ?? "—"}</td>
                  <td>{p.psiCorreoInstitucional ?? "—"}</td>
                  <td>{etiquetaEstadoPsicologo(p.psiEstadoRegistro)}</td>
                  <td>{p.citasAtendidas ?? 0}</td>
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
          <div className="acciones-grupo">
            <button
              type="button"
              onClick={() => window.print()}
              title="Descargar o imprimir informe (PDF)"
            >
              <i className="bi bi-box-arrow-in-down" aria-hidden="true" />
              <span>Descargar informe</span>
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              title="Volver a la pantalla anterior"
            >
              <i className="bi bi-box-arrow-in-left" aria-hidden="true" />
              <span>Regresar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformePsicologos;
