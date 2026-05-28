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
                setUnidades(Array.isArray(unidadesData) ? unidadesData : []);
            } catch (err) {
                console.error("Error cargando unidades:", err);
                setUnidades([]);
            }
        };
        cargarUnidades();
    }, []);

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

    const addInsumo = async (nuevoInsumo) => {
        setError(null);
        try {
            const res = await inventarioService.crearInsumo(nuevoInsumo);
            if (res.success) {
                await fetchInsumos();
                return { success: true };
            }
            const mensaje = res.error || 'Error al crear el insumo';
            setError(mensaje);
            return {
                success: false,
                error: mensaje
            };
        } catch (err) {
            console.error("Error al crear:", err);
            const mensaje = err.message || 'Error al crear el insumo';
            setError(mensaje);
            return {
                success: false,
                error: mensaje
            };
        }
    };

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

    const deleteInsumo = async (id) => {
    try {
        const res = await inventarioService.eliminarInsumo(id);
        if (res.success) {
            setInsumos((prev) => prev.filter((item) => (item.id ?? item.id_insumo) !== id));
            return { success: true };
        }
        return { success: false, error: res.error || 'Error al eliminar' };
    } catch (err) {
        console.error("Error al eliminar:", err);
        return { success: false, error: 'Error de conexión' };
    }
};

    return { insumos, unidades, loading, error, addInsumo, updateInsumo, deleteInsumo, refresh: fetchInsumos };

};

export default useInsumos;