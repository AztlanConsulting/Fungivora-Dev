import { useState, useEffect, useMemo } from "react";
import insumosService from "../../../shared/crear-inoculos/services/inoculos.service";
import { COMPOSICION_MEDIO_LIQUIDO } from "../../../shared/crear-inoculos/types/inoculos.types";
import { validarStockComposicion } from "../../../shared/crear-inoculos/utils/validarStockComposicion";

const normalizarUnidad = (unidad = "") => {
  const u = unidad.toLowerCase();
  if (u.includes("mililitro")) return "ml";
  if (u.includes("gramo")) return "g";
  if (u.includes("kilogramo")) return "kg";
  if (u.includes("litro")) return "L";
  return unidad;
};

// Mapea el valor del select al nombre que buscamos en los insumos del backend
const CLAVE_CARBOHIDRATO = {
  miel: "miel",
  jarabe_maiz: "jarabe",
};

const LABEL_CARBOHIDRATO = {
  miel: "Miel",
  jarabe_maiz: "Jarabe de maíz",
};

/**
 * Gestiona los ingredientes de un medio líquido:
 *   Agua · Peptona · Extracto de Malta · Carbohidrato (dinámico) · Inóculo
 *
 * Los campos se autocompletan con los valores de COMPOSICION_MEDIO_LIQUIDO
 * en cuanto se conoce el tipo del inóculo padre. La peptona se deja en
 * blanco para que el usuario la rellene manualmente.
 */
const useIngredientesMedioLiquido = ({
  carbohidrato = "",
  inoculoDisponible = 0,
  tipoInoculo = null,
  codigoInoculo = "",
}) => {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sugeridos = useMemo(() => ({
    agua: String(COMPOSICION_MEDIO_LIQUIDO.agua),
    peptona: String(COMPOSICION_MEDIO_LIQUIDO.peptona),
    extracto: String(COMPOSICION_MEDIO_LIQUIDO.extractoMalta),
    carbohidrato: String(COMPOSICION_MEDIO_LIQUIDO.carbohidrato),
    inoculo: String(COMPOSICION_MEDIO_LIQUIDO.inoculo[tipoInoculo] ?? ""),
  }), [tipoInoculo]);

  const [agua, setAgua] = useState(sugeridos.agua);
  const [peptona, setPeptona] = useState(sugeridos.peptona);
  const [extracto, setExtracto] = useState(sugeridos.extracto);
  const [carbohidratoCant, setCarbohidratoCant] = useState(sugeridos.carbohidrato);
  const [cantInoculo, setCantInoculo] = useState(sugeridos.inoculo);

  // Resincronizar cuando cambia el tipo del inóculo padre
  useEffect(() => {
    setAgua(sugeridos.agua);
    setPeptona(sugeridos.peptona);
    setExtracto(sugeridos.extracto);
    setCarbohidratoCant(sugeridos.carbohidrato);
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

  const buscar = (nombre) =>
    insumos.find((i) => i.nombre.toLowerCase().includes(nombre.toLowerCase()));

  const aguaInsumo = buscar("agua");
  const peptonaInsumo = buscar("peptona");
  const extractoInsumo = buscar("extracto");

  const claveCarbohidrato = CLAVE_CARBOHIDRATO[carbohidrato] ?? "";
  const carbohidratoInsumo = claveCarbohidrato ? buscar(claveCarbohidrato) : null;

  const items = [
    {
      id: aguaInsumo?.id_insumo ?? null,
      tipo: "ingrediente",
      nombre: "Agua",
      unidad: normalizarUnidad(aguaInsumo?.unidad) || "ml",
      value: agua,
      onChange: (e) => setAgua(e.target.value),
      cantidad: parseFloat(aguaInsumo?.cantidad) || 5000,
    },
    {
      id: peptonaInsumo?.id_insumo ?? null,
      tipo: "ingrediente",
      nombre: "Peptona",
      unidad: normalizarUnidad(peptonaInsumo?.unidad) || "ml",
      value: peptona,
      onChange: (e) => setPeptona(e.target.value),
      cantidad: parseFloat(peptonaInsumo?.cantidad) || 500,
    },
    {
      id: extractoInsumo?.id_insumo ?? null,
      tipo: "ingrediente",
      nombre: "Extracto de Malta",
      unidad: normalizarUnidad(extractoInsumo?.unidad) || "ml",
      value: extracto,
      onChange: (e) => setExtracto(e.target.value),
      cantidad: parseFloat(extractoInsumo?.cantidad) || 500,
    },
    {
      id: carbohidratoInsumo?.id_insumo ?? null,
      tipo: "ingrediente",
      nombre: LABEL_CARBOHIDRATO[carbohidrato] || "Carbohidrato",
      unidad: normalizarUnidad(carbohidratoInsumo?.unidad) || "ml",
      value: carbohidratoCant,
      onChange: (e) => setCarbohidratoCant(e.target.value),
      cantidad: parseFloat(carbohidratoInsumo?.cantidad) || 100,
    },
    {
      id: null,
      tipo: "inoculo",
      nombre: codigoInoculo || "Inóculo",
      unidad: "ml",
      value: cantInoculo,
      onChange: (e) => setCantInoculo(e.target.value),
      cantidad: inoculoDisponible,
    },
  ];

  // Medio líquido siempre se crea como 1 unidad — cantidad fija en 1.
  const { items: itemsValidados, tieneErrores } = validarStockComposicion(items, 1);

  return {
    items: itemsValidados,
    valores: { agua, peptona, extracto, carbohidratoCant, cantInoculo },
    tieneErrores,
    loading,
    error,
  };
};

export default useIngredientesMedioLiquido;