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

    // Recuperar los lotes
    const fetchLotes = useCallback(async () => {
        setCargando(true);
        try {
            const json = await loteService.getLotes();
            if (json && json.success) {
                setDatos(json.data || []);
                setError(null);
            } else {
                setError(json?.message || "Error al cargar lotes");
            }
        } catch (err) {
            console.error("Error en fetchLotes:", err);
            setError("Error de conexión con el servidor");
        } finally {
            setCargando(false);
        }
    }, []);

    const cargarCatalogos = useCallback(async () => {
        try {
            const [dataSus, dataUbi, jsonEsp] = await Promise.all([
                loteService.getSustratos(),
                loteService.getUbicaciones(),
                loteService.getEspecies()
            ]);

            // Procesar Sustratos 
            const listSus = Array.isArray(dataSus) ? dataSus : (dataSus?.data || []);
            setSustratos(listSus.map(s => ({ value: s.opcion, label: s.opcion })));

            // Procesar Ubicaciones
            const listUbi = Array.isArray(dataUbi) ? dataUbi : (dataUbi?.data || []);
            setUbicaciones(listUbi.map(u => ({ value: u.opcion, label: u.opcion })));

            // Procesar Inóculos / Especies
            const dataIno = Array.isArray(jsonEsp) ? jsonEsp : (jsonEsp?.data || []);
            setInoculosRaw(dataIno);

            const nombresUnicos = [...new Set(dataIno.map(i => i.especie).filter(Boolean))];
            setEspeciesDisponibles(nombresUnicos.map(e => ({ value: e, label: e })));

        } catch (err) {
            console.error("Error al inicializar formularios (catálogos):", err);
            setError("Error al inicializar formularios (catálogos)");
        }
    }, []);

    // Disparador controlado por montaje seguro
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("useLotes: Esperando por la asignación del token de sesión...");
            return;
        }

        fetchLotes();
        cargarCatalogos();
    }, [fetchLotes, cargarCatalogos]);

    // Filtrado secundario por expresiones regulares para inóculos válidos
    const getInoculosPorEspecie = useCallback((especieNombre) => {
        const regexCodigoValido = /^[A-Z].G-[A-Z]{2,3}-\d+/;

        return (inoculosRaw || [])
            .filter(i =>
                i.especie === especieNombre &&
                regexCodigoValido.test(i.codigo_fungivora)
            )
            .map(i => ({
                value: i.id_inoculo,
                label: i.codigo_fungivora,
                abreviatura: i.abreviatura
              }));
    }, [inoculosRaw]);

    // Agregar lote
    const addLote = async (nuevoLote) => {
        try {
            const res = await loteService.addLote(nuevoLote);
            if (res && res.success) await fetchLotes();
            return res;
        } catch (err) {
            console.error("Fallo al agregar lote:", err);
            return { 
                success: false, 
                message: err.message || "Error de conexión al guardar" 
            };
        }
    };

    // Eliminar lote
    const deleteLote = async (id_lote) => {
        try {
            const res = await loteService.deleteLote(id_lote);
            if (res && res.success) {
                setDatos(prevDatos => prevDatos.filter(lote => lote.id_lote !== id_lote));
            }
            return res;
        } catch (err) {
            console.error(`Error eliminando lote ${id_lote}:`, err);
            return { 
                success: false, 
                message: "No se pudo eliminar el registro en este momento" 
            };
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
        deleteLote,
        refresh: fetchLotes
    };
};

export default useLotes;