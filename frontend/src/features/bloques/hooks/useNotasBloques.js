import { useState, useEffect } from "react";
import bloqueService from "../services/bloques.service";

const useNotasBloques = (id_bloque) => {
    const [notas, setNotas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const getNotas = async () => {
        try {
            setCargando(true);
            const datos = await bloqueService.fetchNotas(id_bloque);
            const lista = Array.isArray(datos) ? datos : (datos.datos || []);
            setNotas(lista);
        } catch (e) {
            console.error("Error cargando las notas del bloque", e);
            setError("No se pudieron conseguit las notas");
        } finally {
            setCargando(false);
        }
    };

    
    useEffect(() => {
        if (!id_bloque) return;
        getNotas();
    }, [id_bloque]);

    return { notas, cargando, error };
};

export default useNotasBloques;