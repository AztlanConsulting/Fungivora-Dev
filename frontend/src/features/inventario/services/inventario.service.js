
const inventarioService = {
    getInsumos: async () => {
        const res = await fetch("/api/inventario");
        return await res.json();
    },

    crearInsumo: async (nuevoInsumo) => {
        const res = await fetch("/api/inventario/crear-insumo", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoInsumo),
        });
        return await res.json();
    },
    
    actualizarInsumo: async (id_insumo, datos) => {
        const res = await fetch("/api/inventario/update-cantidad", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_insumo, cantidad: datos.cantidad }), 
        });
        return await res.json();
    },

    editarInsumo: async (id_insumo, datos) => {
    const res = await fetch(`/api/inventario/editar-insumo/${id_insumo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    return await res.json();
    },

};

export default inventarioService;