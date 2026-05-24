export const BOLSAS = {
    chico: 250,
    mediano: 500,
    grande: 1800,
};
export const cantAgar = { agar: 150 };
export const cantMedioLiquido = 600;

// Cantidades predeterminadas para crear un medio líquido (en ml).
// El inóculo depende del tipo del inóculo padre seleccionado.
export const COMPOSICION_MEDIO_LIQUIDO = {
  agua:          600,
  peptona:       1,
  extractoMalta: 1,
  carbohidrato:  7.5,
  inoculo: {
    agar:         1,
    medioLiquido: 10,
  },
};

export const TAMANOS_COMPOSICION = {
    cantIngredientes: {
        [BOLSAS.chico]: { agua: 60, mijo: 100 },
        [BOLSAS.mediano]: { agua: 150, mijo: 265 },
        [BOLSAS.grande]: { agua: 680, mijo: 1245 },
        [cantAgar]: { agua: 750, agarAgar: 15, peptona: 15, extractoMalta: 15 }
    },

    cantInoculo: {
        [BOLSAS.chico]: { agar: 15, medioLiquido: 10, semilla: 20 },
        [BOLSAS.mediano]: { agar: 30, medioLiquido: 20, semilla: 40 },
        [BOLSAS.grande]: { agar: 45, medioLiquido: 30, semilla: 60 },
        [cantAgar]: {agar: .5, medioLiquido: 1.5, semilla: .5, tejido: .5, selloEsporas: 50, esporasSuspendidas: 1 },
    }
};

