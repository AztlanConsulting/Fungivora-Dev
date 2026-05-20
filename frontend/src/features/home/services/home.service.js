import api from '../../../shared/utils/api';

const homeService = {
    fetchDashboard: () => api.get("/dashboard"),

    revisarLotes: (ids) => api.put("/lotes/revision", { ids })
};

export default homeService;