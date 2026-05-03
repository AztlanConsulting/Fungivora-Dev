import { useState, useEffect, useCallback } from "react";
import loteService from "../services/lotes.service";

const useLotes = () => {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const obtenerLotes = useCallback(async () => {
    try {
      const resultado = await loteService.getLotes();

      if (resultado.success) {
        // Ordenar la fechar, priemro las más recientes
        const datosOrdenados = resultado.data.sort((a, b) => {
          return new Date(b.fecha_lote) - new Date(a.fecha_lote);
        });
        setDatos(datosOrdenados);
        setError(null);
      } else {
        setError("No se pudo obtener la lista de lotes");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerLotes();
    
    // Refresh de la pagina cada 5 seg, para no tener que hacerlo manualmente
    const intervalo = setInterval(() => {
      obtenerLotes();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [obtenerLotes]);

  return { datos, cargando, error, refrescar: obtenerLotes };
};

export default useLotes;