import React from "react";
import { X, Save } from "lucide-react";
export default function ModalEjemplo({
    formData,
    handleChange,
    enviarPost,
    municipioTexto,
    listaMunicipios,
    handleBuscarMunicipio,
    seleccionarMunicipio,
    estadoApr
}) {
  return (
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Agregar aprendiz</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form onSubmit={enviarPost}>
              <div className="p-2">
                <div class="container text-center">
                  <div class="row g-3 pb-4">
                    <div class="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <select class="form-select" id="floatingSelect"
                        name="tipoDocumento"
                        aria-label="Floating label select example" 
                        onChange={handleChange}
                        required>
                          <option value=""></option>
                          <option value="CC">CC</option>
                          <option value="TI">TI</option>
                          <option value="CE">CE</option>
                        </select>
                        <label for="floatingSelect">Tipo de documento</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="nroDocumento"
                        id="floatingInputGrid" placeholder="jsakldfj" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingInputGrid">Número de documento</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input type="date" class="form-control text-dark" 
                        name="fechaNacimiento"
                        id="floatingInputGrid" placeholder="fecha de nacimiento"
                        onChange={handleChange}
                        required/>
                        <label for="floatingInputGrid">Fecha de nacimiento</label>
                      </div>
                    </div>
                  </div>

                  <div class="row g-3 pb-4">
                    <div class="col-12 col-md-6 col-lg-6">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="nombre"
                        id="floatingInputGrid" placeholder="Nombre" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingSelect">Nombre</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-6">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="segundoNombre"
                        id="floatingInputGrid" placeholder="Segundo nombre" 
                        onChange={handleChange}
                        />
                        <label for="floatingInputGrid">Segundo nombre</label>
                      </div>
                    </div>
                  </div>

                  <div class="row g-3 pb-4">
                    <div class="col-12 col-md-6 col-lg-6">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="apellido"
                        id="floatingInputGrid" placeholder="Apellido" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingSelect">Apellido</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-6">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="segundoApellido"
                        id="floatingInputGrid" placeholder="Segundo apellido" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingInputGrid">Segundo apellido</label>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <h3>Contacto</h3>
                  <div class="row g-3 pb-4">
                    <div class="col-12 col-md-12 col-lg-12">
                      <div class="form-floating">
                        <input type="email" class="form-control" 
                        name="correoInstitucional"
                        id="floatingInputGrid" placeholder="Correo institucional" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingSelect">Correo institucional</label>
                      </div>
                    </div>
                  </div>
                  <div class="row g-3 pb-4">
                    <div class="col-12 col-md-6 col-lg-6">
                      <div class="form-floating">
                        <input type="email" class="form-control" 
                        name="correoPersonal"
                        id="floatingInputGrid" placeholder="Correo personal" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingSelect">Correo personal</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-6">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="telefono"
                        id="floatingInputGrid" placeholder="Teléfono" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingInputGrid">Teléfono</label>
                      </div>
                    </div>
                  </div>

                  <div class="row g-3 pb-4">
                    <div class="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="acudienteNombre"
                        id="floatingInputGrid" placeholder="Nombre del acudiente" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingSelect">Nombre del acudiente</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="acudienteApellido"
                        id="floatingInputGrid" placeholder="Apellido del acudiente" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingInputGrid">Apellido del acudiente</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="acudienteTelefono"
                        id="floatingInputGrid" placeholder="Teléfono del acudiente" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingInputGrid">Teléfono del acudiente</label>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <h3>Ubicación</h3>
                  <div class="row g-3 pb-4">
                    <div class="col-12 col-md-12 col-lg-12">
                      <div class="form-floating">
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar municipio..."
                            autoComplete="off"
                            value={municipioTexto}
                            onChange={handleBuscarMunicipio}
                          />

                          {listaMunicipios.length > 0 && (
                            <div className="list-group position-absolute w-100" style={{ zIndex: 1000 }}>
                              {listaMunicipios.map((m) => (
                                <button
                                  key={m.ciuCodigo}
                                  className="list-group-item list-group-item-action"
                                  onClick={() => seleccionarMunicipio(m)}
                                >
                                  {m.ciuNombre} - {m.regional.regNombre}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>

                  <div class="row g-3 pb-4">
                    <div class="col-12 col-md-12 col-lg-12">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="direccion"
                        id="floatingInputGrid" placeholder="Dirección" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingSelect">Dirección</label>
                      </div>
                    </div>
                  </div>

                  <hr />


                  <div class="row g-3 pb-4 pt-4">
                    <div class="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="patologia"
                        id="floatingInputGrid" placeholder="Patología" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingSelect">Patología</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <select class="form-select" 
                        name="tipoPoblacion"
                        id="floatingSelect" aria-label="Floating label select example"
                        onChange={handleChange}
                        required>
                          <option value=""></option>
                          <option value="Desplazado">Desplazado</option>
                          <option value="Negro">Negro</option>
                          <option value="Discapacitado">Discapacitado</option>
                          <option value="Campesino">Campesino</option>
                          <option value="Afro">Afro</option>
                          <option value="Gitano">Gitano</option>
                          <option value="Indigena">Indigena</option>
                          <option value="Ninguno">Ninguno</option>
                        </select>
                        <label for="floatingSelect">Tipo de población</label>
                      </div>
                    </div>
                    <div class="col-12 col-md-6 col-lg-4">
                      <div class="form-floating">
                        <input type="text" class="form-control" 
                        name="eps"
                        id="floatingInputGrid" placeholder="eps" 
                        onChange={handleChange}
                        required/>
                        <label for="floatingSelect">Eps</label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 pb-2 pt-2">
                    <div class="col-12 col-md-12 col-lg-12">
                      <div class="form-floating">
                        <select class="form-select" 
                        name="estadoAprendiz"
                        id="floatingSelect" aria-label="Floating label select example"
                        onChange={handleChange}
                        required>
                          <option value=""></option>
                          {estadoApr.map(e => (
                            <option key={e.estAprCodigo} 
                            value={e.estAprCodigo}>
                              {e.estAprNombre}
                              </option>
                          ))}
                        </select>
                        <label for="floatingSelect">Estado del aprendiz</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex pe-3 w-100 justify-content-end">
                <div className="btn-group" role="group" >
                  <button type="button" id="btnCerrarModal" 
                  aria-label="First group" 
                  class="btn btn-secondary" data-bs-dismiss="modal"><X/> Cancelar</button>
                  <button type="submit" class="btn btn-success" aria-label="Second group"><Save /> Guardar</button>
                </div>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}