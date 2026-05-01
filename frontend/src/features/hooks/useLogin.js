import { useState, useCallback } from "react";
import loginService from "../services/login.service";

const useLogin = () => {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (usuario, password) => {
        setCargando(true);
        setError(null);
        try {
            const data = await loginService.login(usuario, password);
            localStorage.setItem("token", data.token);
            window.location.href = "/first";
            return data;
        } catch (err) {
            setError("Usuario y/o contraseña incorrectos");
            throw err; 
        } finally {
            setCargando(false);
        }
    }, []);

    return { ejecutarLogin: login, cargando, error }; 
}

export default useLogin;