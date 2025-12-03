import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';


export default function TablasInfo({ columnas, datos, informacion }) {
  return (
    <DataTable 
    key={datos.length}
    columns={columnas}
    data={datos}
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