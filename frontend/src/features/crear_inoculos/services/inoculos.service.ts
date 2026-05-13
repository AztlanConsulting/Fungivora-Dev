import { RegistroSemilla } from "../types/inoculos.type"

const insumosService = {
    getMaterialesInsumos: async () => {
        const res = await fetch("/api/inoculos/cantidad-ingredientes");
        return await res.json();
    },

    postSemilla: async (datosSemilla: RegistroSemilla) => {
        try {
            const respuesta = await fetch('/api/inoculos/crear', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosSemilla),
            });

            const resultado = await respuesta.json();

            if (!resultado.success) {
                throw new Error(resultado.message || "Error al crear el lote");
            }

            return resultado;
        } catch (error) {
            console.error("Error en registrar semilla:", error);
            throw error;
        }
    }
}

export default insumosService;