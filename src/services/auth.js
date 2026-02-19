// Servicio de autenticación con API HealthyMind (JWT).

const API_BASE = "http://healthymind10.runasp.net/api";
const STORAGE_KEY = "healthymind_admin_auth";

/**
 * Login de administrador. Llama a ValidarAdmin y guarda el token en localStorage.
 * @param {{ correoPersonal: string, password: string }} credenciales
 * @returns {Promise<{ token: string }>}
 */
export async function login({ correoPersonal, password }) {
  const res = await fetch(`${API_BASE}/Autenticacion/ValidarAdmin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correoPersonal, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    let message = "Correo o contraseña incorrectos";
    try {
      const json = JSON.parse(text);
      if (json.message) message = json.message;
      else if (json.error) message = json.error;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  const data = await res.json();
  const token = data.token ?? data.accessToken ?? data;
  if (!token || typeof token !== "string") {
    throw new Error("La respuesta del servidor no incluyó un token válido");
  }

  const authData = { token, correoPersonal };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  return { token, correoPersonal };
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Devuelve el objeto guardado (token y correo) o null.
 */
export function getAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

/**
 * Devuelve el JWT para enviarlo en cabeceras (ej: Authorization: Bearer ...).
 */
export function getToken() {
  const auth = getAuth();
  return auth?.token ?? null;
}

export function isAuthenticated() {
  return !!getToken();
}

/**
 * fetch con JWT en cabecera Authorization. Usar para todos los endpoints que requieren autenticación.
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...options, headers });
}
