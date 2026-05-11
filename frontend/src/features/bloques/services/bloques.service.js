const bloqueService = {
  // Obtener tipos de contenedores desde categorías
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

  // Guardar todo el conjunto (Lote + Bloques)
  // Nota: Aquí podrías enviar ambos en una sola petición si tu backend lo soporta
  registrarTodo: async (datosLote, listaBloques) => {
    try {
      // 1. Creamos el lote primero
      const resLote = await fetch("/api/lotes/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosLote),
      });
      const dataLote = await resLote.json();

      if (!dataLote.success) throw new Error("Error al crear el lote");

      // 2. Creamos los bloques usando el ID que nos devolvió el lote
      const resBloques = await fetch("/api/bloques/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_lote: dataLote.id, // El UUID generado en el backend
          ...listaBloques // Aquí enviamos la info agrupada
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