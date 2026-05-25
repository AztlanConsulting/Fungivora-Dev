import { useState, useEffect } from "react";
import inventarioService from "../services/inventario.service";
import api from "../../../shared/utils/api"; 

const useInsumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unidades, setUnidades] = useState([]); 

    useEffect(() => {
        const cargarUnidades = async () => {
            try {
                const response = await api.get('/inventario/unidades');
                const unidadesData = Array.isArray(response) ? response : (response?.data || []);
                if (Array.isArray(unidadesData)) {
                    setUnidades(unidadesData);
                } else {
                    setUnidades([]);
                }
            } catch (err) {
                console.error("Error cargando unidades:", err);
                setUnidades([]); 
            }
        };
        cargarUnidades();
    }, []);

    // Recuperar los insumos
    const fetchInsumos = async () => {
        setLoading(true);
        try {
            const json = await inventarioService.getInsumos();
            if (json.success) setInsumos(json.data);
            else setError("No se pudieron cargar los insumos");
        } catch {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInsumos();
    }, []);

    // Agregar nuevo insumo
    const addInsumo = async (nuevoInsumo) => {
        try {
            const res = await inventarioService.crearInsumo(nuevoInsumo);
            if (res.success) {
                await fetchInsumos();
                return { success: true };
            }
            return { success: false, error: res.error || 'Error al crear el insumo' };
        } catch (err) {
            console.error("Error al crear:", err);
            return { success: false, error: 'Error de conexión' };
        }
    };

    // Actualizar cantidad 
    const updateInsumo = async (id, datosActualizados, tipo = 'insumo') => {
        try {
            const res = tipo === 'inoculo'
                ? await inventarioService.actualizarInoculo(id, datosActualizados)
                : await inventarioService.actualizarInsumo(id, datosActualizados);

            if (res.success) {
                setInsumos((prev) =>
                    prev.map((item) =>
                        (item.id === id || item.id_insumo === id)
                            ? { ...item, ...datosActualizados }
                            : item
                    )
                );
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error al actualizar:", err);
            return false;
        }
    };

    return { insumos, unidades, loading, error, addInsumo, updateInsumo, refresh: fetchInsumos };
};

export default useInsumos;