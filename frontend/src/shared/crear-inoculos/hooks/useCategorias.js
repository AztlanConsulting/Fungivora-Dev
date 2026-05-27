import { useState, useEffect } from "react";
import api from "../../../shared/utils/api"; 

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
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        setLoading(true);
        const json = await api.get("/categorias/todas");

        if (json && json.success) {
          setCategorias(json.data || []);
        } else if (Array.isArray(json)) {
          setCategorias(json);
        } else {
          setError("No se pudieron cargar las categorías");
        }
      } catch (err) {
        console.error("Error en useCategorias:", err);
        setError("Error de conexión");
      } finally {
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
  const getByCategoria = (nombreCategoria) => {
    if (!Array.isArray(categorias)) return [];
    return categorias.filter((c) => c && c.nombre_categoria === nombreCategoria);
  };

  return { categorias, getByCategoria, loading, error };
};

export default useCategorias;