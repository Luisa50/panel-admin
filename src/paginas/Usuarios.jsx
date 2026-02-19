import React, { useState, useEffect } from "react";
import "../estilos/usuarios.css";
import ReactDOM from "react-dom/client";
import ModalEjemplo from "../componentes/modalsPost/ModalEjemplo.jsx";
import TablasInfo from "../componentes/TablasInfo.jsx";
import Modalver from "../componentes/modalsPost/ModalVer.jsx";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import AccionesAprendiz from "../componentes/AccionesAprendiz";
import { fetchWithAuth } from "../services/auth";


export default function Usuarios() {
  DataTable.use(DT);
  const [usuarios, setUsuarios] = useState([]);
  const [informacion, setInformacion] = useState([])
  const [cantidadReg, setCantidadReg] = useState(5)
  const [municipioTexto, setMunicipioTexto] = useState("");
  const [listaMunicipios, setListaMunicipios] = useState([]);
    const [dataVer, setDataVer] = useState({});
  const buscarTimeout = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [estadoApr, setEstadoApr] = useState([])
  const [modo, setModo] = useState({})
  const [idEditar, setIdEditar] = useState({})
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
        const res = await fetchWithAuth(
          `http://healthymind10.runasp.net/api/Ciudad/buscar?texto=${encodeURIComponent(texto)}`
        );
        const data = await res.json();
        setListaMunicipios(Array.isArray(data) ? data : []);
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
      title: "Estado del registro",
      data: "estadoRegistro",
      createdCell: (td, estado, row) => {
              const color = estado === "activo" ? "green" : "red";
              const texto = estado ?? "—";

              td.innerHTML = `
                <div style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <span style="
                    display:inline-block;
                    width:10px;
                    height:10px;
                    border-radius:50%;
                    background:${color};
                  "></span>
                  ${texto}
                </div>
              `;

              td.onclick = () => cambiarEstado(row.nroDocumento);
            }
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
    const res = await fetchWithAuth(
      `http://healthymind10.runasp.net/api/Aprendiz/listar?Pagina=${pag}&TamanoPagina=${lengthPag}`
    );
    const json = await res.json();
    setUsuarios(json?.resultado ?? []);
    setInformacion(json ?? {});
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
  setLoading(false);
};

const cambiarEstado = async (id) => {
  const cuerpoPost = { RazonEliminacion: "prueba" };
  try {
    await fetchWithAuth(
      `http://healthymind10.runasp.net/api/Aprendiz/cambiar-estado/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpoPost),
      }
    );
    alert("Se ha cambiado el estado correctamente");
    loadData();
  } catch (err) {
    console.error(err);
    alert("Error al cambiar el estado");
  }
};

const handleVer = async (id) => {
  try {
    const res = await fetchWithAuth(
      `http://healthymind10.runasp.net/api/aprendiz/${id}`
    );
    const json = await res.json();
    setDataVer(Array.isArray(json) ? json[0] ?? {} : json ?? {});
  } catch (err) {
    console.error(err);
  }
};

const handleEditar = async (id) => {
  try {
    const res = await fetchWithAuth(
      `http://healthymind10.runasp.net/api/aprendiz/${id}`
    );
    const json = await res.json();
    const item = Array.isArray(json) ? json[0] : json;
    if (!item) return;

    setFormData({
      tipoDocumento: item.tipoDocumento ?? "",
      nroDocumento: item.nroDocumento ?? "",
      fechaNacimiento: item.fechaNacimiento?.split("T")[0] ?? "",
      nombre: item.nombres?.primerNombre ?? "",
      segundoNombre: item.nombres?.segundoNombre ?? "",
      apellido: item.apellidos?.primerApellido ?? "",
      segundoApellido: item.apellidos?.segundoApellido ?? "",
      correoInstitucional: item.contacto?.correoInstitucional ?? "",
      correoPersonal: item.contacto?.correoPersonal ?? "",
      telefono: item.contacto?.telefono ?? "",
      municipio: item.ubicacion?.municipioID ?? "",
      direccion: item.ubicacion?.direccion ?? "",
      eps: item.eps ?? "",
      patologia: item.patologia ?? "",
      estadoAprendiz: item.estadoAprendiz?.estAprCodigo ?? "",
      tipoPoblacion: item.tipoPoblacion ?? "",
      acudienteNombre: item.contacto?.acudiente?.acudienteNombre ?? "",
      acudienteApellido: item.contacto?.acudiente?.acudienteApellido ?? "",
      acudienteTelefono: item.contacto?.acudiente?.acudienteTelefono ?? "",
    });
    setMunicipioTexto(
      item.ubicacion
        ? `${item.ubicacion.municipio ?? ""} - ${item.ubicacion.departamento ?? ""}`
        : ""
    );
    setModo("editar");
    setIdEditar(item.codigo);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  const cargarEstadosAprendiz = async () => {
    try {
      const res = await fetchWithAuth(
        "http://healthymind10.runasp.net/api/EstadoAprendiz"
      );
      const json = await res.json();
      setEstadoApr(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Error cargando estados aprendiz:", err);
    }
  };
  cargarEstadosAprendiz();
}, []);

const handleEliminar = async (id) => {
  if (!window.confirm("¿Seguro que deseas eliminar este aprendiz?")) return;
  try {
    await fetchWithAuth(
      `http://healthymind10.runasp.net/api/Aprendiz/eliminar/${id}`,
      { method: "DELETE" }
    );
    alert("Eliminado");
    loadData();
  } catch (err) {
    console.error(err);
    alert("Error al eliminar");
  }
};

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

    const url = modo === "crear" 
              ? "http://healthymind10.runasp.net/api/Aprendiz"
              : `http://healthymind10.runasp.net/api/Aprendiz/editar/${idEditar}`

    const method = modo === "crear" ? "POST" : "PUT";

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpoPost),
      });

      if (res.ok) {
        alert(
          modo === "crear"
            ? "Aprendiz creado correctamente"
            : "Aprendiz actualizado correctamente"
        );
        loadData();
        limpiarFormulario();
        document.getElementById("btnCerrarModal").click();
      } else {
        alert(
          modo === "crear"
            ? "Error al crear el aprendiz"
            : "Error al editar el aprendiz"
        );
        document.getElementById("btnCerrarModal").click();
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  const busquedaDinamica = async (text) => {
    if (text.length < 3) return loadData();
    try {
      const res = await fetchWithAuth(
        `http://healthymind10.runasp.net/api/aprendiz/busqueda-dinamica?texto=${encodeURIComponent(text)}`
      );
      const json = await res.json();
      setUsuarios(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
      const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, [])


  


  return (
    <>
    <ModalEjemplo
      formData={formData}
      handleChange={handleChange}
      enviarPost={enviarPost}
      municipioTexto={municipioTexto}
      listaMunicipios={listaMunicipios}
      handleBuscarMunicipio={handleBuscarMunicipio}
      seleccionarMunicipio={seleccionarMunicipio}
      estadoApr={estadoApr}
    />
    <Modalver 
        id="modalVer"
        titulo="Detalles del aprendiz"
        data={dataVer}
        campos={[
            { nombre: "tipoDocumento", label: "Tipo de Documento" },
            { nombre: "nroDocumento", label: "Número de Documento" },
            { nombre: "nombres.primerNombre", label: "Nombre" },
            { nombre: "nombres.segundoNombre", label: "Segundo Nombre" },
            { nombre: "apellidos.primerApellido", label: "Apellido" },
            { nombre: "apellidos.segundoApellido", label: "Segundo Apellido" },
            { nombre: "ubicacion.departamento", label: "Departamento" },
            { nombre: "ubicacion.municipio", label: "Municipio" },
            { nombre: "ubicacion.direccion", label: "Dirección" },
            { nombre: "contacto.telefono", label: "Teléfono" },
            { nombre: "contacto.correoPersonal", label: "Correo Personal" },
            { nombre: "contacto.correoInstitucional", label: "Correo Institucional" },
            { nombre: "contacto.acudiente.acudienteNombre", label: "Nombre Acudiente" },
            { nombre: "contacto.acudiente.acudienteApellido", label: "Apellido Acudiente" },
            { nombre: "contacto.acudiente.acudienteTelefono", label: "Teléfono Acudiente" }
        ]} />
    {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

    <div className="container-fluid pb-4">
        <h2>Listado de usuarios</h2>
      <div className="encabezado w-100">
        <div class="d-flex align-items-center justify-content-between gap-2 w-100">
        <select className="seleccionCantidad" onChange={(e) => {
          const nuevaCantidad = parseInt(e.target.value);
          setCantidadReg(nuevaCantidad);
          loadData(informacion?.paginaActual ?? 1, nuevaCantidad)
        }}>
          <option value="5" defaultChecked>5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
        <div className="d-flex align-items-center gap-2">
            <input
              className="form-control"
              style={{ width: "220px" }}
              placeholder="Buscar…"
              onChange={(e) => busquedaDinamica(e.target.value)}
            />
            <span class="input-group-text bg-success text-light"
            data-bs-toggle="modal" 
            data-bs-target="#exampleModal"
            onClick={() => {
              setModo("crear")
            }}
            id="aggreg">
              +
            </span>
          </div>
        </div>
      </div>

      

      <TablasInfo
      columnas={columnas}
      datos={usuarios}
      informacion={informacion}
      />
      <div className="btn-group mt-3">
        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={!informacion.paginaAnterior}
          onClick={() => loadData(informacion.paginaAnterior, cantidadReg)}
          aria-label="Página anterior"
        >
          <i className="bi bi-chevron-compact-left"></i>
        </button>

        {Array.from(
          { length: informacion?.totalPaginas ?? 0 },
          (_, i) => i + 1
        ).map((num) => (
          <button
            key={num}
            type="button"
            className={`btn ${informacion?.paginaActual === num ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => loadData(num, cantidadReg)}
            aria-label={`Página ${num}`}
            aria-current={informacion?.paginaActual === num ? "page" : undefined}
          >
            {num}
          </button>
        ))}

        <button
          type="button"
          className="btn btn-outline-primary"
          disabled={!informacion.paginaSiguiente}
          onClick={() => loadData(informacion.paginaSiguiente, cantidadReg)}
          aria-label="Página siguiente"
        >
          <i className="bi bi-chevron-compact-right"></i>
        </button>
      </div>

    </div>
    </>
  );
}
