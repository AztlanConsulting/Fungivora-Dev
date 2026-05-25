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

const handleResponse = async (res) => {
    if (!res.ok) {
        let data = null;
        try { data = await res.json(); } catch { /* body no-JSON */ }

        if (data?.code === "TOKEN_EXPIRED") {
            localStorage.removeItem("token");
            if (typeof window !== "undefined" && window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }

        const mensaje = data?.msg || data?.error || `Error ${res.status}: ${res.statusText}`;
        const err = new Error(mensaje);
        err.status = res.status;
        err.response = { status: res.status, data };
        throw err;
    }
    return res.json();
};

const api = {
    // Rutas GET
    get: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return handleResponse(res);
    },

    // Rutas POST
    post: async (endpoint, body) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(body),
        });
        return handleResponse(res);
    },

    // Rutas PUT
    put: async (endpoint, body) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(body),
        });
        return handleResponse(res);
    },

    // Rutas DELETE
    delete: async (endpoint) => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(res);
    },
};

export default api;