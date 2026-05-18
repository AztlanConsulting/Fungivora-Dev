import { useState, useEffect, useMemo } from 'react';
import inoculoService from '../services/inoculo.service';

/**
 * Reglas de tipos permitidos por destino:
 *
 * Agar          → puede usar: Agar, Medio Líquido, Semilla, Prima
 * Medio Líquido → puede usar: Agar, Medio Líquido
 * Semilla       → puede usar: Agar, Medio Líquido, Semilla
 */
const TIPOS_PERMITIDOS = {
    agar:         ['agar', 'medio liquido', 'semilla', 'prima'],
    medioliquido: ['agar', 'medio liquido'],
    semilla:      ['agar', 'medio liquido', 'semilla'],
};

const normalizar = (texto = '') =>
    texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

/**
 * Obtiene los inóculos disponibles (Agar + Medio Líquido, stock > 0)
 * y los filtra por especie y tipo de destino.
 *
 * @param {string} especie      - Especie seleccionada en el formulario.
 * @param {string} tipoDestino  - Tipo del inóculo destino (ej: 'semilla', 'agar', 'medio liquido').
 * @returns {{ opciones: Array, loading: boolean, error: string|null }}
 */
const useInoculoParaSemilla = (especie, tipoDestino) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carga única al montar — trae todos los disponibles
    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await inoculoService.getInoculosParaSemilla();
                setTodos(data);
            } catch (err) {
                setError('No se pudieron cargar los inóculos disponibles.');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const opciones = useMemo(() => {
        if (!especie || !tipoDestino) return [];

        const tiposValidos = TIPOS_PERMITIDOS[normalizar(tipoDestino)] || [];

        return todos
            .filter((ino) =>
                ino.especie === especie &&
                tiposValidos.includes(normalizar(ino.tipo))
            )
            .map((ino) => ({
                value:     ino.id_inoculo,
                codigo:    ino.codigo_fungivora,
                label:     ino.codigo_fungivora,
                stockBajo: ino.cantidad_disponible <= ino.stock_recomendado,
                raw:       ino,
            }));
    }, [todos, especie, tipoDestino]);

    return { opciones, loading, error };
};

export default useInoculoParaSemilla;