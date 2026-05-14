import { useState, useEffect, useMemo } from "react";
import insumosService from "../services/inoculos.service";
import { BOLSAS, TAMANOS_COMPOSICION } from "../types/inoculos.type";

const normalizarUnidad = (unidad = "") => {
  const u = unidad.toLowerCase();
  if (u.includes("mililitro")) return "ml";
  if (u.includes("gramo")) return "g";
  if (u.includes("kilogramo")) return "kg";
  if (u.includes("litro")) return "L";
  return unidad;
};

/**
 * Gestiona los ingredientes de una semilla: Mijo · Agua · Inóculo.
 */
const useIngredientesSemilla = ({
  inoculoDisponible = 0,
  tipoMijo = "",
  codigoInoculo = "",
  tamano = "",
  tipoInoculo = null,
}) => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sugeridos = useMemo(() => {
    const ml = BOLSAS[tamano];
    if (!ml && !tipoInoculo) return { mijo: "", agua: "", inoculo: "" };

    return {
      mijo: String(TAMANOS_COMPOSICION.cantIngredientes[ml].mijo),
      agua: String(TAMANOS_COMPOSICION.cantIngredientes[ml].agua),
      inoculo: String(TAMANOS_COMPOSICION.cantInoculo[ml][tipoInoculo] ?? ""),
    };
  }, [tamano, tipoInoculo]);

  const [cantMijo, setCantMijo] = useState(sugeridos.mijo);
  const [cantAgua, setCantAgua] = useState(sugeridos.agua);
  const [cantInoculo, setCantInoculo] = useState(sugeridos.inoculo);

  // Sincronizar cuando el usuario cambia tamaño o tipo de inóculo
  useEffect(() => {
    console.log("[useIngredientesSemilla] sugeridos cambió:", sugeridos, "| tamano:", tamano, "| tipoInoculo:", tipoInoculo);
    setCantMijo(sugeridos.mijo);
    setCantAgua(sugeridos.agua);
    setCantInoculo(sugeridos.inoculo);
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

  // Ambas variantes de mijo disponibles en inventario → selector del form
  const opcionesMijo = insumos
    .filter((i) => i.nombre.toLowerCase().includes("mijo"))
    .map((i) => ({ value: i.nombre, label: i.nombre }));

  // Insumo del mijo seleccionado (búsqueda exacta por nombre)
  const mijoInsumo = tipoMijo
    ? insumos.find((i) => i.nombre.toLowerCase() === tipoMijo.toLowerCase())
    : null;

  const aguaInsumo = insumos.find((i) => i.nombre.toLowerCase().includes("agua"));

  const items = [
    {
      nombre: tipoMijo || "Mijo",
      unidad: normalizarUnidad(mijoInsumo?.unidad) || "ml",
      value: cantMijo,
      onChange: (e) => setCantMijo(e.target.value),
      cantidad: parseFloat(mijoInsumo?.cantidad) || 10000,
    },
    {
      nombre: "Agua",
      unidad: normalizarUnidad(aguaInsumo?.unidad) || "ml",
      value: cantAgua,
      onChange: (e) => setCantAgua(e.target.value),
      cantidad: parseFloat(aguaInsumo?.cantidad) || 5000,
    },
    {
      nombre: codigoInoculo || "Inóculo",
      unidad: "ml",
      value: cantInoculo,
      onChange: (e) => setCantInoculo(e.target.value),
      cantidad: inoculoDisponible,
    },
  ];

  return {
    items,
    valores: { cantMijo, cantAgua, cantInoculo },
    opcionesMijo,
    loading,
    error,
  };
};

export default useIngredientesSemilla;