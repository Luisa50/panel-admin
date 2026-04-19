import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../estilos/gestionAccesos.css";
import SeccionAnaliticaUso from "../componentes/accesos/SeccionAnaliticaUso.jsx";
import { cargarFilasTablaAccesos } from "../componentes/accesos/cargarRegistradosAccesos.js";

export default function GestionAccesos() {
  const [filasTabla, setFilasTabla] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setCargando(true);
      setErrorCarga(null);
      try {
        const filas = await cargarFilasTablaAccesos();
        if (!cancelado) setFilasTabla(filas);
      } catch (e) {
        console.error("Accesos: error cargando registrados", e);
        if (!cancelado) {
          setErrorCarga(
            "No se pudieron cargar los listados de aprendices y psicólogos. Compruebe la sesión y la conexión con el servidor."
          );
          setFilasTabla([]);
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="container-fluid p-4 gestion-accesos-page">
      <div className="ga-modulo-recuadro">
        <h3 className="fw-bold mb-2">Accesos</h3>
        <p className="text-muted mb-4">
          Vista de analítica de uso y seguimiento de accesos. La tabla incluye a
          los aprendices y psicólogos registrados en el sistema (mismos datos que
          en sus módulos). Las cifras de ingresos, frecuencia y módulos se
          mostrarán cuando el backend registre la actividad real; por ahora
          aparecen en cero o vacías de forma intencional.
        </p>

        <SeccionAnaliticaUso
          filasTabla={filasTabla}
          cargando={cargando}
          errorCarga={errorCarga}
        />
      </div>
    </div>
  );
}
