import { useState, useEffect } from 'react';
import { LoteService } from '../services/lote.service';

const useDetalleLote = (id_lote, id_inoculo_usado) => {
    const [bloques, setBloques] = useState([]);
    const [especie, setEspecie] = useState("");
    const [codigoInoculo, setCodigoInoculo] = useState("");
    const [codigoLoteBD, setCodigoLoteBD] = useState(null); 
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id_lote) return;
            console.log("ID del lote recibido en el hook:", id_lote);
            setCargando(true);
            try {
                const [resBloques, resCodigo, resEspecie] = await Promise.all([
                    LoteService.getBloquesByLote(id_lote),
                    id_inoculo_usado ? LoteService.getCodigoInoculo(id_inoculo_usado) : Promise.resolve("N/A"),
                    id_inoculo_usado ? LoteService.getEspecieByLote(id_inoculo_usado) : Promise.resolve("S/N")
                ]);

                // Obtener todos los datos de los bloques y lote
                const listaObtenida = resBloques.data || [];
                
                setBloques(listaObtenida);
                setCodigoInoculo(resCodigo);
                setEspecie(resEspecie);
                    if (listaObtenida.length > 0) {
                        const codigoEncontrado = listaObtenida[0].codigo_lote || "LC-DESCONOCIDO-000000"; 
                        setCodigoLoteBD(codigoEncontrado);
                    }

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
    
    return { 
        bloques, 
        setBloques, 
        especie, 
        codigoInoculo, 
        codigoLoteBD, 
        cargando, 
        error, 
        guardarCambios 
    };
};

export default useDetalleLote;