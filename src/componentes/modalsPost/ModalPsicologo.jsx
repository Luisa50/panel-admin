import React from "react";
import { X, Save } from "lucide-react";

export default function ModalPsicologo({
  formData,
  handleChange,
  enviarPost,
  modo
}) {
  return (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {modo === "crear" ? "Agregar psicólogo" : "Editar psicólogo"}
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div className="modal-body">
            <form onSubmit={enviarPost}>
              <div className="p-2">
                <div className="container text-center">
                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input
                          type="text"
                          class="form-control"
                          name="nroDocumento"
                          placeholder="Documento"
                          value={formData.nroDocumento}
                          onChange={handleChange}
                          required
                        />
                        <label>Número de documento</label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input
                          type="text"
                          class="form-control"
                          name="nombre"
                          placeholder="Nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                        />
                        <label>Nombre</label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input
                          type="text"
                          class="form-control"
                          name="apellido"
                          placeholder="Apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          required
                        />
                        <label>Apellido</label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-6 col-lg-12">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          name="correoInstitucional"
                          placeholder="Correo institucional"
                          value={formData.correoInstitucional}
                          onChange={handleChange}
                          required
                        />
                        <label>Correo institucional</label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          className="form-control"
                          name="correoPersonal"
                          placeholder="Correo personal"
                          value={formData.correoPersonal}
                          onChange={handleChange}
                          required
                        />
                        <label>Correo personal</label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="form-floating">
                        <input
                          type="date"
                          className="form-control text-dark"
                          name="fechaNacimiento"
                          value={formData.fechaNacimiento}
                          onChange={handleChange}
                          required
                        />
                        <label>Fecha de nacimiento</label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          name="telefono"
                          placeholder="Teléfono"
                          value={formData.telefono}
                          onChange={handleChange}
                          required
                        />
                        <label>Teléfono</label>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          name="especialidad"
                          placeholder="Especialidad"
                          value={formData.especialidad}
                          onChange={handleChange}
                          required
                        />
                        <label>Especialidad</label>
                      </div>
                    </div>
                  </div>


                  <div className="row g-3 pb-4">
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          name="direccion"
                          placeholder="Dirección"
                          value={formData.direccion}
                          onChange={handleChange}
                          required
                        />
                        <label>Dirección</label>
                      </div>
                    </div>
                  </div>

                  {modo === "crear" ? 
                  <div className="row g-3 pb-4">
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="password"
                          className="form-control"
                          name="psiPassword"
                          placeholder="Contraseña"
                          value={formData.psiPassword}
                          onChange={handleChange}
                          required
                        />
                        <label>Contraseña</label>
                      </div>
                    </div>
                  </div>
                  : ""}
                </div>
              </div>

              <div className="d-flex pe-3 w-100 justify-content-end">
                <div className="btn-group">
                  <button
                    type="button"
                    id="btnCerrarModal"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    <X />
                  </button>
                  <button type="submit" className="btn btn-success">
                    <Save />
                  </button>
                </div>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
