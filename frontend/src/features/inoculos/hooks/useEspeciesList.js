import { useState, useEffect } from 'react';
import inoculoService from '../services/inoculo.service';

const useEspeciesList = () => {
    const [especies, setEspecies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const fetchEspecies = async () => {
            try {
                setLoading(true);

                // Trae todas las especies de Categorias y las que tienen registros en Inoculos
                const [resCategorias, resInoculos] = await Promise.all([
                    inoculoService.getAllEspecies(),
                    inoculoService.getEspecies(),
                ]);
                console.log("CATEGORIAS:", resCategorias?.data);
                console.log("INOCULOS:", resInoculos?.data);

                // Arma un Set con los nombres que tienen inóculos reales
                const conRegistros = new Set(
                    (resInoculos?.data ?? resInoculos ?? []).map((item) => item.especie)
                );

                // Solo muestra las especies de Categorias que también tienen registros
                const lista = (resCategorias?.data ?? [])
                .filter((item) => conRegistros.has(item.opcion)) 
                .map((item) => ({
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