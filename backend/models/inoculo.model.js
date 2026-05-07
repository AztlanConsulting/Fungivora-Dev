// backend/models/inoculo.model.js
const db = require('../util/db');

module.exports = class Inoculo {

    // Obtiene todas las especies únicas registradas en la tabla Inoculos
    static fetchEspecies() {
        return db.execute(`
            SELECT DISTINCT especie
            FROM Inoculos
            WHERE especie IS NOT NULL
            ORDER BY especie ASC
        `);
    }

    /**
     * @description Obtiene los inóculos que coinciden con cierta especie y tipo
     * @param {string} especie - El nombre de la especie (por defecto es 'Shiitake').
     * @param {string} tipo - El tipo del inóculo (por defecto es 'Agar').
     * @returns {Promise} - Retorna una promesa con los inóculos de la consulta.
     * 
     * * IMPORTANTE: Asegúrate de que el nombre de la especie y el tipo sean correcton en la base de datos.
     */
    static fetchInoculosFiltrados(especie = 'Shiitake', tipo = 'Agar') {
        return db.execute(`
            SELECT *
            FROM Inoculos
            WHERE especie = ? AND tipo = ?
            ORDER BY fecha ASC
        `, [especie, tipo]);
    }

    /**
     * @description Obtiene los inóculos disponibles para ser usados como inóculo
     *              madre en la preparación de semillas. Solo devuelve registros de
     *              tipo 'Agar' y 'Medio Líquido' con cantidad_disponible > 0.
     * @returns {Promise} - Retorna una promesa con los inóculos disponibles.
     */
    static fetchInoculosParaSemilla() {
        return db.execute(`
            SELECT
                id_inoculo,
                codigo_fungivora,
                especie,
                tipo,
                cantidad_disponible,
                unidad,
                stock_recomendado
            FROM Inoculos
            WHERE tipo IN ('Agar', 'Medio Líquido')
              AND cantidad_disponible > 0
            ORDER BY especie ASC, fecha DESC
        `);
    }
};