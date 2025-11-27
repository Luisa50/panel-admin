// src/services/auth.js
// Servicio de autenticación simulado.
// En producción reemplaza por llamadas a tu API (fetch/axios).

const STORAGE_KEY = 'myapp_auth' // clave para guardar en localStorage (opcional)

export function login({ email, password }) {
  // Retorna una promesa que resuelve si las credenciales son correctas
  // (simulación). En la respuesta puedes devolver token y datos del usuario.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Credenciales de prueba:
      if (email === 'admin@example.com' && password === 'admin123') {
        const data = {
          token: 'fake-jwt-token',
          user: { id: 1, name: 'Administrador', email }
        }
        // Guardar en localStorage (opcional para persistencia simple):
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        resolve(data)
      } else {
        reject(new Error('Correo o contraseña incorrecta'))
      }
    }, 500) // simulamos latencia
  })
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAuth() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  return !!getAuth()
}
