// src/componentes/modalsPost/ModalEditar.jsx
import React from "react";

export default function Modalver({ formData }) {
  return (
    <div className="modal fade" id="modalVer" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Editar Psicólogo</h5>
            <button className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <form >
            <div className="modal-body">

              <input 
                className="form-control mb-2"
                name="psiNombre"
                value={formData.psiNombre}
                placeholder="Nombre"
                disabled
              />

              <input 
                className="form-control mb-2"
                name="psiApellido"
                value={formData.psiApellido}
                placeholder="Apellido"
                disabled
              />

              <input 
                className="form-control mb-2"
                name="psiEspecialidad"
                value={formData.psiEspecialidad}
                placeholder="Especialidad"
                disabled
              />

              <input 
                className="form-control mb-2"
                name="psiTelefono"
                value={formData.psiTelefono}
                placeholder="Teléfono"
                disabled
              />

              <input 
                className="form-control mb-2"
                name="psiDireccion"
                value={formData.psiDireccion}
                placeholder="Dirección"
                disabled
              />

              <input 
                className="form-control mb-2"
                name="psiCorreoInstitucional"
                value={formData.psiCorreoInstitucional}
                placeholder="Correo Institucional"
                disabled
              />

              <input 
                className="form-control mb-2"
                name="psiCorreoPersonal"
                value={formData.psiCorreoPersonal}
                placeholder="Correo Personal"
                disabled
              />

            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
