import React, { useState, useEffect } from "react";
import "../estilos/usuarios.css";
import ReactDOM from "react-dom/client";
import TablasInfo from "../componentes/TablasInfo.jsx";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import { Modal } from "bootstrap";
import AccionesAprendiz from "../componentes/AccionesAprendiz";
import ModalFicha from "../componentes/modalsPost/ModalFicha.jsx";
import Modalver from "../componentes/modalsPost/ModalVer.jsx";
import { fetchWithAuth } from "../services/auth";

export default function Fichas() {
  DataTable.use(DT);

  const [fichas, setFichas] = useState([]);
  const [informacion, setInformacion] = useState({});
  const [dataVer, setDataVer] = useState({});
  const [modo, setModo] = useState("crear");
  const [idEditar, setIdEditar] = useState(null);
  const [formData, setFormData] = useState({
    ficCodigo: "",
    ficJornada: "",
    ficFechaInicio: "",
    ficFechaFin: "",
    ficEstadoFormacion: "",
    ficProgramaFK: "",
  });
  const [programaTexto, setProgramaTexto] = useState("");
  const [listaProgramas, setListaProgramas] = useState([]);
  const buscarProgramaTimeout = React.useRef(null);

  const loadData = async (pag = 1, tamanoPagina = 10) => {
    try {
      let url = `http://healthymind10.runasp.net/api/Ficha/listar?Pagina=${pag}&TamanoPagina=${tamanoPagina}`;
      let res = await fetchWithAuth(url);
      let json;

      if (res.ok) {
        json = await res.json();
      } else {
        // Si no existe listar, usar GET /api/Ficha (lista completa, una sola página)
        res = await fetchWithAuth("http://healthymind10.runasp.net/api/Ficha");
        if (!res.ok) return;
        json = await res.json();
        const arr = Array.isArray(json) ? json : (json?.datos ?? json?.resultado ?? json?.resultados ?? []);
        setFichas(arr);
        setInformacion({
          paginaActual: 1,
          paginaAnterior: null,
          paginaSiguiente: null,
          totalPaginas: 1,
          totalRegistros: arr.length,
          tamanoPagina: arr.length,
        });
        return;
      }

      const lista = json?.datos ?? json?.resultado ?? json?.resultados ?? (Array.isArray(json) ? json : []);
      setFichas(lista);
      setInformacion({
        resultado: lista,
        totalRegistros: json?.totalRegistros ?? lista.length,
        paginaActual: json?.paginaActual ?? pag,
        paginaAnterior: json?.paginaAnterior ?? (pag > 1 ? pag - 1 : null),
        paginaSiguiente: json?.paginaSiguiente ?? (lista.length === tamanoPagina ? pag + 1 : null),
        totalPaginas: json?.totalPaginas ?? Math.max(1, Math.ceil((json?.totalRegistros ?? lista.length) / tamanoPagina)),
        tamanoPagina: json?.tamanoPagina ?? tamanoPagina,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuscarPrograma = (e) => {
    const texto = e.target.value;
    setProgramaTexto(texto);
    if (texto.length < 3) {
      setListaProgramas([]);
      return;
    }
    clearTimeout(buscarProgramaTimeout.current);
    buscarProgramaTimeout.current = setTimeout(async () => {
      try {
        const res = await fetchWithAuth(
          `http://healthymind10.runasp.net/api/ProgramaFormacion/buscar?ProgramaNombre=${encodeURIComponent(texto)}`
        );
        const data = await res.json();
        setListaProgramas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error buscando programas:", err);
      }
    }, 300);
  };

  const seleccionarPrograma = (prog) => {
    setProgramaTexto(prog.progNombre ?? "");
    setFormData((prev) => ({ ...prev, ficProgramaFK: prog.progCodigo ?? "" }));
    setListaProgramas([]);
  };

  const abrirModal = () => {
    limpiarFormulario();
    setModo("crear");
    const modalEl = document.getElementById("modalFicha");
    const modal = new Modal(modalEl);
    modal.show();
  };

  const handleVer = async (id) => {
    try {
      const res = await fetchWithAuth(`http://healthymind10.runasp.net/api/Ficha/${id}`);
      const json = await res.json();
      setDataVer(Array.isArray(json) ? json[0] ?? {} : json ?? {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditar = async (id) => {
    try {
      const res = await fetchWithAuth(`http://healthymind10.runasp.net/api/Ficha/${id}`);
      const json = await res.json();
      const data = Array.isArray(json) ? json[0] : json;
      if (!data) return;

      setFormData({
        ficCodigo: data.ficCodigo ?? "",
        ficJornada: data.ficJornada ?? "",
        ficFechaInicio: data.ficFechaInicio?.split("T")[0] ?? "",
        ficFechaFin: data.ficFechaFin?.split("T")[0] ?? "",
        ficEstadoFormacion: data.ficEstadoFormacion ?? "",
        ficProgramaFK: data.programaFormacion?.progCodigo ?? "",
      });
      setProgramaTexto(data.programaFormacion?.progNombre ?? "");
      setListaProgramas([]);

      setModo("editar");
      setIdEditar(id);

      const modalEl = document.getElementById("modalFicha");
      const modal = new Modal(modalEl);
      modal.show();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta ficha?")) return;
    try {
      await fetchWithAuth(`http://healthymind10.runasp.net/api/Ficha/Eliminar/${id}`, {
        method: "DELETE",
      });
      alert("Ficha eliminada");
      loadData(informacion?.paginaActual ?? 1);
    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  const enviarPost = async (e) => {
    e.preventDefault();
    if (!formData.ficProgramaFK) {
      alert("Seleccione un programa de la lista (escriba al menos 3 letras y elija una opción).");
      return;
    }
    const cuerpoPost = { ...formData };
    const url =
      modo === "crear"
        ? "http://healthymind10.runasp.net/api/Ficha"
        : `http://healthymind10.runasp.net/api/Ficha/Editar/${idEditar}`;
    const method = modo === "crear" ? "POST" : "PUT";

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpoPost),
      });
      if (!res.ok) throw new Error("Error al guardar ficha");

      alert(modo === "crear" ? "Ficha creada" : "Ficha actualizada");
      loadData(informacion?.paginaActual ?? 1);
      limpiarFormulario();

      const modalEl = document.getElementById("modalFicha");
      const modal = Modal.getInstance(modalEl);
      modal?.hide();
    } catch (err) {
      console.error(err);
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
      ficProgramaFK: "",
    });
    setProgramaTexto("");
    setListaProgramas([]);
    setModo("crear");
    setIdEditar(null);
  };

  const busquedaDinamica = async (text) => {
    if (text.length < 3) return loadData(informacion?.paginaActual ?? 1);
    try {
      const res = await fetchWithAuth(
        `http://healthymind10.runasp.net/api/Ficha/busqueda-dinamica?texto=${encodeURIComponent(text)}`
      );
      const json = await res.json();
      setFichas(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error(err);
    }
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
      render: (p) => p?.progNombre ?? "—",
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

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <ModalFicha
        formData={formData}
        handleChange={handleChange}
        enviar={enviarPost}
        modo={modo}
        programaTexto={programaTexto}
        listaProgramas={listaProgramas}
        handleBuscarPrograma={handleBuscarPrograma}
        seleccionarPrograma={seleccionarPrograma}
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

        {/* Buscador y botón + */}
        <div className="d-flex justify-content-end mb-2 align-items-center gap-2">
          <input
            className="form-control"
            style={{ width: "220px" }}
            placeholder="Buscar…"
            onChange={(e) => busquedaDinamica(e.target.value)}
          />
          <button className="btn btn-success" onClick={abrirModal}>
            +
          </button>
        </div>

        <TablasInfo columnas={columnas} datos={fichas} informacion={informacion} />

        {/* Paginación */}
        <div className="d-flex justify-content-start mt-3">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-primary"
              disabled={!informacion.paginaAnterior}
              onClick={() => loadData(informacion.paginaAnterior)}
              aria-label="Página anterior"
            >
              <i className="bi bi-chevron-compact-left"></i>
            </button>

            {Array.from(
              { length: informacion?.totalPaginas ?? 1 },
              (_, i) => i + 1
            ).map((num) => (
              <button
                key={num}
                type="button"
                className={`btn ${informacion?.paginaActual === num ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => loadData(num)}
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
              onClick={() => loadData(informacion.paginaSiguiente)}
              aria-label="Página siguiente"
            >
              <i className="bi bi-chevron-compact-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
