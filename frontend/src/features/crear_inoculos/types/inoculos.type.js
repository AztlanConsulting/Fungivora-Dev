export const BOLSAS = {
    chico: 250,
    mediano: 500,
    grande: 1800,
};

export const TAMANOS_COMPOSICION = {
    cantIngredientes: {
        [BOLSAS.chico]: { agua: 60, mijo: 100 },
        [BOLSAS.mediano]: { agua: 150, mijo: 265 },
        [BOLSAS.grande]: { agua: 680, mijo: 1245 }
    },

    cantInoculo: {
        [BOLSAS.chico]: { agar: 15, medioLiquido: 10, semilla: 20 },
        [BOLSAS.mediano]: { agar: 30, medioLiquido: 20, semilla: 40 },
        [BOLSAS.grande]: { agar: 45, medioLiquido: 30, semilla: 60 }
    }
};