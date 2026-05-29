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
  },

  deleteUsuario: async (id_usuario) => {
      try {
          return await api.post("/usuarios/eliminar", { id_usuario }); 
      } catch (error) {
          console.error("Error en deleteUsuario:", error);
          throw error;
      }
  }
};

export default usuarioService;