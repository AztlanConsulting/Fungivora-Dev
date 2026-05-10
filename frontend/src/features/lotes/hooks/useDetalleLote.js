import { useState, useEffect } from 'react';
import { LoteService } from '../services/lote.service';

const useDetalleLote = (id_lote, id_inoculo_usado) => {
    const [bloques, setBloques] = useState([]);
    const [codigoInoculo, setCodigoInoculo] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id_lote) return;
            setCargando(true);
            try {
                const [resBloques, resCodigo] = await Promise.all([
                    LoteService.getBloquesByLote(id_lote),
                    id_inoculo_usado ? LoteService.getCodigoInoculo(id_inoculo_usado) : Promise.resolve("N/A")
                ]);
                setBloques(resBloques.data || []);
                setCodigoInoculo(resCodigo);
            } catch (err) {
                setError(err.message);
                setBloques([]);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, [id_lote, id_inoculo_usado]);

    const guardarCambios = async (bloquesActualizados) => {
        try {
            await LoteService.updateBloquesMasivo(bloquesActualizados);
            setBloques(bloquesActualizados);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return { bloques, setBloques, codigoInoculo, cargando, error, guardarCambios };
};

export default useDetalleLote;