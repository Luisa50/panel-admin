import { API_URL } from "../config.js";
const STORAGE_KEY = "healthymind_admin_auth";

// LOGIN
export async function login({ correoPersonal, password }) {
  const res = await fetch(`${API_URL}/Autenticacion/ValidarAdmin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correoPersonal, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Correo o contraseña incorrectos");
  }

  const data = await res.json();
  const token = data.token ?? data.accessToken ?? data;

  const authData = { token, correoPersonal };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));

  return { token, correoPersonal };
}

// LOGOUT
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

// OBTENER DATOS DE AUTH
export function getAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

// OBTENER TOKEN
export function getToken() {
  const auth = getAuth();
  return auth?.token ?? null;
}

// VALIDAR SI ESTÁ AUTENTICADO
export function isAuthenticated() {
  return !!getToken();
}

// FETCH CON TOKEN AUTOMÁTICO
export async function fetchWithAuth(url, options = {}) {
  const token = getToken();

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // SI EL TOKEN EXPIRÓ
  if (response.status === 401) {
    logout();
    alert("Tu sesión ha expirado. Vuelve a iniciar sesión.");
    window.location.href = "/";
    return;
  }

  return response;
}