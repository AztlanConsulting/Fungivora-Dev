const insumosService = {
    getMaterialesInsumos: async () => {
        const res = await fetch("/api/inoculos/cantidad-ingredientes");
        return await res.json();
    },

    crearInoculo: async (body) => {
        const res = await fetch("/api/inoculos/crear", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        });
        return await res.json();
    },
};

export default insumosService;