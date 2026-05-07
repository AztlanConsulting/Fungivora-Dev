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

  getSustratos: async () => {
    try {
      const res = await fetch("/api/lotes/sustratos"); // Ruta de sustrato
      if (!res.ok) throw new Error("Error al obtener sustratos");
      return await res.json();
    } catch (error) {
      console.error("Error en getSustratos:", error);
      return []; 
    }
  },

  getUbicaciones: async () => {
    try {
      const res = await fetch("/api/lotes/ubicaciones"); // Ruta de ubicación
      if (!res.ok) throw new Error("Error al obtener ubicaciones");
      return await res.json();
    } catch (error) {
      console.error("Error en getUbicaciones:", error);
      return [];
    }
  },

  addLote: async (datosLote) => {
      try {
        // Ruta para crear
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