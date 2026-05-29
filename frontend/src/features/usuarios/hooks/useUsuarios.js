import { useState, useEffect, useCallback } from "react";
import usuarioService from "../services/usuarios.service";

const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsuarios = useCallback(async () => {
        setCargando(true);
        try {
            const json = await usuarioService.getUsuarios();
            if (json.success) {
                setUsuarios(json.data);
                setError(null);
            } else {
                setError("Error al cargar la lista de usuarios");
            }
        } catch (err) {
            if (err?.status === 403) {
                setError("No tienes permisos para ver esta sección");
            } else if (err?.status === 401) {
                setError("Tu sesión ha expirado");
            } else {
                setError("Error de conexión con el servidor");
            }
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    const addUsuario = async (nuevoUsuario) => {
        try {
            const res = await usuarioService.addUsuario(nuevoUsuario);
            if (res.success) {
                await fetchUsuarios();
            }
            return res;
        } catch (err) {
            if (err?.status === 403) {
                return { success: false, message: "No tienes permisos para crear usuarios" };
            }
            if (err?.status === 401) {
                return { success: false, message: "Tu sesión ha expirado" };
            }
            return { success: false, message: "Error de conexión al crear usuario" };
        }
    };

    return {
        usuarios,
        cargando,
        error,
        addUsuario,
        refresh: fetchUsuarios 
    };
};

export default useUsuarios;