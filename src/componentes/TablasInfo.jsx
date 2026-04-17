import { useRef } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";

DataTable.use(DT);

export default function TablasInfo({
  columnas = [],
  datos = [],
  informacion = {},
}) {
  const keyRef = useRef(0);
  const prevRef = useRef(datos);

  if (prevRef.current !== datos) {
    keyRef.current += 1;
    prevRef.current = datos;
  }

  return (
    <DataTable
      key={keyRef.current}
      columns={columnas}
      data={Array.isArray(datos) ? datos : []}
      options={{
        lengthMenu: false,
        lengthChange: false,
        paging: false,
        searching: false,
        pageLength: informacion?.tamanoPagina ?? 5,
        deferRender: true,
        info: false,
      }}
    />
  );
}
