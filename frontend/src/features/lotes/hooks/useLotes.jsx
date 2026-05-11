import { useState, useEffect, useCallback } from "react"; 
import loteService from "../services/lotes.service";

const useLotes = () => {
    const [datos, setDatos] = useState([]);
    const [sustratos, setSustratos] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [especies, setEspecies] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const fetchLotes = useCallback(async () => {
        setCargando(true);
        try {
            const json = await loteService.getLotes();
            if (json.success) {
                setDatos(json.data);
                setError(null);
            } else {
                setError("Error al cargar lotes");
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        const cargarCatalogos = async () => {
            try {
                // Sustratos
                const resSus = await fetch('/api/lotes/sustratos');
                const dataSus = await resSus.json();
                const listSus = Array.isArray(dataSus) ? dataSus : (dataSus.data || []);
                setSustratos(listSus.map(s => ({ value: s.opcion, label: s.opcion })));

                // Ubicaciones
                const resUbi = await fetch('/api/lotes/ubicaciones');
                const dataUbi = await resUbi.json();
                const listUbi = Array.isArray(dataUbi) ? dataUbi : (dataUbi.data || []);
                setUbicaciones(listUbi.map(u => ({ value: u.opcion, label: u.opcion })));

                // Especies
                const resEsp = await fetch('/api/lotes/especies');
                const jsonEsp = await resEsp.json();
                setEspecies(jsonEsp.data.map(i => ({ 
                    value: i.id_inoculo, 
                    label: `${i.codigo_fungivora} / ${i.especie}` 
                })));
            } catch (err) {
                console.error("Error cargando catálogos:", err);
            }
        };
        cargarCatalogos();
    }, []);

    useEffect(() => {
        fetchLotes(); 
        const intervalo = setInterval(() => {
            fetchLotes();
        }, 5000);

        return () => clearInterval(intervalo); 
    }, [fetchLotes]);

    const addLote = async (nuevoLote) => {
        try {
            const res = await loteService.addLote(nuevoLote);
            if (res.success) {
                await fetchLotes(); 
                return true;
            }
        } catch (err) {
            console.error("Error al crear:", err);
        }
        return false;
    };

    return { datos, sustratos, ubicaciones, especies, cargando, error, addLote, refresh: fetchLotes };
};

export default useLotes;