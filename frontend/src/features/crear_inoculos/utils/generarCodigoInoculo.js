// El prefijo codifica la relación: "de qué tipo de inóculo vengo" → "qué estoy creando".
// La última letra/sílaba siempre identifica lo que se está creando:
//   G  → Semilla (Grain)
//   ML → Medio Líquido
//   A  → Agar
//
// Para Medio Líquido el prefijo es siempre "ML" independientemente del inóculo fuente,
// ya que en ese flujo el origen no se codifica en el ID.
const MAPA_PREFIJOS = {
  semilla: {
    agar:         "A2G",
    medioLiquido: "L2G",
    semilla:      "G2G",
  },
  medioLiquido: {
    agar:         "ML",
    medioLiquido: "ML",
    semilla:      "ML",
  },
  agar: {
    agar:         "A2A",
    semilla:      "G2A",
    medioLiquido: "L2A",
    // "PA" es el fallback cuando no hay inóculo previo identificado.
  },
};

/**
 * Normaliza el tipo de inóculo a la clave interna del mapa de prefijos.
 * @param {string | null | undefined} tipo 
 * @returns {"agar" | "semilla" | "medioLiquido" | null}
 */
export const normalizarTipoInoculo = (tipo) => {
  if (!tipo) return null;
  const t = tipo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Eliminar acentos para comparar "líquido" === "liquido"

  if (t.includes("agar"))                              return "agar";
  if (t.includes("semilla"))                           return "semilla";
  if (t.includes("liquido") || t.includes("medio"))   return "medioLiquido";

  return null;
};

/**
 * Obtiene el prefijo del código según el tipo de creación y el tipo del inóculo fuente.
 *
 * @param {"semilla" | "medioLiquido" | "agar"} tipoCreacion
 * @param {"agar" | "semilla" | "medioLiquido" | null} tipoInoculo
 * @returns {string} - El prefijo (ej. "A2G", "ML", "G2A", "PA")
 */
export const obtenerPrefijo = (tipoCreacion, tipoInoculo) => {
  const mapaCreacion = MAPA_PREFIJOS[tipoCreacion];
  if (!mapaCreacion) return "??"; 

  // Si el tipo de inóculo es nulo o no está en el mapa, usamos el fallback.
  // Para Agar: "PA". Para otros: el primer valor del mapa.
  const fallback = tipoCreacion === "agar" ? "PA" : Object.values(mapaCreacion)[0];

  return mapaCreacion[tipoInoculo] ?? fallback;
};

/**
 * Formatea el objeto de fecha a DDMMYY (formato del sistema).
 * @param {{ day?: string, month?: string, year?: string }} fecha
 * @returns {string}
 */
export const formatearFecha = (fecha) => {
  if (!fecha?.day || !fecha?.month || !fecha?.year) return "??????";

  const dd = String(fecha.day).padStart(2, "0");
  const mm = String(fecha.month).padStart(2, "0");
  const yy = String(fecha.year).slice(-2); // Solo los últimos 2 dígitos del año

  return `${dd}${mm}${yy}`;
};

/**
 * Obtiene la abreviatura de una especie buscando en los datos de categorías.
 *
 * Compara el nombre de la especie seleccionada contra los registros de la
 * categoría "Especies" y devuelve su abreviatura_opcion ("HE", "PD").
 *
 * @param {string} nombreEspecie 
 * @param {Array} categorias 
 * @returns {string} 
 */
export const obtenerAbreviaturaEspecie = (nombreEspecie, categorias) => {
  if (!nombreEspecie || !categorias?.length) return "??";

  const match = categorias.find(
    (c) =>
      c.nombre_categoria === "Especies" &&
      c.nombre_opcion === nombreEspecie
  );

  return match?.abreviatura_opcion ?? "??";
};

/**
 * Genera el array de códigos únicos para un lote de inóculos.
 *
 * Si cantidad = 1, devuelve un solo código sin sufijo numérico.
 * Si cantidad > 1, devuelve N códigos, cada uno con su número de repetición al final.
 *
 * Ejemplos:
 *   cantidad=1 → ["A2G-PD-120226"]
 *   cantidad=3 → ["A2G-PD-120226-1", "A2G-PD-120226-2", "A2G-PD-120226-3"]
 *
 * @param {object} params
 * @param {"semilla"|"medioLiquido"|"agar"} params.tipoCreacion
 * @param {string|null} params.tipoInoculo 
 * @param {string} params.nombreEspecie 
 * @param {Array} params.categorias 
 * @param {{ day?: string, month?: string, year?: string }} params.fecha
 * @param {number} params.cantidad 
 * @returns {string[]} 
 */
export const generarCodigos = ({
  tipoCreacion,
  tipoInoculo,
  nombreEspecie,
  categorias,
  fecha,
  cantidad,
}) => {
  const prefijo    = obtenerPrefijo(tipoCreacion, tipoInoculo);
  const abreviatura = obtenerAbreviaturaEspecie(nombreEspecie, categorias);
  const fechaStr   = formatearFecha(fecha);

  const base = `${prefijo}-${abreviatura}-${fechaStr}`;

  if (!cantidad || cantidad <= 1) {
    return [base];
  }

  // Genera un código por cada repetición del lote
  return [base, ...Array.from({ length: cantidad }, (_, i) => `${base}-${i + 1}`)];
};