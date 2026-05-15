import { useState, useEffect } from "react";
import insumosService from "../services/inoculos.service";

const normalizarUnidad = (unidad = "") => {
  const u = unidad.toLowerCase();
  if (u.includes("mililitro")) return "ml";
  if (u.includes("gramo"))     return "g";
  if (u.includes("kilogramo")) return "kg";
  if (u.includes("litro"))     return "L";
  return unidad;
};

/**
 * Gestiona los ingredientes de un agar:
 *   Agua · Peptona · Extracto de Malta · Inóculo
 */
const useIngredientesAgar = ({ inoculoDisponible = 0 }) => {
  const [insumos,  setInsumos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const [agua,       setAgua]       = useState("");
  const [agaragar,   setAgaragar]   = useState("");
  const [peptona,    setPeptona]    = useState("");
  const [extracto,   setExtracto]   = useState("");
  const [inoculoCant, setInoculoCant] = useState("");

  useEffect(() => {
    insumosService.getMaterialesInsumos()
      .then((json) => {
        if (json.success) setInsumos(json.data);
        else setError("No se pudieron cargar los insumos");
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false));
  }, []);

  const buscar = (nombre) =>
    insumos.find((i) => i.nombre.toLowerCase().includes(nombre.toLowerCase()));

  const aguaInsumo     = buscar("agua");
  const agaragarInsumo = buscar("agaragar");
  const peptonaInsumo  = buscar("peptona");
  const extractoInsumo = buscar("extracto");

  const items = [
    {
      nombre:   "Agua",
      unidad:   normalizarUnidad(aguaInsumo?.unidad) || "ml",
      value:    agua,
      onChange: (e) => setAgua(e.target.value),
      cantidad: parseFloat(aguaInsumo?.cantidad) || 5000,
    },
    {
      nombre:   "Agar agar",
      unidad:   normalizarUnidad(agaragarInsumo?.unidad) || "ml",
      value:    agaragar,
      onChange: (e) => setAgaragar(e.target.value),
      cantidad: parseFloat(agaragarInsumo?.cantidad) || 500,
    },
    {
      nombre:   "Peptona",
      unidad:   normalizarUnidad(peptonaInsumo?.unidad) || "ml",
      value:    peptona,
      onChange: (e) => setPeptona(e.target.value),
      cantidad: parseFloat(peptonaInsumo?.cantidad) || 500,
    },
    {
      nombre:   "Extracto de Malta",
      unidad:   normalizarUnidad(extractoInsumo?.unidad) || "ml",
      value:    extracto,
      onChange: (e) => setExtracto(e.target.value),
      cantidad: parseFloat(extractoInsumo?.cantidad) || 500,
    },
    {
      nombre:   "Inóculo",
      unidad:   "ml",
      value:    inoculoCant,
      onChange: (e) => setInoculoCant(e.target.value),
      cantidad: inoculoDisponible,
    },
  ];

  return {
    items,
    valores: { agua, agaragar, peptona, extracto, inoculoCant },
    loading,
    error,
  };
};

export default useIngredientesAgar;
