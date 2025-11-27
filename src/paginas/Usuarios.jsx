import React, { useState, useMemo } from "react";

function generarUsuariosMock() {
  const nombres = [
    ["Briyith", "Lorena", "Padilla", "Tierra"],
    ["Carlos", "Andrés", "Gómez", ""],
    ["María", "Lucía", "Ramírez", "Suárez"],
    ["Sofía", "", "Rivers", ""],
    ["Juan", "Diego", "Pérez", ""],
    ["Luisa", "Fernanda", "Martínez", ""],
    ["Pedro", "", "Salas", "López"],
    ["Camila", "", "Torres", ""],
    ["Andrés", "Felipe", "Paredes", ""],
    ["Valeria", "", "Meza", ""],
  ];

  const municipios = ["MALAMBO", "BARRANQUILLA", "CARTAGENA", "BOGOTÁ", "CALI"];
  const estados = ["En formación", "Graduado", "En espera"];

  const usuarios = [];

  for (let i = 0; i < 20; i++) {
    const base = nombres[i % nombres.length];

    usuarios.push({
      id: i + 1,
      documento: 100000000 + i,
      nombre: `${base[0]} ${base[1]} ${base[2]} ${base[3]}`,
      correo: `${base[0].toLowerCase()}.${base[2].toLowerCase()}@soy.sena.edu.co`,
      municipio: municipios[i % municipios.length],
      estado: estados[i % estados.length],
      activo: i % 2 === 0 ? "Activo" : "Inactivo",
    });
  }

  return usuarios;
}

export default function Usuarios() {
  const [query, setQuery] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;


  const [usuarios, setUsuarios] = useState(generarUsuariosMock());

  const filtrados = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return usuarios;

    return usuarios.filter(
      (u) =>
        u.nombre.toLowerCase().includes(q) ||
        String(u.documento).includes(q) ||
        u.correo.toLowerCase().includes(q)
    );
  }, [query, usuarios]);

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const mostrar = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);


  const toggleEstado = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const pregunta =
            u.activo === "Activo"
              ? "¿Deseas inactivar este usuario?"
              : "¿Deseas activar este usuario?";

          if (window.confirm(pregunta)) {
            return {
              ...u,
              activo: u.activo === "Activo" ? "Inactivo" : "Activo",
            };
          }
        }
        return u;
      })
    );
  };

  return (
    <div className="container mt-4">
      <h2>Listado de usuarios</h2>

      <div className="d-flex justify-content-end mb-2">
        <input
          className="form-control"
          style={{ width: "220px" }}
          placeholder="Buscar…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPagina(1);
          }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Documento</th>
              <th>Nombre completo</th>
              <th>Correo institucional</th>
              <th>Municipio</th>
              <th>Estado</th>
              <th>Activo</th>
            </tr>
          </thead>

          <tbody>
            {mostrar.map((u, i) => (
              <tr key={u.id}>
                <td>{(pagina - 1) * porPagina + i + 1}</td>
                <td>{u.documento}</td>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.municipio}</td>
                <td>{u.estado}</td>


                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleEstado(u.id)}
                >
                  {u.activo === "Activo" ? (
                    <span className="badge bg-success">Activo</span>
                  ) : (
                    <span className="badge bg-danger">Inactivo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav>
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <button
              className="page-link"
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
            >
              «
            </button>
          </li>

          {[...Array(totalPaginas)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${pagina === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setPagina(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li className="page-item">
            <button
              className="page-link"
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(pagina + 1)}
            >
              »
            </button>
          </li>
        </ul>
      </nav>
    </div>
    
  );
}
