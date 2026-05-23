import { useState, useEffect } from "react";

/**
 * Hook para obtener todos los registros de la tabla Categorías.
 * Obtener la abreviatura de la especie seleccionada.
 */
const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res  = await fetch("/api/categorias/todas");
        const json = await res.json();

        if (json.success) {
          setCategorias(json.data);
        } else {
          setError("No se pudieron cargar las categorías");
        }
      } catch  {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  /**
   * Devuelve solo los registros que pertenecen a una categoría específica.
   * @param {string} nombreCategoria 
   * @returns {Array}
   */
  const getByCategoria = (nombreCategoria) =>
    categorias.filter((c) => c.nombre_categoria === nombreCategoria);

  return { categorias, getByCategoria, loading, error };
};

export default useCategorias;