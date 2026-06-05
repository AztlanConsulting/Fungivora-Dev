import { useState, useEffect } from 'react';
import { InoculoService } from '../services/detalle-inoculo.service';
import { traducirError } from '../../../shared/utils/traducirError';

const useDetalleInoculo = (id_inoculo) => {
    const [inoculo, setInoculo] = useState(null);
    const [ingredientes, setIngredientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInoculoData = async () => {
            if (!id_inoculo) {
                setCargando(false);
                return;
            }

            setCargando(true);
            setError(null);
            
            try {
                const data = await InoculoService.getDetalleInoculo(id_inoculo);
                
                setInoculo(data);
                setIngredientes(data.ingredientes || []); 
                
            } catch (err) {
                console.error("Error en fetchInoculoData:", err);
                setError(traducirError(err).mensaje);
            } finally {
                setCargando(false);
            }
        };

        fetchInoculoData();
    }, [id_inoculo]);

    return {
        inoculo,
        ingredientes,
        cargando,
        error
    };
};

export default useDetalleInoculo;