import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../estilos/principal.css";

export default function Configuracion() {
  const [mostrarModalPass, setMostrarModalPass] = useState(false);

  return (
    <div className="container p-4">
      <h3 className="fw-bold mb-4"> Configuración del Sistema</h3>


      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">
          <span style={{ fontSize: "20px" }}></span> Idioma
        </h5>

        <select className="form-select w-50">
          <option>Español</option>
        </select>
      </div>


      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">
          <span style={{ fontSize: "20px" }}></span> Apariencia
        </h5>

        <div className="d-flex flex-column gap-3 w-50">
          <div>
            <label className="form-label fw-semibold">Tema</label>
            <select className="form-select">
              <option>Modo Claro</option>
            </select>
          </div>

          <div>
            <label className="form-label fw-semibold">Tamaño de Fuente</label>
            <select className="form-select">
              <option>Normal</option>
            </select>
          </div>
        </div>
      </div>


      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">
          <span style={{ fontSize: "20px" }}></span> Zona Horaria
        </h5>

        <select className="form-select w-50">
          <option>GMT-5 (Colombia)</option>
          <option>GMT-6</option>
          <option>GMT-4</option>
          <option>UTC</option>
        </select>
      </div>


      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">
          <span style={{ fontSize: "20px" }}></span> Fecha y Hora
        </h5>

        <div className="row">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Formato de Fecha</label>
            <select className="form-select">
              <option>DD/MM/AAAA</option>
              <option>MM/DD/AAAA</option>
            </select>
          </div>

          <div className="col-md-6 mt-3 mt-md-0">
            <label className="form-label fw-semibold">Formato de Hora</label>
            <select className="form-select">
              <option>24 horas</option>
              <option>12 horas</option>
            </select>
          </div>
        </div>
      </div>


      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">
          <span style={{ fontSize: "20px" }}></span> Notificaciones
        </h5>

        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" defaultChecked />
          <label className="form-check-label">Notificaciones del sistema</label>
        </div>

        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" defaultChecked />
          <label className="form-check-label">Alertas importantes</label>
        </div>

        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" />
          <label className="form-check-label">Reportes semanales al correo</label>
        </div>
      </div>


      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">
          <span style={{ fontSize: "20px" }}></span> Seguridad
        </h5>

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
              <button className="btn btn-success">Modificar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
