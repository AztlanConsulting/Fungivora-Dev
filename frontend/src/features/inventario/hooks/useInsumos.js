
import { useState, useEffect } from "react";
import inventarioService from "../services/inventario.service";

const useInsumos = () => {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unidades, setUnidades] = useState([]);

    useEffect(() => {
        const cargarUnidades = async () => {
            try {
                const response = await fetch('/api/inventario/unidades'); // Ruta de las unidades
                const data = await response.json();
                setUnidades(data);
            } catch (err) {
                console.error("Error cargando unidades", err);
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
        } catch (err) {
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
                return true;
            }
            return { success: false, error: res.error || 'Error al crear el insumo' };
        } catch (err) {
            console.error("Error al crear:", err);
        }
        return false;
    };

    // Actualizar cantidad 
    const updateInsumo = async (id, datosActualizados) => {
        try {
            const res = await inventarioService.actualizarInsumo(id, datosActualizados);

            if (res.success) {
                setInsumos((prev) =>
                    prev.map((item) =>
                        item.id_insumo === id
                            ? { ...item, ...datosActualizados }
                            : item
                    )
                );
                return true;
            } else {
                console.error("Error del backend:", res.message);
                return false;
            }
        } catch (err) {
            console.error("Error al actualizar:", err);
            return false;
        }
    };

    return { insumos, unidades, loading, error, addInsumo, updateInsumo, refresh: fetchInsumos };
};

export default useInsumos;