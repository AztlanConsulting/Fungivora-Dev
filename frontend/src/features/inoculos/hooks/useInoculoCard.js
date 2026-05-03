import { useState, useEffect, useCallback } from 'react';
import inoculoService from '../services/inoculo.service';
import { TIPO_INOCULO_DEFAULT } from '../types/inoculo.types';

/**
 * Maneja el estado de una card de especie:
 * - tipo de inóculo seleccionado
 * - datos de la tabla
 * - estado colapsado/expandido
 *
 * @param {string} especie - Identificador de la especie
 * @returns {{
 *   tipoSeleccionado: string,
 *   datos: import('../types/inoculo.types').DatoInoculo[],
 *   loading: boolean,
 *   error: string | null,
 *   collapsed: boolean,
 *   handleTipoChange: (tipo: string) => void,
 *   toggleCollapse: () => void,
 * }}
 */
const useInoculoCard = (especie) => {
    const [tipoSeleccionado, setTipoSeleccionado] = useState(TIPO_INOCULO_DEFAULT);
    const [datos, setDatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    const fetchDatos = useCallback(async (tipo) => {
        try {
            setLoading(true);
            setError(null);
            const response = await inoculoService.getDatosInoculo(especie, tipo);
            setDatos(response?.data ?? []);
        } catch (err) {
            setError(err?.message ?? 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    }, [especie]);

    // Carga inicial y cada vez que cambia el tipo
    useEffect(() => {
        fetchDatos(tipoSeleccionado);
    }, [tipoSeleccionado, fetchDatos]);

    const handleTipoChange = (tipo) => setTipoSeleccionado(tipo);
    const toggleCollapse = () => setCollapsed((prev) => !prev);

    return {
        tipoSeleccionado,
        datos,
        loading,
        error,
        collapsed,
        handleTipoChange,
        toggleCollapse,
    };
};

export default useInoculoCard;