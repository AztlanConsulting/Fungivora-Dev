import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logoutService from "../service/logout.service";

const useLogout = () => {
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const ejecutarLogout = useCallback(async () => {
        setCargando(true);
        try {
            await logoutService.logout();
            navigate("/"); // Redirigir al Login
        } catch (err) {
            console.error("Error inesperado al cerrar sesión:", err);
        } finally {
            setCargando(false);
        }
    }, [navigate]);

    return { ejecutarLogout, cargando };
};

export default useLogout;