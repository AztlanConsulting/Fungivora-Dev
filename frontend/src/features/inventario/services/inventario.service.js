// frontend/src/features/inventario/services/inventario.service.js

const inventarioService = {
    getInsumos: async () => {
        const res = await fetch("/api/inventario");
        const json = await res.json();
        return json;
    },
};

export default inventarioService;