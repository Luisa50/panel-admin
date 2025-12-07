import React, { useState, useEffect } from "react";
import '../estilos/usuarios.css'
import ReactDOM from "react-dom/client";
import ModalEjemplo from '../componentes/modalsPost/ModalEjemplo.jsx'
import TablasInfo from '../componentes/TablasInfo.jsx'
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import AccionesAprendiz from "../componentes/AccionesAprendiz";

export default function Usuarios() {
  DataTable.use(DT);
  const [usuarios, setUsuarios] = useState([]);
  const [informacion, setInformacion] = useState([])
  const [cantidadReg, setCantidadReg] = useState(5)
  const [municipioTexto, setMunicipioTexto] = useState("");
  const [listaMunicipios, setListaMunicipios] = useState([]);
  const buscarTimeout = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [estadoApr, setEstadoApr] = useState([]);

  const [query, setQuery] = useState("");

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
  ];

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
  };

  const cambiarEstado = async (id) => {
    const cuerpoPost = {
      RazonEliminacion: "prueba"
    };

    await fetch(`http://healthymind10.runasp.net/api/Aprendiz/cambiar-estado/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpoPost)
    });
    alert("Se ha cambiado el estado correctamente");
    loadData();
  };

  const handleVer = (id) => console.log("Ver aprendiz", id);
  const handleEditar = (id) => console.log("Editar aprendiz", id);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este aprendiz?")) return;

    await fetch(`http://healthymind10.runasp.net/api/Aprendiz/eliminar/${id}`, {
      method: "DELETE"
    });

    alert("Eliminado");
    loadData();
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
  };

  useEffect(() => {
    loadData();
  }, []);

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

      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <div className="container-fluid pb-4">
        <h2>Listado de usuarios</h2>

        {/* ------------ ENCABEZADO MODIFICADO COMO PEDISTE ------------ */}
        <div className="encabezado d-flex justify-content-between align-items-center">

          {/* IZQUIERDA → SELECT DE CANTIDAD (ANTES ESTABA DERECHA) */}
          <div className="d-flex align-items-center gap-2">
            <select
              className="seleccionCantidad"
              onChange={(e) => {
                const nuevaCantidad = parseInt(e.target.value);
                setCantidadReg(nuevaCantidad);
                loadData(informacion?.paginaActual ?? 1, nuevaCantidad);
              }}
            >
              <option value="5" defaultChecked>5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>

          {/* DERECHA → BUSCADOR + BOTÓN VERDE */}
          <div className="d-flex align-items-center gap-2">

            {/* BUSCADOR */}
            <input
              className="form-control"
              style={{ width: "220px" }}
              placeholder="Buscar…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />

            {/* BOTÓN VERDE (+) AHORA A LA DERECHA */}
            <span
              className="input-group-text bg-success text-light"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              id="aggNuevo"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                await fetch("http://healthymind10.runasp.net/api/EstadoAprendiz")
                  .then(res => res.json())
                  .then(json => {
                    setEstadoApr(json);
                    console.log(json);
                  });
              }}
            >
              +
            </span>

          </div>
        </div>
        {/* ------------ FIN DEL ENCABEZADO ------------ */}

        <TablasInfo
          columnas={columnas}
          datos={usuarios}
          informacion={informacion}
        />

        <div className="btn-group mt-3">
          <button
            className="btn btn-outline-primary"
            disabled={!informacion.paginaAnterior}
            onClick={() => loadData(informacion.paginaAnterior, cantidadReg)}
          >
            <i className="bi bi-chevron-compact-left"></i>
          </button>

          <button className="btn btn-primary">
            {informacion.paginaActual}
          </button>

          <button
            className="btn btn-outline-primary"
            disabled={!informacion.paginaSiguiente}
            onClick={() => loadData(informacion.paginaSiguiente, cantidadReg)}
          >
            <i className="bi bi-chevron-compact-right"></i>
          </button>
        </div>

      </div>
    </>
  );
}
