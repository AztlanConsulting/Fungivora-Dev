import api from "../../../shared/utils/api"; 

const bloqueService = {
  // Obtener contenedores
  getContenedores: async () => {
    try {
      return await api.get("/bloques/contenedores");
    } catch (error) {
      console.error("Error en getContenedores:", error);
      return [];
    }
  },

  // Guardar lotes con los bloques
  registrarTodo: async (datosLote, listaBloques) => {
    try {
      const dataLote = await api.post("/lotes/crear", datosLote);

      if (!dataLote.success) throw new Error("Error al crear el lote");

      return await api.post("/bloques/crear", {
        id_lote: dataLote.id,
        bloques: listaBloques 
      });
    } catch (error) {
      console.error("Error en registrarTodo:", error);
      throw error;
    }
  }
};

export default bloqueService;