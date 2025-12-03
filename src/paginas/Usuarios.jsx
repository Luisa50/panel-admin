import React, { useState, useEffect } from "react";
import '../estilos/usuarios.css'
import ReactDOM from "react-dom/client";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';

import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import AccionesAprendiz from "../componentes/AccionesAprendiz";


const handleVer = (id) => {
  console.log("Ver aprendiz", id);
  // fetch GET /Aprendiz/{id}
};

const handleEditar = (id) => {
  console.log("Editar aprendiz", id);
  // fetch PUT /Aprendiz/{id}
};

const handleEliminar = async (id) => {
  if (!window.confirm("¿Seguro que deseas eliminar este aprendiz?")) return;

  await fetch(`http://healthymind10.runasp.net/api/Aprendiz/eliminar-usuario/${id}`, {
    method: "PUT"
  });

  alert("Eliminado");
};

export default function Usuarios() {
  DataTable.use(DT);
  const [usuarios, setUsuarios] = useState([]);
  const [informacion, setInformacion] = useState([])
  const [cantidadReg, setCantidadReg] = useState(5)
  const [municipioTexto, setMunicipioTexto] = useState("");
  const [listaMunicipios, setListaMunicipios] = useState([]);
  const buscarTimeout = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [estadoApr, setEstadoApr] = useState([])
  const [formData, setFormData] = useState({
              tipoDocumento: "",
              nroDocumento: "",
              fechaNacimiento: "",
              nombre: "",
              segundoNombre: "",
              apellido: "",
              segundoApellido: "",
              correoInstitucional: "",
              correoPersonal: "",
              telefono: "",
              municipio: "",
              direccion: "",
              eps: "",
              patologia: "",
              estadoAprendiz: "",
              tipoPoblacion: "",
              acudienteNombre: "",
              acudienteApellido: "",
              acudienteTelefono: "",
          });

          
  const handleBuscarMunicipio = (e) => {
    const texto = e.target.value;
    setMunicipioTexto(texto);

    if (texto.length < 3) {
      setListaMunicipios([]);
      return;
    }

    clearTimeout(buscarTimeout);
    buscarTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://healthymind10.runasp.net/api/Ciudad/buscar?texto=${texto}`
        );
        const data = await res.json();
        setListaMunicipios(data);
      } catch (err) {
        console.error("Error buscando municipios:", err);
      }
    }, 300);
  };

  const seleccionarMunicipio = (m) => {
  setMunicipioTexto(`${m.ciuNombre} - ${m.regional.regNombre}`);
  setFormData(p => ({
    ...p,
    municipio: m.ciuCodigo
  }));
  setListaMunicipios([]);
};

  const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData({
        ...formData,
        [name]: name === "estadoAprendiz" ? Number(value) : value
      });
    };
    
    const columnas = [
    { title: "Tipo documento", data: "tipoDocumento" },
    
    { title: "Número", data: "nroDocumento" },
  
    {
      title: "Nombre",
      data: "nombres",
      render: (n) => n?.primerNombre ?? "—"
    },
    {
      title: "Apellido",
      data: "apellidos",
      render: (a) => a?.primerApellido ?? "—"
    },
    {
      title: "Fecha Nacimiento",
      data: "fechaNacimiento",
      render: (f) => f ?? "—"
    },
    {
      title: "Correo personal",
      data: "contacto",
      render: (c) => c?.correoPersonal ?? "—"
    },
    {
      title: "Telefono",
      data: "contacto",
      render: (c) => c?.telefono ?? "—"
    },
    {
      title: "Estado aprendiz",
      data: "estadoAprendiz",
      render: (e) => e?.estAprNombre ?? "—"
    },
    {
      title: "Población",
      data: "tipoPoblacion",
      render: (p) => p ?? "—"
    },
    {
      title: "Acciones",
      data: "codigo",
      orderable: false,
      searchable: false,
      createdCell: (td, id) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <AccionesAprendiz
            id={id}
            onVer={handleVer}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        );
      }
    }
  ]


  const loadData = async (pag = 1, lengthPag = 5) => {
        setLoading(true);
        try {
          const res = await fetch(`http://healthymind10.runasp.net/api/Aprendiz/listar?Pagina=${pag}&TamanoPagina=${lengthPag}`);
          const json = await res.json();
          setUsuarios(json.resultado);
          setInformacion(json);
        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
        setLoading(false);
      }

      const limpiarFormulario = () => {
      setFormData({
        tipoDocumento: "",
        nroDocumento: "",
        fechaNacimiento: "",
        nombre: "",
        segundoNombre: "",
        apellido: "",
        segundoApellido: "",
        correoInstitucional: "",
        correoPersonal: "",
        telefono: "",
        municipio: "",
        direccion: "",
        eps: "",
        patologia: "",
        estadoAprendiz: "",
        tipoPoblacion: "",
        acudienteNombre: "",
        acudienteApellido: "",
        acudienteTelefono: ""
      });

      setMunicipioTexto("");
      setListaMunicipios([]);
    };
    
  const enviarPost = async (e) => {
    e.preventDefault();

    const cuerpoPost = {
      aprTipoDocumento: formData.tipoDocumento,
      aprNroDocumento: formData.nroDocumento,
      aprFechaNac: formData.fechaNacimiento,
      aprNombre: formData.nombre,
      aprSegundoNombre: formData.segundoNombre,
      aprApellido: formData.apellido,
      aprSegundoApellido: formData.segundoApellido,
      aprCorreoInstitucional: formData.correoInstitucional,
      aprCorreoPersonal: formData.correoPersonal,
      aprDireccion: formData.direccion,
      aprCiudadFk: formData.municipio,
      aprTelefono: formData.telefono,
      aprEps: formData.eps,
      aprPatologia: formData.patologia,
      aprEstadoAprFk: formData.estadoAprendiz,
      aprTipoPoblacion: formData.tipoPoblacion,
      aprTelefonoAcudiente: formData.acudienteTelefono,
      aprAcudNombre: formData.acudienteNombre,
      aprAcudApellido: formData.acudienteApellido
    }

    


    const res = await fetch("http://healthymind10.runasp.net/api/Aprendiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpoPost)
    });

    if (res.ok) {
      alert("Aprendiz creado correctamente");
      loadData();
      limpiarFormulario();
      document.getElementById("btnCerrarModal").click();
    } else {
      alert("Error al crear aprendiz");
      document.getElementById("btnCerrarModal").click();
    }
  }

  useEffect(() => {
      const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, [])


  


  return (
    <>
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
                        required/>
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
                        <input type="email" class="form-control" 
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
            <button type="button" id="btnCerrarModal" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="submit" class="btn btn-primary">Save changes</button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
    {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

    <div className="container-fluid pb-4">
        <h2>Listado de usuarios</h2>
      <div className="encabezado">
        <div class="input-group" onClick={async () => {
          await fetch("http://healthymind10.runasp.net/api/EstadoAprendiz")
            .then(res => res.json())
            .then(json => {
              setEstadoApr(json)
              console.log(json);
            })
          
        }}>
          <span class="input-group-text bg-success text-light"
          data-bs-toggle="modal" 
          data-bs-target="#exampleModal"
          id="aggreg">+</span>
          <span className="input-group-text bg-success text-light" 
          data-bs-toggle="modal" 
          data-bs-target="#exampleModal"
          id="aggreg">Agregar</span>
        </div>
        <select class="seleccionCantidad" onChange={(e) => {
          const nuevaCantidad = parseInt(e.target.value);
          setCantidadReg(nuevaCantidad);
          loadData(informacion?.paginaActual ?? 1, nuevaCantidad)
        }}>
          <option value="5" defaultChecked>5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>

      <DataTable 
        columns={columnas} 
        data={usuarios}
        options={{
          lengthMenu: false,
          lengthChange: false,
          paging: false,
          searching: false,
          pageLength: informacion?.tamanoPagina ?? 5,
          deferRender: true,
          info: false,
          
        }}
        >
        
      </DataTable>
      <div className="btn-group mt-3">

        <button 
          className="btn btn-outline-primary"
          disabled={!informacion.paginaAnterior}
          onClick={() => loadData(informacion.paginaAnterior, cantidadReg)}
        >
          Anterior
        </button>

        <button className="btn btn-primary">
          {informacion.paginaActual}
        </button>

        <button 
          className="btn btn-outline-primary"
          disabled={!informacion.paginaSiguiente}
          onClick={() => loadData(informacion.paginaSiguiente, cantidadReg)}
        >
          Siguiente
        </button>

      </div>

    </div>
    </>
  );
}
