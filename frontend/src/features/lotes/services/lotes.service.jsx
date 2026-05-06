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

  addLote: async (datosLote) => {
      try {
        // Ruta unicamente para crear
          const res = await fetch("/api/lotes/crear", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(datosLote),
          });
          return await res.json();
      } catch (error) {
          console.error("Error en datos del lote", error);
          throw error;
      }
  },
};

export default loteService;