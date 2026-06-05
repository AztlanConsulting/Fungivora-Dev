import api from '../../../shared/utils/api'; 

export const InoculoService = {
    /**
     * Obtiene el detalle de un inóculo por su ID
     * Endpoint: /inoculos/detalle?id_inoculo=...
     */
    getDetalleInoculo: async (id_inoculo) => {
        const response = await api.get(`/inoculos/detalle?id_inoculo=${id_inoculo}`);
        return response.data;
    },

    getAllInoculos: async () => {
        const response = await api.get('/inoculos/');
        return response.data;
    },

    // Obtener notas de un inóculo
    fetchNotasInoculo: async (id_inoculo) => {
        const response = await api.get(`/inoculos/notas/${id_inoculo}`);
        return response.data;
    },

    // Registrar una nota nueva
    postNotaInoculo: async (datos) => {
        const response = await api.post("/inoculos/notas/crear", datos);
        return response.data;
    }
};