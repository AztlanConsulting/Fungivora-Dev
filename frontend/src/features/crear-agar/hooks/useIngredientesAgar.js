import { useState, useEffect, useMemo } from "react";
import insumosService from "../../../shared/crear-inoculos/services/inoculos.service";
import { cantAgar, TAMANOS_COMPOSICION } from "../../../shared/crear-inoculos/types/inoculos.types";
import { validarStockComposicion } from "../../../shared/crear-inoculos/utils/validarStockComposicion";

const normalizarUnidad = (unidad = "") => {
  const u = (unidad || "").toLowerCase();
  if (u.includes("mililitro")) return "ml";
  if (u.includes("gramo")) return "g";
  if (u.includes("kilogramo")) return "kg";
  if (u.includes("litro")) return "L";
  return unidad;
};

/**
 * Gestiona los ingredientes de un agar:
 * Agua · Agar agar · Peptona · Extracto de Malta · Inóculo
 */
const useIngredientesAgar = ({
  inoculoDisponible = 0,
  codigoInoculo = "",
  tipoInoculo = null,
  cantidad = 1,
}) => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sugeridos = useMemo(() => {
    return {
      agua: String(TAMANOS_COMPOSICION.cantIngredientes[cantAgar]?.agua || "0"),
      agaragar: String(TAMANOS_COMPOSICION.cantIngredientes[cantAgar]?.agarAgar || "0"),
      peptona: String(TAMANOS_COMPOSICION.cantIngredientes[cantAgar]?.peptona || "0"),
      extracto: String(TAMANOS_COMPOSICION.cantIngredientes[cantAgar]?.extractoMalta || "0"),
      inoculo: String(TAMANOS_COMPOSICION.cantInoculo[cantAgar]?.[tipoInoculo] ?? ""),
    };
  }, [tipoInoculo]);

  const [agua, setAgua] = useState(sugeridos.agua);
  const [agaragar, setAgaragar] = useState(sugeridos.agaragar);
  const [peptona, setPeptona] = useState(sugeridos.peptona);
  const [extracto, setExtracto] = useState(sugeridos.extracto);
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
        if (json && json.success) {
          setInsumos(Array.isArray(json.data) ? json.data : []);
        } else if (Array.isArray(json)) {
          setInsumos(json);
        } else if (json && Array.isArray(json.data)) {
          setInsumos(json.data);
        } else {
          setError("No se pudieron cargar los insumos");
        }
      })
      .catch((err) => {
        console.error("Error cargando materiales para Agar:", err);
        setError("Error de conexión");
      })
      .finally(() => setLoading(false));
  }, []);

  const buscar = (nombre) => {
    if (!Array.isArray(insumos)) return null;
    return insumos.find((i) =>
      i && i.nombre && i.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  };

  // Búsquedas seguras
  const aguaInsumo = buscar("agua");
  const agaragarInsumo = buscar("agaragar");
  const peptonaInsumo = buscar("peptona");
  const extractoInsumo = buscar("extracto");

  const esSolido = codigoInoculo && codigoInoculo.split("-")[0].endsWith("G");

  const items = [
    {
      id: aguaInsumo?.id_insumo ?? null,
      nombre: "Agua",
      tipo: "ingrediente",
      unidad: normalizarUnidad(aguaInsumo?.unidad) || "ml",
      value: agua,
      onChange: (e) => setAgua(e.target.value),
      cantidad: parseFloat(aguaInsumo?.cantidad) || 0,
    },
    {
      id: agaragarInsumo?.id_insumo ?? null,
      nombre: "Agar agar",
      tipo: "ingrediente",
      unidad: normalizarUnidad(agaragarInsumo?.unidad) || "g",
      value: agaragar,
      onChange: (e) => setAgaragar(e.target.value),
      cantidad: parseFloat(agaragarInsumo?.cantidad) || 0,
    },
    {
      id: peptonaInsumo?.id_insumo ?? null,
      nombre: "Peptona",
      tipo: "ingrediente",
      unidad: normalizarUnidad(peptonaInsumo?.unidad) || "g",
      value: peptona,
      onChange: (e) => setPeptona(e.target.value),
      cantidad: parseFloat(peptonaInsumo?.cantidad) || 0,
    },
    {
      id: extractoInsumo?.id_insumo ?? null,
      nombre: "Extracto de Malta",
      tipo: "ingrediente",
      unidad: normalizarUnidad(extractoInsumo?.unidad) || "g",
      value: extracto,
      onChange: (e) => setExtracto(e.target.value),
      cantidad: parseFloat(extractoInsumo?.cantidad) || 0,
    },
    {
      id: null,
      nombre: codigoInoculo || "Inóculo",
      tipo: "inoculo",
      unidad: esSolido ? "g" : "ml",
      value: cantInoculo,
      onChange: (e) => setInoculoCant(e.target.value),
      cantidad: inoculoDisponible,
    },
  ];

  const { items: itemsValidados, tieneErrores } = validarStockComposicion(items, cantidad);

  return {
    items: itemsValidados,
    valores: { agua, agaragar, peptona, extracto, cantInoculo },
    tieneErrores,
    loading,
    error,
  };
};

export default useIngredientesAgar;