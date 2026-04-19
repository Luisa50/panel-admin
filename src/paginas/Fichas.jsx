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
import PaginacionTablaMinimal from "../componentes/PaginacionTablaMinimal.jsx";
import ModalFicha from "../componentes/modalsPost/ModalFicha.jsx";
import Modalver from "../componentes/modalsPost/ModalVer.jsx";
import { fetchWithAuth } from "../services/auth";
import { API_URL } from "../config";

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
  const timeoutBusquedaListado = React.useRef(null);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const abrirModalPorId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    Modal.getOrCreateInstance(el).show();
  };

  const cerrarModalPorId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const inst = Modal.getInstance(el);
    inst?.hide();
  };

  const cumpleMinimoBusqueda = (texto) => {
    const t = texto.trim();
    if (!t) return false;
    if (/^\d+$/.test(t)) return t.length >= 1;
    return t.length >= 2;
  };

  /** Si la API no devuelve coincidencias, filtra en cliente por código o nombre de programa. */
  const filtrarFichasLocal = (lista, textoRaw) => {
    const t = textoRaw.trim().toLowerCase();
    if (!t) return lista;
    return lista.filter((f) => {
      const cod = String(f.ficCodigo ?? "");
      const nom = (f.programaFormacion?.progNombre ?? "").toLowerCase();
      const jur = String(f.ficJornada ?? "").toLowerCase();
      return (
        cod.includes(textoRaw.trim()) ||
        nom.includes(t) ||
        jur.includes(t)
      );
    });
  };

  const loadData = async (pag = 1, tamanoPagina = 10) => {
    setTextoBusqueda("");
    try {
      let url = `${API_URL}/Ficha/listar?Pagina=${pag}&TamanoPagina=${tamanoPagina}`;
      let res = await fetchWithAuth(url);
      let json;

      if (res.ok) {
        json = await res.json();
      } else {
        res = await fetchWithAuth(`${API_URL}/Ficha`);
        if (!res.ok) return;
        json = await res.json();
        const arr = Array.isArray(json)
          ? json
          : (json?.datos ?? json?.resultado ?? json?.resultados ?? []);
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

      const lista =
        json?.datos ?? json?.resultado ?? json?.resultados ?? (Array.isArray(json) ? json : []);
      setFichas(lista);
      setInformacion({
        resultado: lista,
        totalRegistros: json?.totalRegistros ?? lista.length,
        paginaActual: json?.paginaActual ?? pag,
        paginaAnterior: json?.paginaAnterior ?? (pag > 1 ? pag - 1 : null),
        paginaSiguiente:
          json?.paginaSiguiente ?? (lista.length === tamanoPagina ? pag + 1 : null),
        totalPaginas:
          json?.totalPaginas ??
          Math.max(1, Math.ceil((json?.totalRegistros ?? lista.length) / tamanoPagina)),
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
          `${API_URL}/ProgramaFormacion/buscar?ProgramaNombre=${encodeURIComponent(texto)}`
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
    setIdEditar(null);
    window.requestAnimationFrame(() => {
      abrirModalPorId("modalFicha");
    });
  };

  const ejecutarBusquedaFichas = async (textoRaw) => {
    const texto = textoRaw.trim();
    if (!texto) {
      await loadData(informacion?.paginaActual ?? 1);
      return;
    }
    if (!cumpleMinimoBusqueda(textoRaw)) return;

    try {
      const res = await fetchWithAuth(
        `${API_URL}/Ficha/busqueda-dinamica?texto=${encodeURIComponent(texto)}`
      );
      if (!res?.ok) return;
      const json = await res.json();
      let arr = Array.isArray(json) ? json : [];

      if (arr.length === 0) {
        const resLista = await fetchWithAuth(
          `${API_URL}/Ficha/listar?Pagina=1&TamanoPagina=500`
        );
        if (resLista?.ok) {
          const j2 = await resLista.json();
          const lista =
            j2?.datos ?? j2?.resultado ?? j2?.resultados ?? [];
          const base = Array.isArray(lista) ? lista : [];
          arr = filtrarFichasLocal(base, textoRaw);
        }
      }

      setFichas(arr);
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

  const handleVer = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/Ficha/${id}`);
      const json = await res.json();
      setDataVer(Array.isArray(json) ? json[0] ?? {} : json ?? {});
      abrirModalPorId("modalVer");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditar = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_URL}/Ficha/${id}`);
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
      abrirModalPorId("modalFicha");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta ficha?")) return;
    try {
      await fetchWithAuth(`${API_URL}/Ficha/Eliminar/${id}`, {
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
      alert(
        "Seleccione un programa de la lista (escriba al menos 3 letras y elija una opción)."
      );
      return;
    }
    const cuerpoPost = { ...formData };
    const url =
      modo === "crear"
        ? `${API_URL}/Ficha`
        : `${API_URL}/Ficha/Editar/${idEditar}`;
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
      cerrarModalPorId("modalFicha");
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
      data: null,
      defaultContent: "",
      orderable: false,
      searchable: false,
      createdCell: (td, _cellData, rowData) => {
        const id = rowData?.ficCodigo;

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

        <div className="d-flex justify-content-end mb-2 align-items-center gap-2">
          <input
            type="search"
            className="form-control"
            style={{ width: "280px" }}
            placeholder="Buscar"
            value={textoBusqueda}
            aria-label="Buscar"
            onChange={(e) => {
              const v = e.target.value;
              setTextoBusqueda(v);
              clearTimeout(timeoutBusquedaListado.current);
              if (!v.trim()) {
                loadData(informacion?.paginaActual ?? 1);
                return;
              }
              timeoutBusquedaListado.current = setTimeout(
                () => ejecutarBusquedaFichas(v),
                400
              );
            }}
          />
          <button
            type="button"
            className="btn btn-primary px-3"
            title="Registrar nueva ficha"
            onClick={abrirModal}
          >
            +
          </button>
        </div>

        <TablasInfo columnas={columnas} datos={fichas} informacion={informacion} />

        <PaginacionTablaMinimal
          paginaActual={informacion?.paginaActual ?? 1}
          totalPaginas={Math.max(1, informacion?.totalPaginas ?? 1)}
          onCambiarPagina={(n) => loadData(n)}
        />
      </div>
    </>
  );
}
