const BASE_URL = '/api'

// Conexión a la API desde un mismo bloque para evitar el uso de fetch dentro de cada vista
const api = {
    // Rutas GET
    get: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`)
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        return res.json()
    },

    // Rutas POST
    post: async (endpoint, body) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        return res.json()
    },

    // Rutas PUT
    put: async (endpoint, body) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        return res.json()
    },

    // Rutas DELETE
    delete: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'DELETE' })
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        return res.json()
    },
}

export default api