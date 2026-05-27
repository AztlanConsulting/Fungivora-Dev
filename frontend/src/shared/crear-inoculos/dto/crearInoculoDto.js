/**
 * DTO para inóculos comprados (sin inóculo padre ni ingredientes).
 * Solo lleva la cantidad disponible; stock_recomendado se iguala a ella.
 */
export const crearInoculoCompradoDTO = ({
    codigo,
    tipo,
    especie,
    fecha,
    cantidadDisponible,
    nota,
    unidad = "ml",
}) => {
    const cantidad = Number(cantidadDisponible) || 0;
    return {
        codigo_fungivora: codigo,
        tipo,
        especie,
        fecha:
            `${fecha.year}-${String(fecha.month)
                .padStart(2, "0")}-${String(fecha.day)
                .padStart(2, "0")}`,
        cantidad_disponible: cantidad,
        unidad,
        stock_recomendado: cantidad,
        num_repeticiones: 1,
        nota,
        inoculo_usado: { id: null, cantidad: 0 },
        ingredientes: [],
    };
};

export const crearInoculoDTO = ({
    codigo,
    tipo,
    especie,
    fecha,
    cantidadFinal,
    cantidad,
    nota,
    unidad = "ml",
    inoculoSeleccionado,
    valoresComposicion,
    itemsComposicion,
}) => {

    return {

        codigo_fungivora: codigo,

        tipo,

        especie,

        fecha:
            `${fecha.year}-${String(fecha.month)
                .padStart(2, "0")}-${String(fecha.day)
                .padStart(2, "0")}`,

        cantidad_disponible: cantidadFinal,

        unidad,

        stock_recomendado: 100,

        num_repeticiones: cantidad ,

        nota,

        inoculo_usado: {
            id:
                inoculoSeleccionado?.raw?.id_inoculo
                ?? null,

            cantidad:
                Number(
                    valoresComposicion.cantInoculo
                ) || 0,
        },

        ingredientes:
            itemsComposicion
                .filter(
                    (item) =>
                        item.tipo === "ingrediente"
                        && item.id != null
                )
                .map((ing) => ({
                    id: ing.id,

                    cantidad:
                        Number(ing.value) || 0,
                })),
    };
};