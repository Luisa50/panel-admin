import React from "react";
import { X, Save } from "lucide-react";

export default function ModalFicha({
  modo,
  formData,
  handleChange,
  enviar,
  programaTexto = "",
  listaProgramas = [],
  handleBuscarPrograma,
  seleccionarPrograma,
}) {
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

            <button
              type="button"
              className="btn btn-link p-1 text-secondary text-decoration-none border-0 lh-1 ms-auto"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
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

              <label className="mt-2">Programa</label>
              {soloLectura ? (
                <input
                  className="form-control"
                  type="text"
                  value={programaTexto}
                  disabled
                  readOnly
                />
              ) : (
                <div className="position-relative">
                  <input type="hidden" name="ficProgramaFK" value={formData.ficProgramaFK} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Escriba al menos 3 letras para buscar programa..."
                    autoComplete="off"
                    value={programaTexto}
                    onChange={handleBuscarPrograma}
                  />
                  {listaProgramas.length > 0 && (
                    <div
                      className="list-group position-absolute w-100"
                      style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                    >
                      {listaProgramas.map((prog) => (
                        <button
                          key={prog.progCodigo}
                          type="button"
                          className="list-group-item list-group-item-action text-start"
                          onClick={() => seleccionarPrograma(prog)}
                        >
                          {prog.progNombre}
                          {prog.area?.areaNombre && (
                            <span className="text-muted small ms-1"> — {prog.area.areaNombre}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

   
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal" type="button">
                <X className="me-1" size={18} strokeWidth={1.75} aria-hidden />
                {modo === "ver" ? "Cerrar" : "Cancelar"}
              </button>

              {modo !== "ver" && (
                <button className="btn btn-primary" type="submit">
                  <Save className="me-1 text-white" size={18} strokeWidth={1.75} aria-hidden />
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
