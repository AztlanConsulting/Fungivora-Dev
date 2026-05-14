const bloqueService = {
  // Obtener contenedores
  getContenedores: async () => {
    try {
      const res = await fetch("/api/bloques/contenedores");
      if (!res.ok) throw new Error("Error al obtener contenedores");
      return await res.json();
    } catch (error) {
      console.error("Error en getContenedores:", error);
      return [];
    }
  },

  // Guardar lotes con los bloques
  registrarTodo: async (datosLote, listaBloques) => {
    try {
      // Crear lote
      const resLote = await fetch("/api/lotes/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosLote),
      });
      const dataLote = await resLote.json();

      if (!dataLote.success) throw new Error("Error al crear el lote");

      // Crear bloques
      const resBloques = await fetch("/api/bloques/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_lote: dataLote.id,
          ...listaBloques 
        }),
      });

      return await resBloques.json();
    } catch (error) {
      console.error("Error en registrarTodo:", error);
      throw error;
    }
  }
};

export default bloqueService;