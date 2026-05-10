const insumosService = {
    getMaterialesInsumos: async () => {
        const res = await fetch("/api/inoculos/cantidad-ingredientes");
        return await res.json();
    }
}

export default insumosService;