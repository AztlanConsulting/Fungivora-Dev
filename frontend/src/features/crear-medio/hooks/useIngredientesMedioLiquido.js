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

// Mapea el valor del select al nombre que buscamos en los insumos del backend
const CLAVE_CARBOHIDRATO = {
  miel:        "miel",
  jarabe_maiz: "jarabe",
};

const LABEL_CARBOHIDRATO = {
  miel:        "Miel",
  jarabe_maiz: "Jarabe de maíz",
};

/**
 * Gestiona los ingredientes de un medio líquido:
 *   Agua · Peptona · Extracto de Malta · Carbohidrato (dinámico) · Inóculo
 *
 * El carbohidrato aparece en la lista solo cuando el form padre ha seleccionado uno.
 */
const useIngredientesMedioLiquido = ({ carbohidrato = "", inoculoDisponible = 0 }) => {
  const [insumos,  setInsumos]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const [agua,            setAgua]            = useState("");
  const [peptona,         setPeptona]         = useState("");
  const [extracto,        setExtracto]        = useState("");
  const [carbohidratoCant, setCarbohidratoCant] = useState("");
  const [inoculoCant,     setInoculoCant]     = useState("");

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
  const peptonaInsumo  = buscar("peptona");
  const extractoInsumo = buscar("extracto");

  const claveCarbohidrato    = CLAVE_CARBOHIDRATO[carbohidrato] ?? "";
  const carbohidratoInsumo   = claveCarbohidrato ? buscar(claveCarbohidrato) : null;

  const items = [
    {
      nombre:   "Agua",
      unidad:   normalizarUnidad(aguaInsumo?.unidad) || "ml",
      value:    agua,
      onChange: (e) => setAgua(e.target.value),
      cantidad: parseFloat(aguaInsumo?.cantidad) || 5000,
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
    // El carbohidrato solo aparece cuando se ha seleccionado uno
    ...(carbohidrato
      ? [{
          nombre:   LABEL_CARBOHIDRATO[carbohidrato] ?? carbohidrato,
          unidad:   normalizarUnidad(carbohidratoInsumo?.unidad) || "ml",
          value:    carbohidratoCant,
          onChange: (e) => setCarbohidratoCant(e.target.value),
          cantidad: parseFloat(carbohidratoInsumo?.cantidad) || 100,
        }]
      : []
    ),
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
    valores: { agua, peptona, extracto, carbohidratoCant, inoculoCant },
    loading,
    error,
  };
};

export default useIngredientesMedioLiquido;
