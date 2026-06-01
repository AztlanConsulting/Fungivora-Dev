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
            setError("No se pudieron conseguir las notas");
        } finally {
            setCargando(false);
        }
    };

    const postNota = async (datos) => {
        try {
            await bloqueService.postNota(datos);
            await getNotas();
        } catch (error) {
            console.error("Error en postNota", error);
            throw error;
        }
    };

    useEffect(() => {
        if (!id_bloque) return;
        getNotas();
    }, [id_bloque]);

    return { notas, cargando, error, postNota };
};

export default useNotasBloques;