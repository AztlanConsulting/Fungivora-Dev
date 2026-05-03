const inoculoService = {
    getEspecies: async () => {
        const res = await fetch("/api/inoculos/especies");
        const json = await res.json();
        return json;
    },
};
 
export default inoculoService;
 