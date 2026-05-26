import api from '../../../shared/utils/api';

const inoculoService = {
    getEspecies: async () => {
        return await api.get("/inoculos/especies");
    },

    getAllEspecies: async () => 
        api.get("/categorias/opciones?categoria=Especies&abreviado=false"),
        
    getDatosInoculo: async (especie, tipoInoculo) =>
        api.get(`/inoculos/filtrado?especie=${especie}&tipo=${tipoInoculo}`),
};

export default inoculoService;