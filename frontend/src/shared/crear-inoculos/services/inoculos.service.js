import api from "../../../shared/utils/api";

const insumosService = {
    /*
    Consigue los insumos para los componentes
    Recibe IDs, nombre y cantidad de los insumos
    */
    getMaterialesInsumos: async () => {
        return await api.get("/inoculos/cantidad-ingredientes");
    },

    /*
    Registra los datos del form de nuevo inóculo.
    Lanza errores cuyo `.message` es un código conocido
    */
    postInoculo: async (datosInoculo) => {
        try {
            return await api.post("/inoculos/crear", datosInoculo);
        } catch (error) {
            const backendError = error.response?.data?.message || "ERROR_SERVIDOR";
            throw new Error(backendError);
        }
    },

    fetchInoculos: async () => {
        return await api.get("/inoculos");
    }
};

export default insumosService;