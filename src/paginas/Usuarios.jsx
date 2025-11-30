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
  const [cantidadReg, setCantidadReg] = useState([])

  const loadData = async (pag = 1, lengthPag = 5) => {
        await fetch(`http://healthymind10.runasp.net/api/Aprendiz/listar?Pagina=${pag}&TamanoPagina=${lengthPag}`)
        .then(res => res.json())
        .then(json => {setUsuarios(json.resultado)
          setInformacion(json)
          console.log(json.resultado);
          
        })
      }
  useEffect(() => {
    loadData()
  }, [])

  const columnas = [
    {
      title: "Tipo documento",
      data: "tipoDocumento"
    },
    {
      title: "Número",
      data: "nroDocumento"
    },
    {
      title: "Nombre",
      data: "nombres.primerNombre"
    },
    {
      title: "Apellido",
      data: "apellidos.primerApellido"
    },
    {
      title: "Fecha Nacimiento",
      data: "fechaNacimiento"
    },
    {
      title: "Correo personal",
      data: "contacto.correoPersonal"
    },
    {
      title: "Telefono",
      data: "contacto.telefono"
    },
    {
      title: "Estado aprendiz",
      data: "estadoAprendiz.estAprNombre"
    },
    {
      title: "Población",
      data: "tipoPoblacion"
    },
     {
      title: "Acciones",
      data: "codigo", // <-- el ID
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
    <div className="container m-0">
      <div className="encabezado">
        <h2>Listado de usuarios</h2>
        <select class="seleccionCantidad" onChange={(e) => {
          const nuevaCantidad = parseInt(e.target.value);
          setCantidadReg(nuevaCantidad);
          loadData(informacion.paginaActual, nuevaCantidad)
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
          pageLength: usuarios.tamanoPagina,
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
    
  );
}
