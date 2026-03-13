import React, { useEffect, useState, useRef } from "react";
import { fetchWithAuth } from "../services/auth";

import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";

import "../estilos/regionales.css";

export default function Regionales() {

  const [regionales, setRegionales] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {

    const obtenerRegionales = async () => {

      try {

        const response = await fetchWithAuth(
          "http://healthymind10.runasp.net/api/Regional"
        );

        const data = await response.json();

        setRegionales(data);

        setTimeout(() => {

          if (!$.fn.DataTable.isDataTable("#tablaRegionales")) {

            $("#tablaRegionales").DataTable({
              pageLength: 5,
              lengthMenu: [5,10,25],
              language: {
                search: "Buscar",
                lengthMenu: "Mostrar _MENU_",
                info: "Mostrando _START_ a _END_ de _TOTAL_",
                paginate: {
                  previous: "‹",
                  next: "›"
                }
              }
            });

          }

        }, 100);

      } catch (error) {

        console.error(error);

      }

    };

    obtenerRegionales();

  }, []);

  return (

    <div className="dataTables_wrapper">

      <h2>Listado de regionales</h2>

      <table
        id="tablaRegionales"
        ref={tableRef}
        className="display dataTable"
        style={{width:"100%"}}
      >

        <thead>

          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {regionales.map((reg) => (

            <tr key={reg.regCodigo}>

              <td>{reg.regCodigo}</td>

              <td>{reg.regNombre}</td>

              <td>

                <button className="btn-actions">👁</button>

                <button
                  className="btn-actions"
                  style={{marginLeft:"5px"}}
                >
                  ✏
                </button>

                <button
                  className="btn-actions"
                  style={{marginLeft:"5px",background:"#dc3545"}}
                >
                  🗑
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}