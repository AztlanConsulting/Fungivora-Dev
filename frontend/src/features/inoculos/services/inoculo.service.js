import api from '../../../shared/utils/api'

const inoculoService = {
    getEspecies: async () => {
        const res = await fetch("/api/inoculos/especies");
        const json = await res.json();
        return json;
    },

    getAllEspecies: async () => api.get("/categorias/opciones?categoria=Especies&abreviado=false"),
    getDatosInoculo: async (especie, tipoInoculo) =>
        api.get(`/inoculos/filtrado?especie=${especie}&tipo=${tipoInoculo}`),
};

export default inoculoService;
