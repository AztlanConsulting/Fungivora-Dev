import { useState, useEffect } from 'react';
import inoculoService from '../services/inoculo.service';

/**
 * Carga la lista de especies disponibles al montar.
 *
 * @returns {{
 *   especies: import('../types/inoculo.types').Especie[],
 *   loading: boolean,
 *   error: string | null
 * }}
 */
const useEspeciesList = () => {
    const [especies, setEspecies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchEspecies = async () => {
            try {
                setLoading(true);
                const response = await inoculoService.getAllEspecies();
                console.log("RESPUESTA CATEGORIAS:", response);
                const lista = (response?.data ?? []).map((item) => ({
                    value: item.opcion,
                    label: item.opcion,
                }));
                if (!cancelled) setEspecies(lista);
            } catch (err) {
                if (!cancelled) setError(err?.message ?? 'Error al cargar especies');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchEspecies();
        return () => { cancelled = true; };
    }, []);

    return { especies, loading, error };
};

export default useEspeciesList;