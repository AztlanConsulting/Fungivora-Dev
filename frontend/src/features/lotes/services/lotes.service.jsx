const loteService = {
  getLotes: async () => {
    try {
        // Conexión con la ruta
      const res = await fetch("/api/lotes");
      if (!res.ok) throw new Error("Error al conectar con la API de lotes");
      const json = await res.json();
      return json;
    } catch (error) {
      console.error("Error en lote-service:", error);
      throw error;
    }
  },
};

export default loteService;