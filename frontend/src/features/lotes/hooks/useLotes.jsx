import { useState, useEffect } from "react";
import loteService from "../services/lotes.service";

const useLotes = () => {
    const [datos, setDatos] = useState([]);
    const [sustratos, setSustratos] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Cargar Sustratos
    useEffect(() => {
        const cargarSustratos = async () => {
            try {
                const res = await fetch('/api/lotes/sustratos');
                const data = await res.json();
                const formateados = data.map(s => ({ 
                    value: s.opcion, 
                    label: s.opcion 
                }));
                setSustratos(formateados);
            } catch (err) {
                console.error("Error sustratos:", err);
            }
        };
        cargarSustratos();
    }, []);

    // Cargar Ubicaciones
    useEffect(() => {
        const cargarUbicaciones = async () => {
            try {
                const res = await fetch('/api/lotes/ubicaciones');
                const data = await res.json();
                const formateados = data.map(u => ({ 
                    value: u.opcion, 
                    label: u.opcion 
                }));
                setUbicaciones(formateados);
            } catch (err) {
                console.error("Error ubicaciones:", err);
            }
        };
        cargarUbicaciones();
    }, []);

    // Cargar Lotes 
    const fetchLotes = async () => {
        setCargando(true);
        try {
            const json = await loteService.getLotes();
            if (json.success) setDatos(json.data);
            else setError("Error al cargar lotes");
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        fetchLotes();
    }, []);

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

    return { datos, sustratos, ubicaciones, cargando, error, addLote, refresh: fetchLotes };
};

export default useLotes;