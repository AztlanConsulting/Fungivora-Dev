import { useState, useEffect } from "react";
import bloqueService from "../services/bloques.service";

const useBloques = () => {
  const [bloquesTemporales, setBloquesTemporales] = useState([]);
  const [contenedores, setContenedores] = useState([]);
  const [cargando] = useState(false);

  useEffect(() => {
    // Cargar los contenedores
    const cargarContenedores = async () => {
      try {
        const data = await bloqueService.getContenedores();
        const lista = Array.isArray(data) ? data : (data.data || []);
        setContenedores(lista.map(c => ({ value: c.opcion, label: c.opcion })));
      } catch (e) {
        console.error("Error cargando contenedores", e);
      }
    };
    cargarContenedores();
  }, []);

  // Agregar los bloques a la lista
  const agregarBloqueALista = (nuevoBloque) => {
    setBloquesTemporales(prev => [...prev, { ...nuevoBloque, id_temp: Date.now() }]);
  };

  // Eliminar bloques de la lista
  const eliminarBloqueDeLista = (id_temp) => {
    setBloquesTemporales(prev => prev.filter(b => b.id_temp !== id_temp));
  };

  // Limpiar dicha lista
  const limpiarLista = () => setBloquesTemporales([]);

  return {
    bloquesTemporales,
    contenedores,
    agregarBloqueALista,
    eliminarBloqueDeLista,
    limpiarLista,
    cargando
  };
};

export default useBloques;