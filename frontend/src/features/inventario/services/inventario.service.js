import api from "../../../shared/utils/api";

const inventarioService = {
    getInsumos: async () => {
        try {
            return await api.get("/inventario");
        } catch (error) {
            console.error("Error al obtener insumos:", error);
            throw error;
        }
    },

    crearInsumo: async (nuevoInsumo) => {
        try {
            return await api.post("/inventario/crear-insumo", nuevoInsumo);
        } catch (error) {
            console.error("Error al crear insumo:", error);
            throw error;
        }
    },
    
    actualizarInsumo: async (id_insumo, datos) => {
        try {
            return await api.post("/inventario/update-cantidad", { 
                id_insumo, 
                cantidad: datos.cantidad 
            });
        } catch (error) {
            console.error("Error al actualizar insumo:", error);
            throw error;
        }
    },

    editarInsumo: async (id_insumo, datos) => {
    const res = await fetch(`/api/inventario/editar-insumo/${id_insumo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
    });
    return await res.json();
    },

    actualizarInoculo: async (id_inoculo, datos) => {
        try {
            return await api.post("/inventario/update-inoculo", { 
                id_inoculo, 
                cantidad: datos.cantidad 
            });
        } catch (error) {
            console.error("Error al actualizar inoculo:", error);
            throw error;
        }
    },
};

export default inventarioService;