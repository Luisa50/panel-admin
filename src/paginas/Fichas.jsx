import React, { useState, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import ReactDOM from "react-dom/client";
import Swal from "sweetalert2";
import ModalFicha from "../componentes/modalsPost/ModalFicha";


const API = "http://healthymind10.runasp.net/api/Ficha";

export default function Fichas() {
  DataTable.use(DT);
  const [fichas, setFichas] = useState([]);
  const [modo, setModo] = useState("");
  const [idEditar, setIdEditar] = useState(null);
  const [formData, setFormData] = useState({
    ficCodigo: "",
    ficJornada: "",
    ficFechaInicio: "",
    ficFechaFin: "",
    ficEstadoFormacion: "",
    ficProgramaFk: ""
  });

  const loadData = async () => {
    try {
      const res = await fetch(API);
      const json = await res.json();
      const datos = json.map((f) => ({
        id: f.ficCodigo,
        numero: f.ficCodigo,
        jornada: f.ficJornada,
        fechaInicio: f.ficFechaInicio,
        fechaFin: f.ficFechaFin,
        estado: f.ficEstadoFormacion,
        programa: f.programaFormacion?.progNombre ?? "N/A",
        ...f
      }));
      setFichas(datos);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las fichas", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const enviar = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (modo === "crear") {
        const cuerpoPost = { ...formData };
        res = await fetch(API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cuerpoPost)
        });
        if (!res.ok) throw new Error("Error creando ficha");
        Swal.fire({ icon: "success", title: "Ficha creada correctamente", timer: 1500, showConfirmButton: false });
      } else if (modo === "editar") {
        res = await fetch(`${API}/${idEditar}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Error actualizando ficha");
        Swal.fire({ icon: "success", title: "Ficha actualizada", timer: 1500, showConfirmButton: false });
      }
      loadData();
    } catch (error) {
      Swal.fire("Error", "No se pudo enviar la ficha", error);
    }
  };

  const eliminar = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadData();
  };

  const nuevaFicha = () => {
    setModo("crear");
    setFormData({
      ficCodigo: "",
      ficJornada: "",
      ficFechaInicio: "",
      ficFechaFin: "",
      ficEstadoFormacion: "",
      ficProgramaFK: ""
    });
  };

  const columnas = [
    { title: "Código", data: "numero" },
    { title: "Jornada", data: "jornada" },
    { title: "Inicio", data: "fechaInicio" },
    { title: "Fin", data: "fechaFin" },
    { title: "Estado", data: "estado" },
    { title: "Programa", data: "programa" },
    {
      title: "Acciones",
      data: "id",
      createdCell: (td, id, row) => {
        const root = ReactDOM.createRoot(td);
        root.render(
          <div className="d-flex gap-2">
            <button
              className="btn btn-info btn-sm text-white"
              data-bs-toggle="modal"
              data-bs-target="#modalFicha"
              onClick={() => { setModo("ver"); setFormData(row); }}
            >
              <i className="bi bi-eye-fill"></i>
            </button>
            <button
              className="btn btn-warning btn-sm text-white"
              data-bs-toggle="modal"
              data-bs-target="#modalFicha"
              onClick={() => { setModo("editar"); setIdEditar(id); setFormData(row); }}
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => eliminar(id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        );
      }
    }
  ];

  useEffect(() => { loadData(); }, []);

  return (
    <>
      <ModalFicha modo={modo} formData={formData} handleChange={handleChange} enviar={enviar} />
      <div className="container-fluid pb-4">
        <div className="d-flex justify-content-between mb-3">
          <h2>Listado de Fichas</h2>
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalFicha"
            onClick={nuevaFicha}
          >
            + Nueva Ficha
          </button>
        </div>
        <DataTable
          data={fichas}
          columns={columnas}
          className="table table-striped"
          options={{ paging: false, searching: false, info: false, responsive: true }}
        />
      </div>
    </>
  );
}
