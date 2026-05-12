// frontend/src/features/inoculos/hooks/useInoculoParaSemilla.js
import { useState, useEffect } from 'react';
import { fetchInoculosParaSemilla } from '../services/inoculo.service';

/**
 * Obtiene los inóculos disponibles (Agar + Medio Líquido, stock > 0)
 * y los filtra por la especie que el usuario haya seleccionado en el form.
 *
 * @param {string} especie - Valor del campo especie del formulario.
 * @returns {{ opciones: Array, loading: boolean, error: string|null }}
 */
const useInoculoParaSemilla = (especie) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carga única al montar — trae todos los disponibles
    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchInoculosParaSemilla();
                setTodos(data);
            } catch (err) {
                setError('No se pudieron cargar los inóculos disponibles.');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    // Filtra en cliente por la especie seleccionada en el formulario
    const opciones = especie
        ? todos
            .filter((ino) => ino.especie === especie)
            .map((ino) => ({
                value: ino.id_inoculo,
                label: ino.codigo_fungivora,
                stockBajo: ino.cantidad_disponible <= ino.stock_recomendado,
                raw: ino,
            }))
        : [];

    return { opciones, loading, error };
};

export default useInoculoParaSemilla;