export const crearInoculoDTO = ({
    codigo,
    tipo,
    especie,
    fecha,
    cantidadFinal,
    nota,
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

        unidad: "gr",

        stock_recomendado: 100,

        num_repeticiones: ,

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