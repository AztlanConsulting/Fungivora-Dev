import { useState, useEffect, useCallback } from 'react';
import semillaService from './semillaService';
import { MATRIZ_COMPOSICION } from './types'; // Ajustar el path según tu estructura

export const useSemillaForm = () => {
    const [tamanos, setTamanos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Estados del Formulario ---
    const [formData, setFormData] = useState({
        idEspecie: '',
        idInoculo: '', // El select de Tipo de Inóculo
        idTamaño: '',
        notas: '',
        fechaCreacion: new Date()
    });

    // --- Estados de Composición ---
    const [composicion, setComposicion] = useState({ agua: '', mijo: '', inoculo: '' });
    const [isManualInoculo, setIsManualInoculo] = useState(false);

    // --- Carga Inicial ---
    useEffect(() => {
        const initData = async () => {
            setIsLoading(true);
            try {
                const dataTamanos = await semillaService.getCatalogos();
                setTamanos(dataTamanos);
            } catch (error) {
                console.error("Fallo al inicializar catálogos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        initData();
    }, []);

    // --- Lógica de Autocompletado (Usando types.js) ---
    const recalcularComposicion = useCallback((nuevoTamañoId, nuevoInoculoId) => {
        const nuevaComposicion = { ...composicion };

        // 1. Agua y Mijo (dependen del tamaño)
        if (nuevoTamañoId) {
            const presetTamaño = MATRIZ_COMPOSICION.tamaños[nuevoTamañoId];
            if (presetTamaño) {
                nuevaComposicion.agua = presetTamaño.agua;
                nuevaComposicion.mijo = presetTamaño.mijo;
            }
        }

        // 2. Inóculo (depende de Tamaño y Tipo de Inóculo)
        if (nuevoTamañoId && nuevoInoculoId) {
            const presetInoculo = MATRIZ_COMPOSICION.cantidadesInoculo[nuevoTamañoId]?.[nuevoInoculoId];
            if (presetInoculo !== undefined) {
                nuevaComposicion.inoculo = presetInoculo;
            }
        }

        setComposicion(nuevaComposicion);
        setIsManualInoculo(false); // Reset al cambiar receta
    }, [composicion]);

    // --- Handlers ---
    const handleSelectTamaño = (idTamaño) => {
        setFormData(prev => ({ ...prev, idTamaño }));
        recalcularComposicion(idTamaño, formData.idInoculo);
    };

    const handleSelectInoculo = (idInoculo) => {
        setFormData(prev => ({ ...prev, idInoculo }));
        recalcularComposicion(formData.idTamaño, idInoculo);
    };

    const handleManualInoculoChange = (valor) => {
        setComposicion(prev => ({ ...prev, inoculo: valor }));
        setIsManualInoculo(true);
    };

    // Formateo estricto para asegurar compatibilidad con la base de datos SQL
    const formatearFechaSQL = (dateObj) => {
        if (!dateObj) return '';
        const d = new Date(dateObj);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // --- Envío ---
    const handleSubmit = async () => {
        const payload = {
            ...formData,
            fechaCreacion: formatearFechaSQL(formData.fechaCreacion),
            composicion: { ...composicion }
        };

        try {
            const result = await semillaService.crearSemilla(payload);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error };
        }
    };

    return {
        tamanos,
        formData,
        composicion,
        isManualInoculo,
        isLoading,
        handlers: {
            onTamañoChange: handleSelectTamaño,
            onInoculoChange: handleSelectInoculo,
            onEspecieChange: (idEspecie) => setFormData(prev => ({ ...prev, idEspecie })),
            onNotasChange: (notas) => setFormData(prev => ({ ...prev, notas })),
            onFechaChange: (fecha) => setFormData(prev => ({ ...prev, fechaCreacion: fecha })),
            onManualInoculoChange: handleManualInoculoChange,
            onSubmit: handleSubmit
        }
    };
};