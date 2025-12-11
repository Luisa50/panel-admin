import React from "react";

export default function ModalFicha({ modo, formData, handleChange, enviar }) {
  const soloLectura = modo === "ver";

  return (
    <div className="modal fade" id="modalFicha" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

     
          <div className="modal-header">
            <h5 className="modal-title">
              {modo === "crear" && "Registrar Ficha"}
              {modo === "editar" && "Editar Ficha"}
              {modo === "ver" && "Ficha"}
            </h5>

            <button className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <form onSubmit={enviar}>
            <div className="modal-body">

           
              <label className="mt-2">Código de la Ficha</label>
              <input
                className="form-control"
                name="ficCodigo"
                type="number"
                value={formData.ficCodigo}
                onChange={handleChange}
                disabled={soloLectura}
                required
              />

              <label className="mt-2">Jornada</label>
              <select
                className="form-select"
                name="ficJornada"
                value={formData.ficJornada}
                onChange={handleChange}
                disabled={soloLectura}
                required
              >
                <option value="">Seleccione...</option>
                <option value="diurna">Diurna</option>
                <option value="nocturna">Nocturna</option>
                <option value="mixta">Mixta</option>
              </select>

              
              <label className="mt-2">Fecha de Inicio</label>
              <input
                className="form-control"
                type="date"
                name="ficFechaInicio"
                value={formData.ficFechaInicio}
                onChange={handleChange}
                disabled={soloLectura}
                required
              />

              <label className="mt-2">Fecha de Finalización</label>
              <input
                className="form-control"
                type="date"
                name="ficFechaFin"
                value={formData.ficFechaFin}
                onChange={handleChange}
                disabled={soloLectura}
                required
              />

      
              <label className="mt-2">Estado de la Formación</label>
              <select
                className="form-select"
                name="ficEstadoFormacion"
                value={formData.ficEstadoFormacion}
                onChange={handleChange}
                disabled={soloLectura}
                required
              >
                <option value="">Seleccione...</option>
                <option value="en ejecucion">En ejecución</option>
                <option value="finalizada">Finalizada</option>
                <option value="cancelada">Cancelada</option>
              </select>

             
              <label className="mt-2">Programa (Código FK)</label>
              <input
                className="form-control"
                type="number"
                name="ficProgramaFK"
                value={formData.ficProgramaFK}
                onChange={handleChange}
                disabled={soloLectura}
                required
              />

            </div>

   
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>

              {modo !== "ver" && (
                <button className="btn btn-success" type="submit">
                  Guardar
                </button>
              )}
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
