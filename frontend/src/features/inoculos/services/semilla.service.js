import api from '../../../shared/utils/api';

const semillaService = {
    getCatalogos: async () => api.get("/catalogos/tamanos"),
};

export default semillaService;