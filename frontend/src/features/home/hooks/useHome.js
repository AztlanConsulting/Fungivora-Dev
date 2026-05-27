import { useEffect, useState } from 'react';
import homeService from '../services/home.service';
import { traducirError } from '../../../shared/utils/traducirError';

const useHome = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const obtenerDashboard = async () => {
        try {
            setLoading(true);
            const data = await homeService.fetchDashboard();
            setDashboard(data);
        } catch (err) {
            console.error('Error obteniendo dashboard:', err);
            setError(traducirError(err).mensaje);
        } finally {
            setLoading(false);
        }
    };

    const revisarLotesSeleccionados = async (ids) => {
        try {
            await homeService.revisarLotes(ids);
            await obtenerDashboard();
        } catch (err) {
            console.error('Error revisando lotes:', err);
            throw err;
        }
    };

    useEffect(() => {
        obtenerDashboard();
    }, []);

    return {
        dashboard,
        loading,
        error,
        refetch: obtenerDashboard,
        revisarLotes: revisarLotesSeleccionados
    };
};

export default useHome;