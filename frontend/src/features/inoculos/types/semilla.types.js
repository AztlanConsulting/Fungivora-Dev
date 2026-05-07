export const MATRIZ_COMPOSICION = {
    tamaños: {
        // tamaño: { agua, mijo }
        250: { agua: 60, mijo: 100 },
        500: { agua: 150, mijo: 265 },
        1800: { agua: 680, mijo: 1245 }
    },
    cantidadesInoculo: {
        // tamaño: { idTipoInoculo: cantidad } CHECAR CANTIDADES DESPUÉS
        250: { 1: 15, 2: 10, 3: 20 }, // Ej. 1: Agar, 2: Medio Líquido, 3: Semilla
        500: { 1: 30, 2: 20, 3: 40 },
        1800: { 1: 45, 2: 30, 3: 60 }
    }
};
