import { useState, useEffect, useMemo } from "react";
import insumosService from "../services/inoculos.service";
import { cantAgar, TAMANOS_COMPOSICION } from "../types/inoculos.type";

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
 *   Agua · Agar agar · Peptona · Extracto de Malta · Inóculo
 */
const useIngredientesAgar = ({ 
  inoculoDisponible = 0, 
  codigoInoculo = "", 
  tipoInoculo = null  
}) => {
  const [insumos,  setInsumos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const sugeridos = useMemo(() => {
    return {
      agua: String(TAMANOS_COMPOSICION.cantIngredientes[cantAgar].agua),
      agaragar: String(TAMANOS_COMPOSICION.cantIngredientes[cantAgar].agarAgar),
      peptona: String(TAMANOS_COMPOSICION.cantIngredientes[cantAgar].peptona),
      extracto: String(TAMANOS_COMPOSICION.cantIngredientes[cantAgar].extractoMalta),
      inoculo: String(TAMANOS_COMPOSICION.cantInoculo[cantAgar][tipoInoculo] ?? ""),
    };
  }, [tipoInoculo]);

  const [agua,       setAgua]       = useState(sugeridos.agua);
  const [agaragar,   setAgaragar]   = useState(sugeridos.agaragar);
  const [peptona,    setPeptona]    = useState(sugeridos.peptona);
  const [extracto,   setExtracto]   = useState(sugeridos.extracto);
  const [cantInoculo, setInoculoCant] = useState(sugeridos.inoculo);

  useEffect(() => {
    setAgua(sugeridos.agua);
    setAgaragar(sugeridos.agaragar);
    setPeptona(sugeridos.peptona);
    setExtracto(sugeridos.extracto);
    setInoculoCant(sugeridos.inoculo);
  }, [sugeridos]);

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
      id:       aguaInsumo?.id_insumo ?? null,
      nombre:   "Agua",
      tipo:    "ingrediente",
      unidad:   normalizarUnidad(aguaInsumo?.unidad) || "ml",
      value:    agua,
      onChange: (e) => setAgua(e.target.value),
      cantidad: parseFloat(aguaInsumo?.cantidad) || 5000,
    },
    {
      id:       agaragarInsumo?.id_insumo ?? null,
      nombre:   "Agar agar",
      tipo:    "ingrediente",
      unidad:   normalizarUnidad(agaragarInsumo?.unidad) || "ml",
      value:    agaragar,
      onChange: (e) => setAgaragar(e.target.value),
      cantidad: parseFloat(agaragarInsumo?.cantidad) || 500,
    },
    {
      id:       peptonaInsumo?.id_insumo ?? null,
      nombre:   "Peptona",
      tipo:    "ingrediente",
      unidad:   normalizarUnidad(peptonaInsumo?.unidad) || "ml",
      value:    peptona,
      onChange: (e) => setPeptona(e.target.value),
      cantidad: parseFloat(peptonaInsumo?.cantidad) || 500,
    },
    {
      id:       extractoInsumo?.id_insumo ?? null,
      nombre:   "Extracto de Malta",
      tipo:    "ingrediente",
      unidad:   normalizarUnidad(extractoInsumo?.unidad) || "ml",
      value:    extracto,
      onChange: (e) => setExtracto(e.target.value),
      cantidad: parseFloat(extractoInsumo?.cantidad) || 500,
    },
    {
      id:       null,
      nombre: codigoInoculo || "Inóculo",
      tipo:    "inoculo",
      unidad:   "ml",
      value:    cantInoculo,
      onChange: (e) => setInoculoCant(e.target.value),
      cantidad: inoculoDisponible,
    },
  ];

  return {
    items,
    valores: { agua, agaragar, peptona, extracto, cantInoculo },
    loading,
    error,
  };
};

export default useIngredientesAgar;
