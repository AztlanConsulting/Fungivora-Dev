import { useState, useCallback } from "react";
import loginService from "../services/login.service";

const useLogin = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (usuario, password) => {
    setCargando(true);
    setError(null);
    
    console.log("1. Enviando credenciales al servicio...");

    try {
      const data = await loginService.login(usuario, password);
      
      if (data && data.token) {
        localStorage.setItem("token", data.token);
        return data; 
      } else {
        throw new Error("No hay un token válido.");
      }

    } catch (err) {
      const mensaje = err.response?.data?.msg || err.message || "Usuario y/o contraseña incorrectos";
      setError(mensaje);
      throw err; 
    } finally {
      setCargando(false);
    }
  }, []);

  return { ejecutarLogin: login, cargando, error };
};

export default useLogin;