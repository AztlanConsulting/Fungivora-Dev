import api from '../../../shared/utils/api'; // Ajusta la ruta a tu archivo api.js

export const LoteService = {
    /**
     * Obtiene los bloques de un lote específico
     * Endpoint: /bloques/?id_lote=...
     */
    getBloquesByLote: async (id_lote) => {
        return await api.get(`/bloques/?id_lote=${id_lote}`);
    },

    /**
     * Obtiene el código de texto de un inóculo
     * Endpoint: /inoculos/codigo?id_inoculo=...
     */
    getCodigoInoculo: async (id_inoculo) => {
        const data = await api.get(`/inoculos/codigo?id_inoculo=${id_inoculo}`);
        return data.data; // Retornamos solo el string del código
    },

    /**
     * Obtiene el nombre de la especie asociada a un lote
     * Endpoint: /lotes/especie?id_lote=...
     */
    getEspecieByLote: async (id_inoculo) => {
        const data = await api.get(`/inoculos/especie?id_inoculo=${id_inoculo}`);
        return data.data;
    },

    /** WIP
     * Actualización masiva de bloques (ejemplo para actualizar el estado de contaminado)
     * Endpoint: /bloques/masivo (PUT)
    */
    updateBloquesMasivo: async (bloques) => {
        return await api.put(`/bloques/masivo`, { bloques });
    },

    /**
     * Obtiene el detalle de los lotes por id
     * Endpoint: /lotes/detalle?id_lote=...
     */
    getDetalleLote: async (id_lote) => {
        const response = await api.get(`/lotes/detalle?id_lote=${id_lote}`);
        return response.data; 
    },
};