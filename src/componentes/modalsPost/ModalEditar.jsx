// src/componentes/modalsPost/ModalEditar.jsx
import React from "react";

export default function ModalEditar({ formData, handleChange, enviarPut }) {
  return (
    <div className="modal fade" id="modalEditar" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Editar Psicólogo</h5>
            <button className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <form onSubmit={enviarPut}>
            <div className="modal-body">

              <input 
                className="form-control mb-2"
                name="psiNombre"
                value={formData.psiNombre}
                onChange={handleChange}
                placeholder="Nombre"
              />

              <input 
                className="form-control mb-2"
                name="psiApellido"
                value={formData.psiApellido}
                onChange={handleChange}
                placeholder="Apellido"
              />

              <input 
                className="form-control mb-2"
                name="psiEspecialidad"
                value={formData.psiEspecialidad}
                onChange={handleChange}
                placeholder="Especialidad"
              />

              <input 
                className="form-control mb-2"
                name="psiTelefono"
                value={formData.psiTelefono}
                onChange={handleChange}
                placeholder="Teléfono"
              />

              <input 
                className="form-control mb-2"
                name="psiDireccion"
                value={formData.psiDireccion}
                onChange={handleChange}
                placeholder="Dirección"
              />

              <input 
                className="form-control mb-2"
                name="psiCorreoInstitucional"
                value={formData.psiCorreoInstitucional}
                onChange={handleChange}
                placeholder="Correo Institucional"
              />

              <input 
                className="form-control mb-2"
                name="psiCorreoPersonal"
                value={formData.psiCorreoPersonal}
                onChange={handleChange}
                placeholder="Correo Personal"
              />

            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>

              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
