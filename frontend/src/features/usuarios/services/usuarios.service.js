import api from "../../../shared/utils/api"; 
const usuarioService = {
  getUsuarios: async () => {
    try {
      return await api.get("/usuarios/listar"); 
    } catch (error) {
      console.error("Error en getUsuarios:", error);
      throw error;
    }
  },

  addUsuario: async (datosUsuario) => {
    try {
      return await api.post("/usuarios/crear", datosUsuario);
    } catch (error) {
      console.error("Error en addUsuario:", error);
      throw error;
    }
  }
};

export default usuarioService;