import { useState, useEffect, useMemo } from 'react';
<<<<<<< HEAD:frontend/src/features/inoculos/hooks/useInoculoprarasemillas.jsx
import inoculoService from '../services/inoculo.service';
=======
import insumosService from '../services/inoculos.service';
>>>>>>> ffbb6870b59ca268f2d7d260684bd7dc9c493efc:frontend/src/shared/crear-inoculos/hooks/useInoculo.js

/**
 * Reglas de tipos permitidos por destino:
 *
<<<<<<< HEAD:frontend/src/features/inoculos/hooks/useInoculoprarasemillas.jsx
 * Agar          → puede usar: Agar, Medio Líquido, Semilla, Prima
=======
 * Agar     → puede usar: Agar, Medio Líquido, Semilla, Tejido Vivo, Sello de Esporas, Esporas Suspendidas
>>>>>>> ffbb6870b59ca268f2d7d260684bd7dc9c493efc:frontend/src/shared/crear-inoculos/hooks/useInoculo.js
 * Medio Líquido → puede usar: Agar, Medio Líquido
 * Semilla       → puede usar: Agar, Medio Líquido, Semilla
 */
const TIPOS_PERMITIDOS = {
    agar: ['agar', 'medio liquido', 'semilla', 'tejido vivo', 'sello de esporas', 'esporas suspendidas'],
    medioliquido: ['agar', 'medio liquido'],
    semilla: ['agar', 'medio liquido', 'semilla'],
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
const useInoculo = (especie, tipoDestino) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Carga única al montar — trae todos los disponibles
    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            setError(null);
            try {
<<<<<<< HEAD:frontend/src/features/inoculos/hooks/useInoculoprarasemillas.jsx
                const data = await inoculoService.getInoculosParaSemilla();
                setTodos(data);
=======
                const data = await insumosService.fetchInoculos();
                setTodos(data.data || []);
>>>>>>> ffbb6870b59ca268f2d7d260684bd7dc9c493efc:frontend/src/shared/crear-inoculos/hooks/useInoculo.js
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
                ino.cantidad_disponible > 0 &&
                tiposValidos.includes(normalizar(ino.tipo))
            )
            .map((ino) => ({
<<<<<<< HEAD:frontend/src/features/inoculos/hooks/useInoculoprarasemillas.jsx
                value:     ino.id_inoculo,
                codigo:    ino.codigo_fungivora,
                label:     ino.codigo_fungivora,
=======
                value: ino.id_inoculo,
                codigo: ino.codigo_fungivora,
                label: `${ino.codigo_fungivora} - (${ino.cantidad_disponible} ${ino.unidad})`,
>>>>>>> ffbb6870b59ca268f2d7d260684bd7dc9c493efc:frontend/src/shared/crear-inoculos/hooks/useInoculo.js
                stockBajo: ino.cantidad_disponible <= ino.stock_recomendado,
                raw:       ino,
            }));
    }, [todos, especie, tipoDestino]);

    return { opciones, loading, error };
};

export default useInoculo;