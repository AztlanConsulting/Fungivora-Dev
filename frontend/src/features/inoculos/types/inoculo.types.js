/**
 * @typedef {Object} Especie
 * @property {string} value - Identificador de la especie
 * @property {string} label - Nombre legible de la especie
 */

/**
 * @typedef {Object} DatoInoculo
 * @property {string} etiqueta       - Nombre o etiqueta del inóculo
 * @property {number} cantidadActual - Cantidad disponible actualmente
 * @property {number} stockMinimo    - Nivel mínimo de stock
 * @property {string} creacion       - Fecha de creación (ISO string)
 */

/**
 * @typedef {'Agar' | 'Medio Líquido' | 'Semilla'} TipoInoculo
 */

export const TIPOS_INOCULO = [
    { value: 'Agar', label: 'Agar' },
    { value: 'Medio Líquido', label: 'Medio Líquido' },
    { value: 'Semilla', label: 'Semilla' },
];

export const TIPO_INOCULO_DEFAULT = TIPOS_INOCULO[0].value;