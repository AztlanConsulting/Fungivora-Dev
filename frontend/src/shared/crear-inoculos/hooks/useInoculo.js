import { useState, useEffect, useMemo } from 'react';
import insumosService from '../services/inoculos.service';

const TIPOS_PERMITIDOS = {
    agar: ['agar', 'medio liquido', 'semilla', 'tejido vivo', 'sello de esporas', 'esporas suspendidas'],
    medioliquido: ['agar', 'medio liquido'],
    semilla: ['agar', 'medio liquido', 'semilla'],
};

const normalizar = (texto = '') =>
    (texto || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

/**
 * Obtiene los inóculos disponibles (Agar + Medio Líquido, stock > 0)
 * y los filtra por especie y tipo de destino.
 */
const useInoculo = (especie, tipoDestino) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargar = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            setLoading(true);
            setError(null);
            try {
                const data = await insumosService.fetchInoculos();
                if (data && data.success) {
                    setTodos(data.data || []);
                } else if (Array.isArray(data)) {
                    setTodos(data);
                } else if (data && Array.isArray(data.data)) {
                    setTodos(data.data);
                } else {
                    setTodos([]);
                }
            } catch (err) {
                console.error("Error en useInoculo hook:", err);
                setError('No se pudieron cargar los inóculos disponibles.');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const opciones = useMemo(() => {
        if (!especie || !tipoDestino || !Array.isArray(todos)) return [];

        const tiposValidos = TIPOS_PERMITIDOS[normalizar(tipoDestino)] || [];

        return todos
            .filter((ino) =>
                ino &&
                ino.especie === especie &&
                ino.cantidad_disponible > 0 &&
                tiposValidos.includes(normalizar(ino.tipo))
            )
            .map((ino) => ({
                value: ino.id_inoculo,
                codigo: ino.codigo_fungivora,
                label: `${ino.codigo_fungivora} - (${ino.cantidad_disponible} ${ino.unidad || 'ml'})`,
                stockBajo: ino.cantidad_disponible <= (ino.stock_recomendado || 0),
                raw: ino,
            }));
    }, [todos, especie, tipoDestino]);

    return { opciones, loading, error };
};

export default useInoculo;