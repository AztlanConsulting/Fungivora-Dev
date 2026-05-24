const BASE_URL = '/api';

// Función auxiliar 
const getHeaders = (extraHeaders = {}) => {
    const token = localStorage.getItem("token");
    const headers = { ...extraHeaders };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

const api = {
    // Rutas GET
    get: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
    },

    // Rutas POST
    post: async (endpoint, body) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
    },

    // Rutas PUT
    put: async (endpoint, body) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
    },

    // Rutas DELETE
    delete: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, { 
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
    },
};

export default api;