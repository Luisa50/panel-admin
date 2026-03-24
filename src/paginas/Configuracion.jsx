import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../estilos/principal.css";
import { useTheme } from "../context/ThemeContext";

export default function Configuracion() {

  const { darkMode, toggleTheme } = useTheme();

  const [mostrarModalPass, setMostrarModalPass] = useState(false);

  const [config, setConfig] = useState({
    idioma: "Español",
    fuente: "Normal",
    zona: "GMT-5",
    fecha: "DD/MM/AAAA",
    hora: "24",
    notificaciones: true,
    alertas: true,
    reportes: false
  });

  const handleChange = (campo, valor) => {
    setConfig({ ...config, [campo]: valor });
  };

  return (

    <div className="container p-4">

      <h3 className="fw-bold mb-4">⚙️ Configuración del Sistema</h3>

     
      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">🌐 Idioma</h5>

        <select
          className="form-select w-50"
          value={config.idioma}
          onChange={(e) => handleChange("idioma", e.target.value)}
        >
          <option>Español</option>
          <option>Inglés</option>
        </select>
      </div>

      
      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">🎨 Apariencia</h5>

        <div className="d-flex flex-column gap-3 w-50">

         
          <div>
            <label className="form-label fw-semibold">Tema</label>

            <select
              className="form-select"
              value={darkMode ? "Oscuro" : "Claro"}
              onChange={(e) => {
                const valor = e.target.value;

                if (valor === "Oscuro" && !darkMode) {
                  toggleTheme();
                }

                if (valor === "Claro" && darkMode) {
                  toggleTheme();
                }
              }}
            >
              <option>Claro</option>
              <option>Oscuro</option>
            </select>
          </div>

          {/* 🔤 FUENTE */}
          <div>
            <label className="form-label fw-semibold">Tamaño de Fuente</label>
            <select
              className="form-select"
              value={config.fuente}
              onChange={(e) => handleChange("fuente", e.target.value)}
            >
              <option>Pequeña</option>
              <option>Normal</option>
              <option>Grande</option>
            </select>
          </div>

        </div>
      </div>

   
      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">🌎 Configuración Regional</h5>

        <select
          className="form-select w-50"
          value={config.zona}
          onChange={(e) => handleChange("zona", e.target.value)}
        >
          <option value="GMT-5">GMT-5 (Colombia)</option>
          <option value="GMT-6">GMT-6</option>
          <option value="GMT-4">GMT-4</option>
          <option value="UTC">UTC</option>
        </select>
      </div>

      
      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">📅 Fecha y Hora</h5>

        <div className="row">

          <div className="col-md-6">
            <label className="form-label fw-semibold">Formato de Fecha</label>
            <select
              className="form-select"
              value={config.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
            >
              <option>DD/MM/AAAA</option>
              <option>MM/DD/AAAA</option>
            </select>
          </div>

          <div className="col-md-6 mt-3 mt-md-0">
            <label className="form-label fw-semibold">Formato de Hora</label>
            <select
              className="form-select"
              value={config.hora}
              onChange={(e) => handleChange("hora", e.target.value)}
            >
              <option value="24">24 horas</option>
              <option value="12">12 horas</option>
            </select>
          </div>

        </div>
      </div>

    
      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">🔔 Notificaciones</h5>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={config.notificaciones}
            onChange={(e) => handleChange("notificaciones", e.target.checked)}
          />
          <label className="form-check-label">Notificaciones del sistema</label>
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={config.alertas}
            onChange={(e) => handleChange("alertas", e.target.checked)}
          />
          <label className="form-check-label">Alertas importantes</label>
        </div>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={config.reportes}
            onChange={(e) => handleChange("reportes", e.target.checked)}
          />
          <label className="form-check-label">Reportes semanales</label>
        </div>
      </div>

    
      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">🔐 Seguridad</h5>

        <button
          className="btn btn-dark px-4"
          onClick={() => setMostrarModalPass(true)}
        >
          Cambiar Contraseña
        </button>
      </div>

    
      {mostrarModalPass && (
        <div className="modal-backdrop-custom">
          <div className="modal-custom card p-4 shadow-lg">

            <h4 className="fw-bold mb-3">Cambiar Contraseña</h4>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Contraseña Actual
              </label>
              <input type="password" className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Nueva Contraseña
              </label>
              <input type="password" className="form-control" />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Confirmar Nueva Contraseña
              </label>
              <input type="password" className="form-control" />
            </div>

            <div className="d-flex justify-content-end gap-3 mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setMostrarModalPass(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-success">
                Modificar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}