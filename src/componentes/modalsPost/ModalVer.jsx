// src/componentes/modalsPost/ModalEditar.jsx
import React from "react";
import { X } from "lucide-react";
import { propiedadesAnidadas } from "../../utilidades/propiedadesAnidadas";

export default function Modalver({ id, titulo, data, campos }) {
  return (
    <div className="modal fade" id={id} tabIndex={-1}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">{titulo}</h5>
            <button
              type="button"
              className="btn btn-link p-1 text-secondary text-decoration-none border-0 lh-1 ms-auto"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
          </div>

          <div className="modal-body">
            <div className="row p-0">
            {campos.map((campo, i) => {
              const valor = propiedadesAnidadas(data, campo.nombre) ?? "—";

              return (
                    
                      <div key={i} className="form-floating col-lg-4 col-md-6 col-12">
                        <input
                          className="form-control mb-3"
                          value={valor}
                          placeholder="ejemplo" 
                          disabled
                        />
                        <label className="px-4">{campo.label}</label>
                      </div>
                    
                    )
              })
            }
          </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              <X className="me-1" size={18} strokeWidth={1.75} aria-hidden />
              Cerrar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
