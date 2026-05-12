import { useState, useEffect, useCallback } from "react"; 
import loteService from "../services/lotes.service";

const useLotes = () => {
    const [datos, setDatos] = useState([]);
    const [sustratos, setSustratos] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [especiesDisponibles, setEspeciesDisponibles] = useState([]); 
    const [inoculosRaw, setInoculosRaw] = useState([]);

    const fetchLotes = useCallback(async () => {
        try {
            const json = await loteService.getLotes();
            if (json.success) {
                setDatos(json.data);
                setError(null);
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setCargando(false);
        }
    }, []);

    const cargarCatalogos = useCallback(async () => {
        try {
            const [resSus, resUbi, resEsp] = await Promise.all([
                fetch('/api/lotes/sustratos'),
                fetch('/api/lotes/ubicaciones'),
                fetch('/api/lotes/especies')
            ]);

            const [dataSus, dataUbi, jsonEsp] = await Promise.all([
                resSus.json(),
                resUbi.json(),
                resEsp.json()
            ]);

            // Procesar Sustratos
            const listSus = Array.isArray(dataSus) ? dataSus : (dataSus.data || []);
            setSustratos(listSus.map(s => ({ value: s.opcion, label: s.opcion })));

            // Procesar Ubicaciones
            const listUbi = Array.isArray(dataUbi) ? dataUbi : (dataUbi.data || []);
            setUbicaciones(listUbi.map(u => ({ value: u.opcion, label: u.opcion })));

            // Procesar Inóculos y Especies Únicas
            const dataIno = jsonEsp.data || [];
            setInoculosRaw(dataIno);
            
            const nombresUnicos = [...new Set(dataIno.map(i => i.especie))];
            setEspeciesDisponibles(nombresUnicos.map(e => ({ value: e, label: e })));

        } catch (err) {
            console.error("Error cargando catálogos:", err);
        }
    }, []);

    useEffect(() => {
        fetchLotes();
        cargarCatalogos();
    }, [fetchLotes, cargarCatalogos]);

    // Función para filtrar inóculos basada en el nombre de la especie
// En useLotes.js

const getInoculosPorEspecie = useCallback((especieNombre) => {
    const regexCodigoValido = /^[A-Z].G-[A-Z]{2,3}-\d+/;

    return inoculosRaw
        .filter(i => 
            i.especie === especieNombre && 
            regexCodigoValido.test(i.codigo_fungivora) // <-- FILTRO DE FORMATO
        )
        .map(i => ({
            value: i.id_inoculo,
            label: i.codigo_fungivora 
        }));
}, [inoculosRaw]);

    const addLote = async (nuevoLote) => {
        try {
            const res = await loteService.addLote(nuevoLote);
            if (res.success) await fetchLotes();
            return res;
        } catch (err) {
            return { success: false, message: "Error de conexión" };
        }
    };

    return { 
        datos, 
        sustratos, 
        ubicaciones, 
        especiesDisponibles, 
        getInoculosPorEspecie, 
        cargando, 
        error, 
        addLote, 
        refresh: fetchLotes 
    };
};

export default useLotes;