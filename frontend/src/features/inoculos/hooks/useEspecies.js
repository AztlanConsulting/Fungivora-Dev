import { useState, useEffect } from "react";
import inoculoService from "../services/inoculo.service";

const useEspecies = () => {
    const [especies, setEspecies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEspecies = async () => {
            try {
                const json = await inoculoService.getEspecies();
                if (json && json.success) {
                    setEspecies(json.data || []);
                } else if (Array.isArray(json)) {
                    setEspecies(json);
                } else {
                    setError("No se pudieron cargar las especies");
                }
            } catch (err) {
                console.error("Error en useEspecies:", err);
                setError("Error de conexión");
            } finally {
                setLoading(false);
            }
        };

        fetchEspecies();
    }, []);

    return { especies, loading, error };
};

export default useEspecies;