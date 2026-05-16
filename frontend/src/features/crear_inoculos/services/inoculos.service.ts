import { RegistroSemilla } from "../types/inoculos.type"

const insumosService = {
    /*
    Consigue los insumos para los compoentes
    Recibe IDs, nombre y cantidad de los insumos
    */
    getMaterialesInsumos: async () => {
        const res = await fetch("/api/inoculos/cantidad-ingredientes");
        return await res.json();
    },

    /*
    Registra los datos del form de nueva semilla
    TODO: Esto se puede adaptar a que sea un molde global para todos los crear
    El molde se ecnuentra en feature/crear_inoculo/semilla/services/inculos.type.ts
    */
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