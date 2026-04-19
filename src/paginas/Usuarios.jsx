import React, { useState, useEffect } from "react";
import "../estilos/usuarios.css";
import ReactDOM from "react-dom/client";
import { Modal } from "bootstrap";
import ModalEjemplo from "../componentes/modalsPost/ModalEjemplo.jsx";
import TablasInfo from "../componentes/TablasInfo.jsx";
import Modalver from "../componentes/modalsPost/ModalVer.jsx";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import AccionesAprendiz from "../componentes/AccionesAprendiz";
import PaginacionTablaMinimal from "../componentes/PaginacionTablaMinimal.jsx";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";

export default function Usuarios() {
  DataTable.use(DT);
  const [usuarios, setUsuarios] = useState([]);
  const [informacion, setInformacion] = useState({});
  const [cantidadReg, setCantidadReg] = useState(5);
  const [municipioTexto, setMunicipioTexto] = useState("");
  const [listaMunicipios, setListaMunicipios] = useState([]);
  const [dataVer, setDataVer] = useState({});
  const buscarTimeout = React.useRef(null);
  const timeoutBusquedaListado = React.useRef(null);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [estadoApr, setEstadoApr] = useState([]);
  const [modo, setModo] = useState("crear");
  const [idEditar, setIdEditar] = useState(null);
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

  const abrirModalPorId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    Modal.getOrCreateInstance(el).show();
  };

  const handleBuscarMunicipio = (e) => {
    const texto = e.target.value;
    setMunicipioTexto(texto);

    if (texto.length < 3) {
      setListaMunicipios([]);
      return;
    }

    clearTimeout(buscarTimeout.current);
    buscarTimeout.current = setTimeout(async () => {
      try {
        const res = await fetchWithAuth(
          `${API_URL}/Ciudad/buscar?texto=${encodeURIComponent(texto)}`
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
    setFormData((p) => ({ ...p, municipio: m.ciuCodigo }));
    setListaMunicipios([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "estadoAprendiz" ? Number(value) : value,
    });
  };

  const columnas = [
    { title: "Tipo documento", data: "tipoDocumento" },
    { title: "Número", data: "nroDocumento" },
    {
      title: "Nombre",
      data: "nombres",
      render: (n) => n?.primerNombre ?? "—",
    },
    {
      title: "Apellido",
      data: "apellidos",
      render: (a) => a?.primerApellido ?? "—",
    },
    {
      title: "Fecha Nacimiento",
      data: "fechaNacimiento",
      render: (f) => f ?? "—",
    },
    {
      title: "Correo personal",
      data: "contacto",
      render: (c) => c?.correoPersonal ?? "—",
    },
    {
      title: "Estado aprendiz",
      data: "estadoAprendiz",
      render: (e) => e?.estAprNombre ?? "—",
    },
    {
      title: "Población",
      data: "tipoPoblacion",
      render: (p) => p ?? "—",
    },
    {
      title: "Estado del registro",
      data: "estadoRegistro",
      createdCell: (td, estado, row) => {
        const color = estado === "activo" ? "green" : "red";
        const texto = estado ?? "—";
        td.innerHTML = `
          <div style="display:flex;align-items:center;gap:6px;cursor:pointer;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};"></span>
            ${texto}
          </div>`;
        td.onclick = () => cambiarEstado(row.nroDocumento);
      },
    },
    {
      title: "Acciones",
      data: null,
      defaultContent: "",
      orderable: false,
      searchable: false,
      createdCell: (td, _cellData, rowData) => {
        const id =
          rowData?.codigo ?? rowData?.aprCodigo ?? rowData?.nroDocumento;

        td.innerHTML = "";
        const container = document.createElement("div");
        td.appendChild(container);

        ReactDOM.createRoot(container).render(
          <AccionesAprendiz
            id={id}
            onVer={handleVer}
            onEditar={handleEditar}
            onEliminar={handleEliminar}
          />
        );
      },
    },
  ];

  /** Nombre: ≥2 caracteres. Solo números (documento): ≥1 carácter. */
  const cumpleMinimoBusqueda = (texto) => {
    const t = texto.trim();
    if (!t) return false;
    if (/^\d+$/.test(t)) return t.length >= 1;
    return t.length >= 2;
  };

  const loadData = async (pag = 1, lengthPag = 5) => {
    setTextoBusqueda("");
    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `${API_URL}/Aprendiz/listar?Pagina=${pag}&TamanoPagina=${lengthPag}`
      );
      const json = await res.json();
      setUsuarios(json?.resultado ?? []);
      setInformacion(json ?? {});
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
    setLoading(false);
  };

  const abrirFormularioNuevoAprendiz = () => {
    limpiarFormulario();
    setModo("crear");
    setIdEditar(null);
    window.requestAnimationFrame(() => {
      abrirModalPorId("exampleModal");
    });
  };

  const ejecutarBusquedaAprendices = async (textoRaw) => {
    const texto = textoRaw.trim();
    if (!texto) {
      await loadData(1, cantidadReg);
      return;
    }
    if (!cumpleMinimoBusqueda(textoRaw)) return;

    try {
      const res = await fetchWithAuth(
        `${API_URL}/aprendiz/busqueda-dinamica?texto=${encodeURIComponent(texto)}`
      );
      if (!res?.ok) return;
      const json = await res.json();
      const arr = Array.isArray(json) ? json : [];
      setUsuarios(arr);
      setInformacion((prev) => ({
        ...prev,
        paginaActual: 1,
        totalPaginas: 1,
        paginaAnterior: null,
        paginaSiguiente: null,
        totalRegistros: arr.length,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const cambiarEstado = async (id) => {
    const cuerpoPost = { RazonEliminacion: "prueba" };
    try {
      await fetchWithAuth(`${API_URL}/Aprendiz/cambiar-estado/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpoPost),
      });
      alert("Se ha cambiado el estado correctamente");
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error al cambiar el estado");
    }
  };

  const handleVer = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/aprendiz/${id}`);
      const json = await res.json();
      setDataVer(Array.isArray(json) ? json[0] ?? {} : json ?? {});
      abrirModalPorId("modalVer");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditar = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/aprendiz/${id}`);
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
      abrirModalPorId("exampleModal");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const cargarEstadosAprendiz = async () => {
      try {
        const res = await fetchWithAuth(`${API_URL}/EstadoAprendiz`);
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
      await fetchWithAuth(`${API_URL}/Aprendiz/eliminar/${id}`, {
        method: "DELETE",
      });
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
      acudienteTelefono: "",
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
      aprAcudApellido: formData.acudienteApellido,
    };

    const url =
      modo === "crear"
        ? `${API_URL}/Aprendiz`
        : `${API_URL}/Aprendiz/editar/${idEditar}`;
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
        document.getElementById("btnCerrarModal")?.click();
      } else {
        alert(
          modo === "crear"
            ? "Error al crear el aprendiz"
            : "Error al editar el aprendiz"
        );
        document.getElementById("btnCerrarModal")?.click();
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
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
        modo={modo}
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
          { nombre: "contacto.acudiente.acudienteTelefono", label: "Teléfono Acudiente" },
        ]}
      />
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <div className="container-fluid pb-4">
        <h2>Listado de usuarios</h2>
        <div className="encabezado w-100">
          <div className="d-flex align-items-center justify-content-between gap-3 w-100 flex-wrap">
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
            <div className="usuarios-toolbar-buscar">
              <input
                type="search"
                className="form-control"
                placeholder="Buscar"
                value={textoBusqueda}
                aria-label="Buscar"
                onChange={(e) => {
                  const v = e.target.value;
                  setTextoBusqueda(v);
                  clearTimeout(timeoutBusquedaListado.current);
                  if (!v.trim()) {
                    loadData(1, cantidadReg);
                    return;
                  }
                  timeoutBusquedaListado.current = setTimeout(
                    () => ejecutarBusquedaAprendices(v),
                    400
                  );
                }}
              />
              <button
                type="button"
                className="btn btn-primary px-3"
                title="Registrar nuevo aprendiz"
                id="aggreg"
                onClick={abrirFormularioNuevoAprendiz}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <TablasInfo
          columnas={columnas}
          datos={usuarios}
          informacion={informacion}
        />
        <PaginacionTablaMinimal
          paginaActual={informacion?.paginaActual ?? 1}
          totalPaginas={Math.max(1, informacion?.totalPaginas ?? 1)}
          onCambiarPagina={(n) => loadData(n, cantidadReg)}
        />
      </div>
    </>
  );
}
