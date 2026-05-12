import { useState, useEffect } from 'react';
import { LoteService } from '../services/lote.service';

const useDetalleLote = (id_lote, id_inoculo_usado, faseInicial) => {
    const [bloques, setBloques] = useState([]);
    const [especie, setEspecie] = useState("");
    const [codigoInoculo, setCodigoInoculo] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const fases = [
        { label: "Inoculación" }, { label: "Colonización" }, { label: "Fructificación" },
        { label: "Cosecha 1" }, { label: "Cosecha 2" }, { label: "Finalización" },
    ];
    const faseNum = fases.findIndex(f => f.label === faseInicial);
    const [fase, setFase] = useState(faseNum !== -1 ? faseNum : 0);

    useEffect(() => {
        const fetchData = async () => {
            if (!id_lote) return;
            setCargando(true);
            try {
                const [resBloques, resCodigo, resEspecie] = await Promise.all([
                    LoteService.getBloquesByLote(id_lote),
                    id_inoculo_usado ? LoteService.getCodigoInoculo(id_inoculo_usado) : Promise.resolve("N/A"),
                    id_inoculo_usado ? LoteService.getEspecieByLote(id_inoculo_usado) : Promise.resolve("S/N")
                ]);
                setBloques(resBloques.data || []);
                setCodigoInoculo(resCodigo);
                setEspecie(resEspecie);
            } catch (err) {
                setError(err.message);
                setBloques([]);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, [id_lote, id_inoculo_usado]);

    const getFase = (id_fase) => {
        return fases[id_fase] ? fases[id_fase].label : "Desconocida";
    };

    const guardarCambios = async (bloquesActualizados, nuevaFase) => {
        try {
            const fase = fases[nuevaFase] ? fases[nuevaFase].label : "Inoculación";
            await LoteService.updateFaseLote(id_lote, fase);
            await LoteService.updateBloquesMasivo(id_lote, bloquesActualizados);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return { bloques, setBloques, fase, setFase, especie, codigoInoculo, cargando, error, getFase, guardarCambios, fases };
};

export default useDetalleLote;