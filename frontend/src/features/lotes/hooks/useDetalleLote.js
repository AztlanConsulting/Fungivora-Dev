import { useState, useEffect } from 'react';
import { LoteService } from '../services/lote.service';

const useDetalleLote = (id_lote, faseInicial) => {
    const [bloques, setBloques] = useState([]);
    const [bloquesIniciales, setBloquesIniciales] = useState([]);
    const [especie, setEspecie] = useState("");
    const [codigoInoculo, setCodigoInoculo] = useState(null); 
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const fases = [
        { label: "Inoculación" }, { label: "Colonización" }, { label: "Fructificación" },
        { label: "Cosecha 1" }, { label: "Cosecha 2" }, { label: "Finalización" },
    ];

    const [fase, setFase] = useState(0);
    const [faseInicialNum, setFaseInicialNum] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!id_lote) return;
            setCargando(true);
            try {
                const [resBloques, dataLote] = await Promise.all([
                    LoteService.getBloquesByLote(id_lote),
                    LoteService.getDetalleLote(id_lote)
                ]);

                const listaObtenida = resBloques.data || [];
                const faseActualLote = dataLote?.fase || faseInicial; 

                if (listaObtenida.length > 0) {
                    setBloques(listaObtenida);
                    setBloquesIniciales(listaObtenida.map(b => ({ ...b })));
                    setCodigoInoculo(listaObtenida[0].codigo_lote);
                    setEspecie(listaObtenida[0].especie_nombre || "S/N");
                }

                const indexFase = fases.findIndex(f => f.label === faseActualLote);
                const valorFase = indexFase !== -1 ? indexFase : 0;
                
                setFase(valorFase);
                setFaseInicialNum(valorFase);

            } catch (err) {
                console.error("Error en fetchData:", err);
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, [id_lote]);

    const getFase = (id_fase) => {
        return fases[id_fase] ? fases[id_fase].label : "Desconocida";
    };

    const guardarCambios = async (bloquesActualizados, nuevaFaseIndex) => {
        setCargando(true); 
        try {
            const nombreFase = fases[nuevaFaseIndex]?.label || "Inoculación";
            await Promise.all([
                LoteService.updateFaseLote(id_lote, nombreFase),
                LoteService.updateBloquesMasivo(id_lote, bloquesActualizados)
            ]);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        } finally {
            setCargando(false);
        }
    };

    return {
        bloques, setBloques, bloquesIniciales, setBloquesIniciales,
        fase, setFase, faseInicialNum, setFaseInicialNum,
        especie, codigoInoculo,         
        cargando, error, getFase, guardarCambios,
        fases
    };
};

export default useDetalleLote;