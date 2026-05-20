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
    Registra los datos del form de nuevo inoculo.
    Lanza errores cuyo `.message` es un código conocido
    */
    postInoculo: async (datosInoculo) => {
        let respuesta;
        try {
            respuesta = await fetch('/api/inoculos/crear', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosInoculo),
            });
        } catch {
            throw new Error("FAILED_FETCH");
        }

        let resultado = {};
        try { resultado = await respuesta.json(); } catch { /* body no es JSON */ }

        if (!respuesta.ok || !resultado.success) {
            // El backend envía el código en `message` (ej: "STOCK_INSUFICIENTE").
            throw new Error(resultado.message || "ERROR_SERVIDOR");
        }

        return resultado;
    },

    fetchInoculos: async () => {
        const res = await fetch("/api/inoculos/");
        return await res.json();
        }
}

export default insumosService;