import { useState, useEffect } from 'react';
import { LoteService } from '../services/lote.service';

const useDetalleLote = (id_lote, id_inoculo_usado, faseInicial) => {
    const [bloques, setBloques] = useState([]);
    const [bloquesIniciales, setBloquesIniciales] = useState([]);
    const [especie, setEspecie] = useState("");
    const [codigoInoculo, setCodigoInoculo] = useState("");
    const [codigoLoteBD, setCodigoLoteBD] = useState(null); 
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const fases = [
        { label: "Inoculación" }, { label: "Colonización" }, { label: "Fructificación" },
        { label: "Cosecha 1" }, { label: "Cosecha 2" }, { label: "Finalización" },
    ];
    const faseNum = fases.findIndex(f => f.label === faseInicial);
    const [fase, setFase] = useState(faseNum !== -1 ? faseNum : 0);
    const [faseInicialNum, setFaseInicialNum] = useState(faseNum !== -1 ? faseNum : 0);

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
                setBloquesIniciales(resBloques.data || []);
                setCodigoInoculo(resCodigo);
                setEspecie(resEspecie);
                    if (listaObtenida.length > 0) {
                        const codigoEncontrado = listaObtenida[0].codigo_lote || "LC-DESCONOCIDO-000000"; 
                        setCodigoLoteBD(codigoEncontrado);
                    }

            } catch (err) {
                setError(err.message);
                setBloques([]);
                setBloquesIniciales([]);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, [id_lote, id_inoculo_usado]);

    const getFase = (id_fase) => {
        return fases[id_fase] ? fases[id_fase].label : "Desconocida";
    };

    const guardarCambios = async (bloquesActualizados, nuevaFaseIndex) => {
        try {

            const nombreFase = fases[nuevaFaseIndex] ? fases[nuevaFaseIndex].label : "Inoculación";

            await LoteService.updateFaseLote(id_lote, nombreFase);
            
            await LoteService.updateBloquesMasivo(id_lote, bloquesActualizados);
            
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return {
        bloques, setBloques, bloquesIniciales, setBloquesIniciales,
        fase, setFase, faseInicialNum, setFaseInicialNum,
        especie, codigoInoculo, codigoLoteBD, 
        cargando, error, getFase, guardarCambios,
        fases
    };
};

export default useDetalleLote;