import React, { useState, useEffect } from "react";
import '../estilos/usuarios.css'
import ReactDOM from "react-dom/client";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import AccionesAprendiz from "../componentes/AccionesAprendiz";

// function generarUsuariosMock() {
//   const nombres = [
//     ["Briyith", "Lorena", "Padilla", "Tierra"],
//     ["Carlos", "Andrés", "Gómez", ""],
//     ["María", "Lucía", "Ramírez", "Suárez"],
//     ["Sofía", "", "Rivers", ""],
//     ["Juan", "Diego", "Pérez", ""],
//     ["Luisa", "Fernanda", "Martínez", ""],
//     ["Pedro", "", "Salas", "López"],
//     ["Camila", "", "Torres", ""],
//     ["Andrés", "Felipe", "Paredes", ""],
//     ["Valeria", "", "Meza", ""],
//   ];

//   const municipios = ["MALAMBO", "BARRANQUILLA", "CARTAGENA", "BOGOTÁ", "CALI"];
//   const estados = ["En formación", "Graduado", "En espera"];

//   const usuarios = [];

//   for (let i = 0; i < 20; i++) {
//     const base = nombres[i % nombres.length];

//     usuarios.push({
//       id: i + 1,
//       documento: 100000000 + i,
//       nombre: `${base[0]} ${base[1]} ${base[2]} ${base[3]}`,
//       correo: `${base[0].toLowerCase()}.${base[2].toLowerCase()}@soy.sena.edu.co`,
//       municipio: municipios[i % municipios.length],
//       estado: estados[i % estados.length],
//       activo: i % 2 === 0 ? "Activo" : "Inactivo",
//     });
//   }

//   return usuarios;
// }

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

  await fetch(`http://healthymind10.runasp.net/api/Aprendiz/${id}`, {
    method: "DELETE"
  });

  alert("Eliminado");
};

export default function Usuarios() {
  DataTable.use(DT);
  const [usuarios, setUsuarios] = useState([]);
  const [informacion, setInformacion] = useState([])
  const [cantidadReg, setCantidadReg] = useState(5)
  const [loading, setLoading] = useState(false);


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
  useEffect(() => {
      const fetchData = async () => {
      await loadData();
    };
    fetchData();
  }, [])

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



  return (
    <>
    
    {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

    <div className="container m-0">
        <h2>Listado de usuarios</h2>
      <div className="encabezado">
        <div class="input-group mb-0" onClick={() => alert("click")}>
          <span class="input-group-text bg-success text-light" id="aggreg">+</span>
          <span className="input-group-text bg-success text-light" id="aggreg">Agregar</span>
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
