import React from "react";

export default function FiltrosUsuarios({ filtros, onChange, onBuscar, onExportar }) {
  return (
    <div className="d-flex gap-2 align-items-end mb-3 flex-wrap">
      <div>
        <label className="form-label small">Búsqueda</label>
        <input className="form-control" value={filtros.busqueda} onChange={e=>onChange({...filtros, busqueda:e.target.value})} placeholder="Buscar por nombre o correo" />
      </div>

      <div>
        <label className="form-label small">Rol</label>
        <select className="form-select" value={filtros.rol} onChange={e=>onChange({...filtros, rol:e.target.value})}>
          <option value="">Todos</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="usuario">Usuario</option>
        </select>
      </div>

      <div>
        <label className="form-label small">Estado</label>
        <select className="form-select" value={filtros.activo==null?"":filtros.activo? "1":"0"} onChange={e=>{
          const v = e.target.value;
          onChange({...filtros, activo: v===""? null: v==="1"});
        }}>
          <option value="">Todos</option>
          <option value="1">Activos</option>
          <option value="0">Inactivos</option>
        </select>
      </div>

      <div className="align-self-center">
        <button className="btn btn-primary" onClick={onBuscar}>Buscar</button>
      </div>

      <div className="ms-auto">
        <label className="form-label small d-block">&nbsp;</label>
        <div>
          <button className="btn btn-outline-secondary me-1" onClick={()=>onExportar('csv')}>Exportar CSV</button>
          <button className="btn btn-outline-secondary" onClick={()=>onExportar('excel')}>Exportar Excel</button>
        </div>
      </div>
    </div>
  );
}