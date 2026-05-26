import api from "../../../shared/utils/api";

const loteService = {
  getLotes: async () => {
    try {
      return await api.get("/lotes");
    } catch (error) {
      console.error("Error en lote-service:", error);
      throw error;
    }
  },

  getUbicaciones: async () => {
    try {
      return await api.get("/lotes/ubicaciones");
    } catch (error) {
      console.error("Error en getUbicaciones:", error);
      return [];
    }
  },

  getEspecies: async () => {
    try {
      return await api.get("/lotes/especies");
    } catch (error) {
      console.error("Error en getEspecies:", error);
      return [];
    }
  },

  addLote: async (datosLote) => {
    try {
      return await api.post("/lotes/crear", datosLote);
    } catch (error) {
      console.error("Error en datos del lote", error);
      throw error;
    }
  },

  deleteLote: async (id_lote) => {
    try {
      return await api.delete(`/lotes/${id_lote}`);
    } catch (error) {
      console.error("Error al eliminar lote:", error);
      throw error;
    }
  },
};

export default loteService;