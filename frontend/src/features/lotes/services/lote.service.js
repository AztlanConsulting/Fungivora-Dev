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
        console.log("LoteService.getCodigoInoculo llamado con id_inoculo:", id_inoculo);
        const data = await api.get(`/inoculos/codigo?id_inoculo=${id_inoculo}`);
        console.log("Respuesta de getCodigoInoculo:", data);
        return data.data; // Retornamos solo el string del código
    },

    /** WIP
     * Actualización masiva de bloques (ejemplo para actualizar el estado de contaminado)
     * Endpoint: /bloques/masivo (PUT)
    */
    updateBloquesMasivo: async (bloques) => {
        return await api.put(`/bloques/masivo`, { bloques });
    }
};