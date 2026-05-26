const usuarioService = {
  getUsuarios: async () => {
    try {
      const res = await fetch("/api/usuarios/listar");
      if (!res.ok) throw new Error("Error al obtener la lista de usuarios");
      const json = await res.json();
      return json;
    } catch (error) {
      console.error("Error en getUsuarios:", error);
      throw error;
    }
  },

  addUsuario: async (datosUsuario) => {
    try {
      const res = await fetch("/api/usuarios/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosUsuario),
      });
      return await res.json();
    } catch (error) {
      console.error("Error en addUsuario:", error);
      throw error;
    }
  }
};

export default usuarioService;