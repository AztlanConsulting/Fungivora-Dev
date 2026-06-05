import { useState, useEffect, useCallback } from "react";
import { InoculoService } from "../services/detalle-inoculo.service";

const useNotasInoculo = (id_inoculo) => {
    const [notas, setNotas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const getNotas = useCallback(async () => {
        if (!id_inoculo) return;
        
        try {
            setCargando(true);
            const response = await InoculoService.fetchNotasInoculo(id_inoculo);
            setNotas(Array.isArray(response) ? response : (response.data || []));
        } catch (e) {
            console.error("Error cargando las notas del inóculo", e);
            setError("No se pudieron cargar las notas");
        } finally {
            setCargando(false);
        }
    }, [id_inoculo]);

    const postNota = async (datos) => {
        try {
            await InoculoService.postNotaInoculo(datos);
            await getNotas();
        } catch (error) {
            console.error("Error en postNotaInoculo", error);
            throw error;
        }
    };

    useEffect(() => {
        getNotas();
    }, [getNotas]);

    return { notas, cargando, error, postNota };
};

export default useNotasInoculo;