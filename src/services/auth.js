import { API_URL } from "../config.js";

const STORAGE_KEY = "healthymind_admin_auth";

/** @param {string} token */
function jwtExp(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let p = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = 4 - (p.length % 4);
    if (pad !== 4) p += "=".repeat(pad);
    const exp = JSON.parse(atob(p)).exp;
    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
}

/** true si el access JWT caducó o está a punto (skew en segundos) */
export function isAccessExpired(token, skewSec = 35) {
  if (!token) return true;
  const exp = jwtExp(token);
  if (exp == null) return true;
  return exp <= Math.floor(Date.now() / 1000) + skewSec;
}

function persistAuth(authData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
}

function getRefreshToken() {
  const auth = getAuth();
  return auth?.refreshToken ?? null;
}

let refreshLock = null;
let proactiveTimer = null;

function clearProactiveRefresh() {
  if (proactiveTimer) {
    clearTimeout(proactiveTimer);
    proactiveTimer = null;
  }
}

export function scheduleProactiveRefresh() {
  clearProactiveRefresh();
  if (!getRefreshToken()) return;
  const t = getToken();
  if (!t) return;
  const exp = jwtExp(t);
  if (exp == null) return;
  const delayMs = Math.max(
    (exp - Math.floor(Date.now() / 1000) - 90) * 1000,
    8000
  );
  proactiveTimer = setTimeout(() => {
    proactiveTimer = null;
    void refreshSession().then((ok) => {
      if (ok) scheduleProactiveRefresh();
    });
  }, delayMs);
}

/**
 * Renueva access + refresh. Devuelve false si no hay refresh o falla el servidor.
 */
export async function refreshSession() {
  if (refreshLock) return refreshLock;

  refreshLock = (async () => {
    const auth = getAuth();
    const refresh = auth?.refreshToken;
    if (!refresh) return false;

    try {
      const res = await fetch(`${API_URL}/Autenticacion/refrescar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });

      if (!res.ok) {
        logout();
        return false;
      }

      const data = await res.json();
      const access = data.accessToken ?? data.token;
      const nextRefresh = data.refreshToken;

      if (!access || !nextRefresh) {
        logout();
        return false;
      }

      persistAuth({
        token: access,
        refreshToken: nextRefresh,
        correoPersonal: auth?.correoPersonal ?? "",
      });

      window.dispatchEvent(new Event("healthymind-admin-token-refreshed"));
      scheduleProactiveRefresh();
      return true;
    } catch {
      logout();
      return false;
    } finally {
      refreshLock = null;
    }
  })();

  return refreshLock;
}

/**
 * Al cargar el layout: si el JWT venció pero hay refresh, renueva sin pedir contraseña.
 */
export async function bootstrapSession() {
  const auth = getAuth();
  const access = auth?.token;
  const refresh = auth?.refreshToken;

  if (access && !isAccessExpired(access, 45)) {
    if (refresh) scheduleProactiveRefresh();
    return;
  }

  if (refresh) {
    const ok = await refreshSession();
    if (ok) return;
  }

  if (access && isAccessExpired(access, 0)) {
    logout();
  }
}

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
  const token = data.accessToken ?? data.token;
  if (!token || typeof token !== "string") {
    throw new Error("Respuesta de login inválida: no se recibió el token.");
  }
  const refreshToken = data.refreshToken;

  const authData = {
    token,
    correoPersonal,
    ...(refreshToken ? { refreshToken } : {}),
  };

  persistAuth(authData);
  scheduleProactiveRefresh();

  return { token, correoPersonal, refreshToken };
}

// LOGOUT
export function logout() {
  clearProactiveRefresh();
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

// FETCH CON TOKEN: ante 401 intenta refresh y repite una vez
export async function fetchWithAuth(url, options = {}) {
  const run = async () => {
    const token = getToken();
    const headers = new Headers(options.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(url, {
      ...options,
      headers,
    });
  };

  let response = await run();

  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshSession();
  if (refreshed) {
    response = await run();
    if (response.status === 401) {
      return response;
    }
    return response;
  }

  logout();
  alert("Tu sesión ha expirado. Vuelve a iniciar sesión.");
  window.location.href = "/";
  return undefined;
}
