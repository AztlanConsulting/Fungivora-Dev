import api from '../../../shared/utils/api';

const inoculoService = {

    getEspecies: async () => api.get('/inoculos/especies'),

    getAllEspecies: async () => api.get('/categorias/opciones?categoria=Especies&abreviado=false'),

    getDatosInoculo: async (especie, tipoInoculo) =>
        api.get(`/inoculos/filtrado?especie=${especie}&tipo=${tipoInoculo}`),

    getInoculosParaSemilla: async () => {
        const res = await api.get('/inoculos/semilla');
        return res.data;
    },

};

export default inoculoService;