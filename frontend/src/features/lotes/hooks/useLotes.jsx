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

  // Añadir un lote
  const addLote = async (nuevoLote) => {
    try {
      const resultado = await loteService.addLote(nuevoLote);
      if (resultado.success) {
        await obtenerLotes(); // Recarga la lista despues de guardar
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error al crear lote:", err);
      return false;
    }
  };

  useEffect(() => {
    obtenerLotes();
    const intervalo = setInterval(() => {
      obtenerLotes();
    }, 5000);
    return () => clearInterval(intervalo);
  }, [obtenerLotes]);

  return { datos, cargando, error, refrescar: obtenerLotes, addLote };
};

export default useLotes;