import { useState, useCallback } from "react";
import loginService from "../services/login.service";

const useLogin = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (usuario, password) => {
    setError(null);

    if (!usuario?.trim() || !password) {
      setError("Completa los campos de usuario y contraseña");
      return null;
    }

    setCargando(true);

    try {
      const data = await loginService.login(usuario, password);

      if (data?.token) {
        localStorage.setItem("token", data.token);
        return data;
      }
      throw new Error("Respuesta inválida del servidor");
    } catch (err) {
      const mensaje = err.response?.data?.msg || err.message || "Error al iniciar sesión";
      setError(mensaje);
      return null;
    } finally {
      setCargando(false);
    }
  }, []);

  const limpiarError = useCallback(() => setError(null), []);

  return { ejecutarLogin: login, cargando, error, limpiarError };
};

export default useLogin;