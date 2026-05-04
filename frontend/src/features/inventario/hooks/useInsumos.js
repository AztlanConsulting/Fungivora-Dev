// frontend/src/features/inventario/hooks/useInsumos.js
import { useState, useEffect } from "react";
import inventarioService from "../services/inventario.service";

const useInsumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInsumos = async () => {
            try {
                const json = await inventarioService.getInsumos();

                if (json.success) {
                    setInsumos(json.data);
                } else {
                    setError("No se pudieron cargar los insumos");
                }
            } catch (err) {
                setError("Error de conexión");
            } finally {
                setLoading(false);
            }
        };

        fetchInsumos();
    }, []);

    return { insumos, loading, error };
};

export default useInsumos;