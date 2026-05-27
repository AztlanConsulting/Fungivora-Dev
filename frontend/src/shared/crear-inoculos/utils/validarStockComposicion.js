/**
 * Anota cada item de la composición con dos validaciones independientes:
 *
 *  - excedeIndividual: el valor solo (V) ya rebasa el stock. Lo muestra
 *    `SeleccionarCantidades` (composición individual inválida).
 *  - excedeTotal: V × cantidad rebasa el stock. Lo muestra `Resumen`
 *    (no alcanza para todas las repeticiones).
 *
 * @param {Array}  items     - items con { value, cantidad (stock), unidad, ... }
 * @param {number} cantidad  - número de repeticiones a crear
 * @returns {{ items, tieneErrores }}
 */
export const validarStockComposicion = (items, cantidad = 1) => {
  const n = cantidad > 0 ? cantidad : 1;

  const itemsValidados = items.map((item) => {
    // Las comas son separador de miles (input es entero-only), nunca decimal.
    const valNum = parseFloat(String(item.value).replace(/,/g, "")) || 0;
    const total = +(valNum * n).toFixed(2);
    const stockDisponible = Number(item.cantidad) || 0;

    const excedeIndividual = stockDisponible > 0 && valNum > stockDisponible;
    const excedeTotal = stockDisponible > 0 && total > stockDisponible;

    return {
      ...item,
      total,
      excedeIndividual,
      excedeTotal,
      mensajeErrorIndividual: excedeIndividual
        ? `Máximo disponible: ${stockDisponible} ${item.unidad}`
        : null,
      mensajeErrorTotal: excedeTotal
        ? `Stock: ${stockDisponible} ${item.unidad}. Necesitas ${total} ${item.unidad}.`
        : null,
    };
  });

  return {
    items: itemsValidados,
    tieneErrores: itemsValidados.some((i) => i.excedeIndividual || i.excedeTotal),
  };
};
