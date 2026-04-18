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
    estadoApr,
    modo
}) {
  return (
    <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {modo === "crear" ? "Agregar aprendiz" : "Editar aprendiz"}
            </h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={enviarPost}>
              <div className="p-2">
                <div className="container text-center">
                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="form-floating">
                        <select className="form-select" id="floatingSelect"
                        name="tipoDocumento"
                        aria-label="Floating label select example" 
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        required>
                          <option value=""></option>
                          <option value="CC">CC</option>
                          <option value="TI">TI</option>
                          <option value="CE">CE</option>
                        </select>
                        <label htmlFor="floatingSelect">Tipo de documento</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="nroDocumento"
                        id="floatingInputGrid" placeholder="jsakldfj" 
                        value={formData.nroDocumento}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingInputGrid">Número de documento</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="form-floating">
                        <input type="date" className="form-control text-dark" 
                        name="fechaNacimiento"
                        id="floatingInputGrid" placeholder="fecha de nacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingInputGrid">Fecha de nacimiento</label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="nombre"
                        id="floatingInputGrid" placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingSelect">Nombre</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="segundoNombre"
                        id="floatingInputGrid" placeholder="Segundo nombre" 
                        value={formData.segundoNombre}
                        onChange={handleChange}
                        />
                        <label htmlFor="floatingInputGrid">Segundo nombre</label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="apellido"
                        id="floatingInputGrid" placeholder="Apellido" 
                        value={formData.apellido}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingSelect">Apellido</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="segundoApellido"
                        id="floatingInputGrid" placeholder="Segundo apellido" 
                        value={formData.segundoApellido}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingInputGrid">Segundo apellido</label>
                      </div>
                    </div>
                  </div>

                  <hr />
                  <h3>Contacto</h3>
                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="form-floating">
                        <input type="email" className="form-control" 
                        name="correoInstitucional"
                        id="floatingInputGrid" placeholder="Correo institucional" 
                        value={formData.correoInstitucional}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingSelect">Correo institucional</label>
                      </div>
                    </div>
                  </div>
                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="form-floating">
                        <input type="email" className="form-control" 
                        name="correoPersonal"
                        id="floatingInputGrid" placeholder="Correo personal" 
                        value={formData.correoPersonal}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingSelect">Correo personal</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="telefono"
                        id="floatingInputGrid" placeholder="Teléfono" 
                        value={formData.telefono}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingInputGrid">Teléfono</label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="acudienteNombre"
                        id="floatingInputGrid" placeholder="Nombre del acudiente" 
                        value={formData.acudienteNombre}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingSelect">Nombre del acudiente</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="acudienteApellido"
                        id="floatingInputGrid" placeholder="Apellido del acudiente" 
                        value={formData.acudienteApellido}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingInputGrid">Apellido del acudiente</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="acudienteTelefono"
                        id="floatingInputGrid" placeholder="Teléfono del acudiente" 
                        value={formData.acudienteTelefono}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingInputGrid">Teléfono del acudiente</label>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <h3>Ubicación</h3>
                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="form-floating">
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

                  <div className="row g-3 pb-4">
                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="direccion"
                        id="floatingInputGrid" placeholder="Dirección" 
                        value={formData.direccion}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingSelect">Dirección</label>
                      </div>
                    </div>
                  </div>

                  <hr />


                  <div className="row g-3 pb-4 pt-4">
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="patologia"
                        id="floatingInputGrid" placeholder="Patología" 
                        value={formData.patologia}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingSelect">Patología</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="form-floating">
                        <select className="form-select" 
                        name="tipoPoblacion"
                        id="floatingSelect" aria-label="Floating label select example"
                        value={formData.tipoPoblacion}
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
                        <label htmlFor="floatingSelect">Tipo de población</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-4">
                      <div className="form-floating">
                        <input type="text" className="form-control" 
                        name="eps"
                        id="floatingInputGrid" placeholder="eps" 
                        value={formData.eps}
                        onChange={handleChange}
                        required/>
                        <label htmlFor="floatingSelect">Eps</label>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 pb-2 pt-2">
                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="form-floating">
                        <select className="form-select" 
                        name="estadoAprendiz"
                        id="floatingSelect" aria-label="Floating label select example"
                        value={formData.estadoAprendiz}
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
                        <label htmlFor="floatingSelect">Estado del aprendiz</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex pe-3 w-100 justify-content-end">
                <div className="btn-group" role="group" >
                  <button type="button" id="btnCerrarModal" 
                  aria-label="First group" 
                  className="btn btn-secondary" 
                  data-bs-dismiss="modal">
                    <X/> 
                    </button>

                  <button type="submit" 
                  className="btn btn-success" 
                  aria-label="Second group">
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