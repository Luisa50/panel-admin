import React, { useState, useEffect } from "react";

export default function ModalUsuario({ visible, onCerrar, onGuardar, usuario }) {
  const [form, setForm] = useState({ nombre:"", correo:"", rol:"usuario" });

  useEffect(()=>{
    if(usuario) setForm({ nombre:usuario.nombre||"", correo:usuario.correo||"", rol:usuario.rol||"usuario" });
    else setForm({ nombre:"", correo:"", rol:"usuario" });
  },[usuario, visible]);

  if(!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h5>{usuario ? "Editar usuario" : "Crear usuario"}</h5>
        <div className="mb-2">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} />
        </div>
        <div className="mb-2">
          <label className="form-label">Correo</label>
          <input className="form-control" value={form.correo} onChange={e=>setForm({...form, correo:e.target.value})} />
        </div>
        <div className="mb-3">
          <label className="form-label">Rol</label>
          <select className="form-select" value={form.rol} onChange={e=>setForm({...form, rol:e.target.value})}>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="usuario">Usuario</option>
          </select>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn-primary" onClick={()=>{ onGuardar(form); }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}