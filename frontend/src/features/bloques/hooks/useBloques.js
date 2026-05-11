import { useState, useEffect } from "react";
import bloqueService from "../services/bloques.service";

const useBloques = () => {
  const [bloquesTemporales, setBloquesTemporales] = useState([]);
  const [contenedores, setContenedores] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
  const cargarContenedores = async () => {
    try {
      const data = await bloqueService.getContenedores();
      // Asegurar que siempre sea un array
      const lista = Array.isArray(data) ? data : (data.data || []);
      setContenedores(lista.map(c => ({ value: c.opcion, label: c.opcion })));
    } catch (e) {
      console.error("Error cargando contenedores", e);
    }
  };
  cargarContenedores();
}, []);

  const agregarBloqueALista = (nuevoBloque) => {
    // nuevoBloque trae: { contenedor, peso_gr, produccion, cantidad }
    setBloquesTemporales(prev => [...prev, { ...nuevoBloque, id_temp: Date.now() }]);
  };

  const eliminarBloqueDeLista = (id_temp) => {
    setBloquesTemporales(prev => prev.filter(b => b.id_temp !== id_temp));
  };

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