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
import ModalPsicologo from "../componentes/modalsPost/ModalPsicologo.jsx";
import Modalver from "../componentes/modalsPost/ModalVer.jsx";
import { LucideAlertCircle } from "lucide-react";


export default function Usuarios() {
  DataTable.use(DT);
  const [usuarios, setUsuarios] = useState([]);
  const [informacion, setInformacion] = useState([])
  const [cantidadReg, setCantidadReg] = useState(5)
  const [loading, setLoading] = useState(false);
  const [dataVer, setDataVer] = useState({});
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
          const res = await fetch(`http://healthymind10.runasp.net/api/psicologo/listar?Pagina=${pag}&TamanoPagina=${lengthPag}`);
          const json = await res.json();
          setUsuarios(json.resultados);
          setInformacion(json);
          console.log(json.resultados);
          console.log(json);
          
        } catch (error) {
          console.error("Error al cargar datos:", error);
        }
        setLoading(false);
    }



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
      await fetch(`http://healthymind10.runasp.net/api/psicologo/cambiar-estado/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      
    });
    alert("Se ha cambiado el estado correctamente");
    loadData();
    }

const handleVer = async (id) => {
  try {
    const res = await fetch(`http://healthymind10.runasp.net/api/psicologo/${id}`);
    const json = await res.json();
    setDataVer(json[0]);
    console.log(json);
    
  } catch (err) {
    console.error(err);
  }
};

const handleEditar = (id) => {
  console.log("Editar aprendiz", id);
  // fetch PUT /Aprendiz/{id}
};

const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;

    await fetch(`http://healthymind10.runasp.net/api/psicologo/eliminar/${id}`, {
      method: "DELETE"
    });
    alert("Eliminado");
    loadData();
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
      psiPassword: formData.psiPassword
    }

    


    const res = await fetch("http://healthymind10.runasp.net/api/Psicologo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpoPost)
    });

    if (res.ok) {
      alert("Psicólogo creado correctamente");
      loadData();
      limpiarFormulario();
      document.getElementById("btnCerrarModal").click();
    } else {
      alert("Error al crear aprendiz");
      document.getElementById("btnCerrarModal").click();
    }
  }

  const busquedaDinamica = async (text) => {
      if (text.length < 3) return loadData()
      await fetch(`http://healthymind10.runasp.net/api/psicologo/busqueda-dinamica?texto=${text}`)
            .then(res => res.json())
            .then(json => setUsuarios(json)
            )
    }
    useEffect(() => {
        const fetchData = async () => {
        await loadData();
      };
      fetchData();
    }, [])

  useEffect(() => {
      const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, [])


  


  return (
    <>
    <ModalPsicologo
      formData={formData}
      handleChange={handleChange}
      enviarPost={enviarPost}
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
          className="btn btn-outline-primary"
          disabled={!informacion.paginaAnterior}
          onClick={() => loadData(informacion.paginaAnterior, cantidadReg)}
        >
          <i class="bi bi-chevron-compact-left"></i>
        </button>

        <button className="btn btn-primary">
          {informacion.paginaActual}
        </button>

        <button 
          className="btn btn-outline-primary"
          disabled={!informacion.paginaSiguiente}
          onClick={() => loadData(informacion.paginaSiguiente, cantidadReg)}
        >
          <i class="bi bi-chevron-compact-right"></i>
        </button>

      </div>

    </div>
    </>
  );
}
