// Servicio simple que usa localStorage como "API mock" para usuarios
const STORAGE_KEY = "hm_usuarios_v1";

// datos iniciales si no existen
function datosIniciales() {
  const roles = ["admin","editor","usuario"];
  const users = [];
  for (let i=1;i<=42;i++){
    users.push({
      id: i,
      nombre: `Usuario ${i}`,
      correo: `usuario${i}@ejemplo.com`,
      rol: roles[i % roles.length],
      activo: i % 7 !== 0,
      ultimoAcceso: new Date(Date.now() - (i*3600*1000)).toISOString(),
      accionesRecientes: [
        {accion: "login", fecha: new Date(Date.now() - (i*3600*1000)).toISOString()},
        {accion: "editar perfil", fecha: new Date(Date.now() - (i*7200*1000)).toISOString()}
      ]
    });
  }
  return users;
}

function leerTodos(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw){
    const inicial = datosIniciales();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inicial));
    return inicial;
  }
  return JSON.parse(raw);
}

function guardarTodos(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

export function listarUsuarios({pagina=1, porPagina=10, busqueda="", filtroRol="", activo=null} = {}){
  const todos = leerTodos();
  let filtrados = todos.slice();

  if(busqueda){
    const q = busqueda.toLowerCase();
    filtrados = filtrados.filter(u => u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q));
  }
  if(filtroRol){
    filtrados = filtrados.filter(u => u.rol === filtroRol);
  }
  if(activo !== null){
    filtrados = filtrados.filter(u => (!!u.activo) === (!!activo));
  }

  const total = filtrados.length;
  const inicio = (pagina-1)*porPagina;
  const datos = filtrados.slice(inicio, inicio+porPagina);
  return { datos, total, pagina, porPagina };
}

export function obtenerUsuario(id){
  const todos = leerTodos();
  return todos.find(u => u.id === Number(id)) || null;
}

export function crearUsuario(payload){
  const todos = leerTodos();
  const id = (todos.reduce((a,b)=>Math.max(a,b.id),0) || 0) + 1;
  const nuevo = {
    id, activo:true, ultimoAcceso: new Date().toISOString(), accionesRecientes: [], ...payload
  };
  todos.unshift(nuevo);
  guardarTodos(todos);
  return nuevo;
}

export function actualizarUsuario(id, cambios){
  const todos = leerTodos();
  const idx = todos.findIndex(u => u.id === Number(id));
  if(idx === -1) return null;
  todos[idx] = {...todos[idx], ...cambios};
  guardarTodos(todos);
  return todos[idx];
}

export function eliminarUsuario(id){
  let todos = leerTodos();
  todos = todos.filter(u => u.id !== Number(id));
  guardarTodos(todos);
  return true;
}

export function toggleActivo(id){
  const user = obtenerUsuario(id);
  if(!user) return null;
  const actualizado = actualizarUsuario(id, { activo: !user.activo });
  return actualizado;
}

export function exportarCSV(filtroFunc = null){
  const todos = leerTodos();
  const rows = (filtroFunc ? todos.filter(filtroFunc) : todos).map(u => ({
    id:u.id, nombre:u.nombre, correo:u.correo, rol:u.rol, activo:u.activo, ultimoAcceso:u.ultimoAcceso
  }));
  const header = Object.keys(rows[0] || {}).join(",");
  const lines = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(","));
  return [header, ...lines].join("\n");
}