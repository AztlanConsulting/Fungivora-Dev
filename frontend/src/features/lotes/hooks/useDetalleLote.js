import { useState, useEffect } from 'react';
import { LoteService } from '../services/lote.service';

const useDetalleLote = (id_lote, id_inoculo_usado) => {
    const [bloques, setBloques] = useState([]);
    const [especie, setEspecie] = useState("");
    const [codigoInoculo, setCodigoInoculo] = useState("");
    const [codigoLoteBD, setCodigoLoteBD] = useState(null); // Para guardar el código real
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

                // 1. Definimos la variable 'lista' para poder usarla
                const listaObtenida = resBloques.data || [];

                console.log("Datos de bloques recibidos:", listaObtenida);
                
                setBloques(listaObtenida);
                setCodigoInoculo(resCodigo);
                setEspecie(resEspecie);

                // 2. Extraemos el código del lote del primer bloque encontrado
                // Asegúrate que tu API devuelva 'codigo_lote' en el objeto del bloque
                // Dentro del useEffect del hook, cuando recibes los datos:
                    if (listaObtenida.length > 0) {
                        // Busca cómo se llama el campo en tu BD. Si no viene, 
                        // asegúrate que LoteService.getBloquesByLote lo incluya en el JOIN de la consulta SQL.
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

    // 3. ¡IMPORTANTE! Debes retornar codigoLoteBD para que el componente lo vea
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