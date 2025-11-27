import React, { useState, useMemo } from "react";

function generarPsicologasMock() {
  const nombres = [
    ["Laura", "Marcela", "Díaz"],
    ["Carolina", "Paola", "Santos"],
    ["Vanessa", "", "Beltrán"],
    ["Maryory", "", "Durán"],
    ["Valentina", "", "Mejía"],
    ["Camila", "", "Torres"],
    ["Lina", "María", "García"],
    ["Sofía", "", "Castro"],
    ["Daniela", "", "Ríos"],
    ["Paula", "Andrea", "Bello"],
  ];

  const psicologas = [];

  for (let i = 0; i < 20; i++) {
    const base = nombres[i % nombres.length];

    psicologas.push({
      id: i + 1,
      documento: 80000000 + i,
      nombre: `${base[0]} ${base[1]} ${base[2]}`,
      correo: `${base[0].toLowerCase()}.${base[2].toLowerCase()}@sena.edu.co`,
    });
  }

  return psicologas;
}

export default function Psicologos() {
  const [query, setQuery] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;

  const [psicologas] = useState(generarPsicologasMock());

  const filtrados = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return psicologas;

    return psicologas.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        String(p.documento).includes(q) ||
        p.correo.toLowerCase().includes(q)
    );
  }, [query, psicologas]);

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const mostrar = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className="container mt-4">
      <h2>Psicólogas SENA</h2>

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
            </tr>
          </thead>

          <tbody>
            {mostrar.map((p, i) => (
              <tr key={p.id}>
                <td>{(pagina - 1) * porPagina + i + 1}</td>
                <td>{p.documento}</td>
                <td>{p.nombre}</td>
                <td>{p.correo}</td>
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

