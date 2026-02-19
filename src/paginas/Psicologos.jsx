import React, { useState, useEffect } from "react";
import "../estilos/usuarios.css";
import ReactDOM from "react-dom/client";
import TablasInfo from "../componentes/TablasInfo.jsx";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import AccionesAprendiz from "../componentes/AccionesAprendiz";
import ModalPsicologo from "../componentes/modalsPost/ModalPsicologo.jsx";
import Modalver from "../componentes/modalsPost/ModalVer.jsx";
import { fetchWithAuth } from "../services/auth";

export default function Psicologos() {
  DataTable.use(DT);
  const [usuarios, setUsuarios] = useState([]);
  const [informacion, setInformacion] = useState({});
  const [cantidadReg, setCantidadReg] = useState(5);
  const [loading, setLoading] = useState(false);
  const [dataVer, setDataVer] = useState({});
  const [modo, setModo] = useState("crear");
  const [idEditar, setIdEditar] = useState(null);
  const [formData, setFormData] = useState({
              nroDocumento: "",
              nombre: "",
              apellido: "",
              especialidad: "",
              telefono: "",
              fechaNacimiento: "",
              direccion: "",
              correoInstitucional: "",
              correoPersonal: "",
              psiPassword: ""
          });

  const loadData = async (pag = 1, lengthPag = 5) => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `http://healthymind10.runasp.net/api/psicologo/listar?Pagina=${pag}&TamanoPagina=${lengthPag}`
      );
      const json = await res.json();
      setUsuarios(json?.resultados ?? json?.resultado ?? []);
      setInformacion(json ?? {});
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
    setLoading(false);
  };



  const handleChange = (e) => {
      const { name, value } = e.target;

      setFormData({
        ...formData,
        [name]: name === "estadoAprendiz" ? Number(value) : value
      });
     };

    const columnas = [
    { title: "Número", 
      data: "psiDocumento",
    render: (f) => f ?? "—"
    },
  
    {
      title: "Nombre",
      data: "psiNombre",
      render: (n) => n ?? "—"
    },
    {
      title: "Apellido",
      data: "psiApellido",
      render: (a) => a ?? "—"
    },
    {
      title: "Especialidad",
      data: "psiEspecialidad",
      render: (f) => f ?? "—"
    },
    {
      title: "Telefono",
      data: "psiTelefono",
      render: (c) => c ?? "—"
    },
    {
      title: "Fecha de nacimiento",
      data: "psiFechaNac",
      render: (p) => p ?? "—"
    },
    {
      title: "Localización",
      data: "psiDireccion",
      render: (p) => p ?? "—"
    },
    {
      title: "Correo institucional",
      data: "psiCorreoInstitucional",
      render: (c) => c ?? "—"
    },
    {
      title: "Estado del registro",
      data: "psiEstadoRegistro",
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

              td.onclick = () => cambiarEstado(row.psiCodigo);
            }
    },
    {
      title: "Acciones",
      data: "psiCodigo",
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

  const cambiarEstado = async (id) => {
    if (!window.confirm("¿Seguro que deseas cambiar este estado?")) return;
    try {
      await fetchWithAuth(
        `http://healthymind10.runasp.net/api/psicologo/cambiar-estado/${id}`,
        { method: "PUT", headers: { "Content-Type": "application/json" } }
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
        `http://healthymind10.runasp.net/api/psicologo/${id}`
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
        `http://healthymind10.runasp.net/api/psicologo/${id}`
      );
      const json = await res.json();
      const item = Array.isArray(json) ? json[0] : json;
      if (!item) return;

      setFormData({
        nroDocumento: item.psiDocumento ?? "",
        nombre: item.psiNombre ?? "",
        apellido: item.psiApellido ?? "",
        especialidad: item.psiEspecialidad ?? "",
        telefono: item.psiTelefono ?? "",
        fechaNacimiento: item.psiFechaNac?.split("T")[0] ?? "",
        direccion: item.psiDireccion ?? "",
        correoInstitucional: item.psiCorreoInstitucional ?? "",
        correoPersonal: item.psiCorreoPersonal ?? "",
      });
      setModo("editar");
      setIdEditar(item.psiCodigo);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;
    try {
      await fetchWithAuth(
        `http://healthymind10.runasp.net/api/psicologo/eliminar/${id}`,
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
      nroDocumento: "",
      nombre: "",
      apellido: "",
      telefono: "",
      especialidad: "",
      fechaNacimiento: "",
      direccion: "",
      correoInstitucional: "",
      correoPersonal: "",
      psiPassword: ""
    });
};
    
  const enviarPost = async (e) => {
    e.preventDefault();

    const cuerpoPost = {
      psiDocumento: formData.nroDocumento,
      psiNombre: formData.nombre,
      psiApellido: formData.apellido,
      psiEspecialidad: formData.especialidad,
      psiTelefono: formData.telefono,
      psiFechaNac: formData.fechaNacimiento,
      psiDireccion: formData.direccion,
      psiCorreoInstitucional: formData.correoInstitucional,
      psiCorreoPersonal: formData.correoPersonal,
    };
    if (modo === "crear") {
      cuerpoPost.psiPassword = formData.psiPassword;
    }

    const url =
      modo === "crear"
        ? "http://healthymind10.runasp.net/api/Psicologo"
        : `http://healthymind10.runasp.net/api/Psicologo/editar/${idEditar}`;
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
            ? "Psicólogo creado correctamente"
            : "Psicólogo actualizado correctamente"
        );
        loadData();
        limpiarFormulario();
        document.getElementById("btnCerrarModal").click();
      } else {
        alert(
          modo === "crear"
            ? "Error al crear el psicólogo"
            : "Error al editar el psicólogo"
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
        `http://healthymind10.runasp.net/api/psicologo/busqueda-dinamica?texto=${encodeURIComponent(text)}`
      );
      const json = await res.json();
      setUsuarios(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  


  return (
    <>
    <ModalPsicologo
      formData={formData}
      handleChange={handleChange}
      enviarPost={enviarPost}
      modo={modo}
    />
    <Modalver 
    id="modalVer"
    titulo="Detalles del psicólogo"
    data={dataVer}
    campos={[
        { nombre: "psiDocumento", label: "Documento" },
        { nombre: "psiNombre", label: "Nombre" },
        { nombre: "psiApellido", label: "Apellido" },
        { nombre: "psiEspecialidad", label: "Especialidad" },
        { nombre: "psiTelefono", label: "Teléfono" },
        { nombre: "psiFechaNac", label: "Fecha de nacimiento" },
        { nombre: "psiDireccion", label: "Dirección" },
        { nombre: "psiCorreoInstitucional", label: "Correo Institucional" },
        { nombre: "psiCorreoPersonal", label: "Correo Personal" },
        { nombre: "psiEstadoRegistro", label: "Estado" }
    ]} />
    {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

    <div className="container-fluid pb-4">
        <h2>Listado de psicologos</h2>
      <div className="encabezado w-100">
        <div className="d-flex align-items-center justify-content-between gap-2 w-100">
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
              <span className="input-group-text bg-success text-light"
              data-bs-toggle="modal" 
              data-bs-target="#exampleModal"
              onClick={() => {
                limpiarFormulario();
                setModo("crear");
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
