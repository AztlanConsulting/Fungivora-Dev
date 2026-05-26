import { useState, useEffect } from "react";
import bloqueService from "../services/bloques.service";

const useBloques = () => {
  const [bloquesTemporales, setBloquesTemporales] = useState([]);
  const [contenedores, setContenedores] = useState([]);
  const [sustratos, setSustratos] = useState([]); 
  const [cargando] = useState(false);

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [dataContenedores, dataSustratos] = await Promise.all([
          bloqueService.getContenedores(),
          bloqueService.getSustratos()
        ]);

        const listaContenedores = Array.isArray(dataContenedores) ? dataContenedores : (dataContenedores.data || []);
        setContenedores(listaContenedores.map(c => ({ value: c.opcion, label: c.opcion })));

        const listaSustratos = Array.isArray(dataSustratos) ? dataSustratos : (dataSustratos.data || []);
        setSustratos(listaSustratos.map(s => ({ value: s.opcion, label: s.opcion })));

      } catch (e) {
        console.error("Error cargando los catálogos del bloque", e);
      }
    };
    cargarCatalogos();
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
    sustratos, 
    agregarBloqueALista,
    eliminarBloqueDeLista,
    limpiarLista,
    cargando
  };
};

export default useBloques;