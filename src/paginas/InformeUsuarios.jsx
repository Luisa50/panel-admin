import React, { useEffect, useState } from "react";
import "../estilos/informes.css";

const InformeUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetch(
          "http://healthymind10.runasp.net/api/Aprendiz/listar?Pagina=1&TamanoPagina=1000"
        );
        const json = await res.json();
        setUsuarios(json.resultado || []);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, []);

  if (loading) {
    return <p style={{ padding: "40px" }}>Cargando informe...</p>;
  }

  const totalUsuarios = usuarios.length;
  const activos = usuarios.filter(u => u.estadoRegistro === "activo").length;
  const inactivos = totalUsuarios - activos;
  const fechaActual = new Date().toLocaleDateString();

  return (
    <div className="pagina-informe">
      <div className="hoja-a4">

        <header className="encabezado">
          <h2>INFORME DE USUARIOS</h2>
          <p>Fecha de generación: {fechaActual}</p>
        </header>

        <section className="resumen">
          <p><strong>Total de usuarios:</strong> {totalUsuarios}</p>
          <p><strong>Usuarios activos:</strong> {activos}</p>
          <p><strong>Usuarios inactivos:</strong> {inactivos}</p>
        </section>

        <section className="tabla-usuarios">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Documento</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={u.nroDocumento}>
                  <td>{i + 1}</td>
                  <td>{u.nroDocumento}</td>
                  <td>
                    {u.nombres?.primerNombre} {u.apellidos?.primerApellido}
                  </td>
                  <td>{u.contacto?.correoPersonal}</td>
                  <td>{u.estadoRegistro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <footer className="pie">
          <p>Documento generado automáticamente por el sistema HealthyMind</p>
        </footer>

        <div className="acciones no-print">
          <button onClick={() => window.print()}><i class="bi bi-arrow-bar-down"></i></button>
          <button onClick={() => window.history.back()}><i class="bi bi-arrow-return-left"></i></button>
        </div>

      </div>
    </div>
  );
};

export default InformeUsuarios;
