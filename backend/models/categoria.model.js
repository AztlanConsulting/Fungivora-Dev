const db = require('../util/db');

module.exports = class Categoria {

    /**
     * @description Obtiene las categorias disponibles en la db
     * @returns {Promise} - Retorna una promesa con los nombres de todas las categorías.
     */
    static fetchCategorias() {
        return db.execute(`
            SELECT DISTINCT nombre_categoria AS categoria
            FROM Categorias
        `);
    }
    /**
     * @description Obtiene las opciones de una categoría, eligiendo el campo abreviado o el nombre completo.
     * @param {string} categoria - El nombre de la categoría (por defecto es 'Especies').
     * @param {boolean} abreviado - Si es true, se obtiene la abreviatura; si es false, el nombre completo.
     * @returns {Promise} - Retorna una promesa con las opciones de la categoría consultada.
     * 
     * * IMPORTANTE: Asegúrate de que el nombre de la categoría sea correcto en la base de datos.
     */
    static fetchOpciones(categoria = 'Especies', abreviado = false) {
        const campo = abreviado ? 'abreviatura_opcion' : 'nombre_opcion';

        return db.execute(`
            SELECT ${campo} AS opcion
            FROM Categorias
            WHERE nombre_categoria = ?
            ORDER BY ${campo} ASC
        `, [categoria]);
    }

    /**
     * @description Busca la abreviatura de una opción específica basándose en su nombre.
     * @param {string} categoria - El nombre de la categoría madre
     * @param {string} nombre - El nombre de la opción
     * @returns {Promise<string|null>} - La abreviatura o null si no se encuentra.
     */
    static async fetchAbreviaturaPorNombre(categoria, nombre) {
        const [rows] = await db.execute(`
            SELECT abreviatura_opcion 
            FROM Categorias 
            WHERE nombre_categoria = ? AND nombre_opcion = ?
            LIMIT 1
        `, [categoria, nombre]);
        
        return rows.length > 0 ? rows[0].abreviatura_opcion : null;
    }
};