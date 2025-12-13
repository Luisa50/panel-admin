import React, { useState, useEffect } from "react";
import "../estilos/usuarios.css";
import ReactDOM from "react-dom/client";
import TablasInfo from "../componentes/TablasInfo.jsx";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import AccionesAprendiz from "../componentes/AccionesAprendiz";
import ModalFicha from "../componentes/modalsPost/ModalFicha.jsx";
import Modalver from "../componentes/modalsPost/ModalVer.jsx";

export default function Usuarios() {
  DataTable.use(DT);

  const [fichas, setFichas] = useState([]);
  const [informacion, setInformacion] = useState({});
  const [dataVer, setDataVer] = useState({});
  const [modo, setModo] = useState("");
  const [idEditar, setIdEditar] = useState(null);

  const [formData, setFormData] = useState({
    ficCodigo: "",
    ficJornada: "",
    ficFechaInicio: "",
    ficFechaFin: "",
    ficEstadoFormacion: "",
    progCodigo: "",
  });


  const loadData = async () => {
    try {
      const res = await fetch("http://healthymind10.runasp.net/api/Ficha");

      if (!res.ok) {
        console.error("Error HTTP:", res.status);
        return;
      }

      const json = await res.json();

      setFichas(json ?? []);
      setInformacion({ total: json.length });
    } catch (error) {
      console.error("Error al cargar fichas:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const columnas = [
    { title: "Código", data: "ficCodigo" },
    { title: "Jornada", data: "ficJornada" },
    {
      title: "Fecha Inicio",
      data: "ficFechaInicio",
      render: (f) => (f ? f.split("T")[0] : "—"),
    },
    {
      title: "Fecha Fin",
      data: "ficFechaFin",
      render: (f) => (f ? f.split("T")[0] : "—"),
    },
    { title: "Estado", data: "ficEstadoFormacion" },
    {
      title: "Programa",
      data: "programaFormacion",
      render: (p) => (p?.progNombre ? p.progNombre : "—"),
    },
    {
      title: "Acciones",
      data: "ficCodigo",
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
      },
    },
  ];

  const handleVer = async (id) => {
    try {
      const res = await fetch(`http://healthymind10.runasp.net/api/Ficha/${id}`);
      const json = await res.json();
      setDataVer(json[0] ?? {});
    } catch (err) {
      console.error(err);
    }
  };


  const handleEditar = async (id) => {
    try {
      const res = await fetch(`http://healthymind10.runasp.net/api/Ficha/${id}`);
      const json = await res.json();
      const data = json[0];

      if (!data) return;

      setFormData({
        ficCodigo: data.ficCodigo,
        ficJornada: data.ficJornada,
        ficFechaInicio: data.ficFechaInicio?.split("T")[0] ?? "",
        ficFechaFin: data.ficFechaFin?.split("T")[0] ?? "",
        ficEstadoFormacion: data.ficEstadoFormacion,
        progCodigo: data.programaFormacion?.progCodigo ?? "",
      });

      setModo("editar");
      setIdEditar(id);
    } catch (error) {
      console.error(error);
    }
  };


  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta ficha?")) return;

    try {
      await fetch(`http://healthymind10.runasp.net/api/Ficha/Eliminar/${id}`, {
        method: "DELETE",
      });

      alert("Ficha eliminada");
      loadData();
    } catch (e) {
      console.error(e);
    }
  };


  const enviarPost = async (e) => {
    e.preventDefault();

    const cuerpoPost = { ...formData };

    const url =
      modo === "crear"
        ? "http://healthymind10.runasp.net/api/Ficha"
        : `http://healthymind10.runasp.net/api/Ficha/Editar/${idEditar}`;

    const method = modo === "crear" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpoPost),
    });

    if (res.ok) {
      alert(modo === "crear" ? "Ficha creada" : "Ficha actualizada");
      loadData();
      limpiarFormulario();
      document.getElementById("btnCerrarModal")?.click();
    } else {
      alert("Error al guardar ficha");
    }
  };


  const limpiarFormulario = () => {
    setFormData({
      ficCodigo: "",
      ficJornada: "",
      ficFechaInicio: "",
      ficFechaFin: "",
      ficEstadoFormacion: "",
      progCodigo: "",
    });
  };


  const busquedaDinamica = async (text) => {
    if (text.length < 3) return loadData();

    const res = await fetch(
      `http://healthymind10.runasp.net/api/Ficha/busqueda-dinamica?texto=${text}`
    );
    const json = await res.json();
    setFichas(json);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <ModalFicha
        formData={formData}
        handleChange={handleChange}
        enviarPost={enviarPost}
        modo={modo}
      />

      <Modalver
        id="modalVer"
        titulo="Detalles de la Ficha"
        data={dataVer}
        campos={[
          { nombre: "ficCodigo", label: "Código" },
          { nombre: "ficJornada", label: "Jornada" },
          { nombre: "ficFechaInicio", label: "Fecha Inicio" },
          { nombre: "ficFechaFin", label: "Fecha Fin" },
          { nombre: "ficEstadoFormacion", label: "Estado" },
          { nombre: "programaFormacion.progNombre", label: "Programa" },
        ]}
      />

      <div className="container-fluid pb-4">
        <h2>Listado de Fichas</h2>

        <div className="encabezado d-flex justify-content-between">
          <input
            className="form-control w-25"
            placeholder="Buscar…"
            onChange={(e) => busquedaDinamica(e.target.value)}
          />

          <span
            className="input-group-text bg-success text-light"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={() => {
              limpiarFormulario();
              setModo("crear");
            }}
          >
            +
          </span>
        </div>

        <TablasInfo columnas={columnas} datos={fichas} informacion={informacion} />
      </div>
    </>
  );
}
