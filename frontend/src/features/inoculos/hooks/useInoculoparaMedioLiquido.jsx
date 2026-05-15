import { useState, useEffect } from 'react';
import inoculoService from '../services/inoculo.service';

/*
* useInoculoParaMedioLiquido
Obtiene los inóculos disponibles para ser usados como madre
en la preparación de un Medio Líquido.
Solo se permiten inóculos de tipo Agar con stock > 0,
filtrados por la especie seleccionada en el formulario.
@param {string} especie - Valor del campo especie del formulario
@returns {{ opciones: Array, loading: boolean, error: string|null }}
*/
const useInoculoParaMedioLiquido = (especie) => {
    const [todos,   setTodos]   = useState([]);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    // Carga única al montar — trae todos los disponibles
    useEffect(() => {
        const cargar = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await inoculoService.getInoculosParaSemilla();
                // Filtra solo Agar desde el origen
                const soloAgar = data.filter(
                    (ino) => ino.tipo?.toLowerCase().includes("agar")
                );
                setTodos(soloAgar);
            } catch (err) {
                setError('No se pudieron cargar los inóculos disponibles.');
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    // Filtra en cliente por la especie seleccionada
    const opciones = especie
        ? todos
            .filter((ino) => ino.especie === especie)
            .map((ino) => ({
                value:     ino.id_inoculo,
                codigo:    ino.codigo_fungivora,
                label:     ino.codigo_fungivora,
                stockBajo: ino.cantidad_disponible <= ino.stock_recomendado,
                raw:       ino,
            }))
        : [];

    return { opciones, loading, error };
};

export default useInoculoParaMedioLiquido;