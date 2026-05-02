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
            localStorage.setItem("token", data.token); //guarda localmente el token
            return data; 
        } catch (err) {
            const mensaje = err.response?.data?.msg || "Usuario y/o contraseña incorrectos"; //Mensaje de error de usuario y/o contraseña
            setError(mensaje);
            throw err; 
        } finally {
            setCargando(false);
        }
    }, []);

    return { ejecutarLogin: login, cargando, error }; 
}

export default useLogin;